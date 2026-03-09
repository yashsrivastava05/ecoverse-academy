

# Teacher Dashboard — Implementation Plan

## Current State
- No `user_roles` table exists — all users are implicitly students
- Login hardcodes redirect to `/dashboard`
- No teacher pages or layout exist
- `missions` table lacks `created_by` column for custom missions
- `mission_submissions` RLS only allows users to see their own submissions (teachers need cross-user access)

## Database Changes (4 migrations)

### Migration 1: User Roles Table
```sql
CREATE TYPE public.app_role AS ENUM ('student', 'teacher', 'school_admin');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles (avoids RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- Users can read their own roles
CREATE POLICY "Users can view own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Default all existing users to student role
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'student'::app_role FROM auth.users
ON CONFLICT DO NOTHING;
```

### Migration 2: Add teacher fields to missions
```sql
ALTER TABLE public.missions ADD COLUMN created_by uuid DEFAULT NULL;
ALTER TABLE public.missions ADD COLUMN expires_at timestamptz DEFAULT NULL;
ALTER TABLE public.missions ADD COLUMN school_only boolean DEFAULT false;

-- Teachers can insert missions they create
CREATE POLICY "Teachers can insert missions" ON public.missions
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'teacher') AND created_by = auth.uid());

-- Teachers can update their own missions
CREATE POLICY "Teachers can update own missions" ON public.missions
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'teacher') AND created_by = auth.uid());
```

### Migration 3: Teacher access to submissions
```sql
-- Teachers can view all submissions (for review)
CREATE POLICY "Teachers can view all submissions" ON public.mission_submissions
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'teacher'));

-- Teachers can update submissions (approve/reject)
CREATE POLICY "Teachers can update all submissions" ON public.mission_submissions
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'teacher'));

-- Add feedback column
ALTER TABLE public.mission_submissions ADD COLUMN teacher_feedback text DEFAULT NULL;
ALTER TABLE public.mission_submissions ADD COLUMN reviewed_by uuid DEFAULT NULL;
```

### Migration 4: Teacher notification access
```sql
-- Teachers can insert notifications for any user (to notify students)
CREATE POLICY "Teachers can insert notifications" ON public.notifications
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'teacher'));

-- Teachers can view all profiles (for student management)
-- (profiles already has "Users can view all profiles" SELECT policy with `true`)
```

## Auth Flow Changes

### `useAuth.tsx`
- After fetching profile, also fetch user's role from `user_roles` table
- Expose `role` in context: `'student' | 'teacher' | 'school_admin' | null`
- Add `has_role` helper function

### `AuthPages.tsx` (Login)
- After successful login, check role → redirect to `/teacher` if teacher/school_admin, else `/dashboard`

### `ProtectedRoute.tsx`
- Keep as-is for student routes

### New: `TeacherRoute.tsx`
- Checks `has_role('teacher')` or `has_role('school_admin')`
- If student, redirects to `/dashboard`
- If not logged in, redirects to `/login`

## New Files

| File | Purpose |
|------|---------|
| `src/components/layout/TeacherLayout.tsx` | Teacher nav bar with Overview/Submissions/Students/Missions/Leaderboard + orange "Teacher" pill |
| `src/components/TeacherRoute.tsx` | Role-gated route wrapper |
| `src/hooks/useTeacherData.ts` | All teacher queries: pending count, student list, submissions, class stats |
| `src/pages/teacher/TeacherOverview.tsx` | 4 stat cards + pending preview + class activity chart + top 5 students |
| `src/pages/teacher/TeacherSubmissions.tsx` | Full submission review with approve/reject, photo lightbox, feedback |
| `src/pages/teacher/TeacherStudents.tsx` | Student grid + detail drawer + bonus points |
| `src/pages/teacher/TeacherMissions.tsx` | All/custom missions tabs + create mission modal |
| `src/pages/teacher/TeacherLeaderboard.tsx` | Class leaderboard with podium + rankings table |

## Modified Files

| File | Change |
|------|---------|
| `src/App.tsx` | Add 5 teacher routes under `TeacherRoute` + `TeacherLayout` |
| `src/hooks/useAuth.tsx` | Fetch role from `user_roles`, expose in context |
| `src/pages/AuthPages.tsx` | Role-based redirect after login |

## Key Implementation Details

**TeacherLayout.tsx**: Sticky 68px header, white/blur backdrop, EcoQuest logo + orange "Teacher" pill (`bg-[#F4A261]`), center nav links, right side: teacher name + avatar + logout. No bottom mobile tab bar — teacher is desktop-first with responsive center nav collapsing to hamburger.

**TeacherOverview.tsx**: 
- 4 stat cards with left border colors (orange/green/blue/purple)
- Pending count from `mission_submissions` WHERE status='pending'
- Student count from `profiles` WHERE school_name matches teacher's school
- Weekly missions from `mission_submissions` WHERE status='approved' AND submitted_at > 7 days ago
- Class total from SUM of `profiles.eco_points` for matching school
- "Needs Review" section: 3 most recent pending, inline approve/reject
- 7-day bar chart using recharts (already installed)
- Top 5 students this week from `daily_points` aggregated

**TeacherSubmissions.tsx**:
- Filter tabs: All/Pending/Approved/Rejected with count badges
- Search by student name or mission name
- Large cards with photo display, location, notes
- Approve: updates status, awards points via RPC, creates notification
- Reject: reason dropdown + feedback, updates status, creates notification
- Pagination: 10 per page with "Load more"

**TeacherStudents.tsx**:
- 3-col grid of student cards with avatar, name, points, mini stats
- Right-side drawer (420px) with student details
- Bonus points: max 50, saves to `profiles.eco_points`, creates notification

**TeacherMissions.tsx**:
- All missions tab (read-only) with completion count per student
- Custom missions tab with create modal
- Create saves to `missions` with `created_by = teacher.id`

**TeacherLeaderboard.tsx**:
- Same podium style as student version but scoped to teacher's school
- Time filters: week/month/all-time
- Full rankings table below podium

**Scoping note**: Students are associated with teachers via `school_name` matching on profiles. The teacher sees all students from their school. "Add Student" modal allows inviting by email (creates a notification/placeholder).

## Execution Order
1. Run all 4 database migrations
2. Update `useAuth.tsx` to include role
3. Create `TeacherRoute.tsx`
4. Create `TeacherLayout.tsx`
5. Create `useTeacherData.ts`
6. Create all 5 teacher pages
7. Update `App.tsx` with teacher routes
8. Update `AuthPages.tsx` with role-based redirect

