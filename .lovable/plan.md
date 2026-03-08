

# EcoQuest Dashboard — Full Optimisation Plan

## Critical Blocker: No Backend Connected

This project has **no Supabase or Lovable Cloud connection**. The entire request requires a database backend for:
- User authentication (login/signup)
- Storing profiles, eco_points, streaks, levels
- Mission submissions with photo uploads (Supabase Storage)
- Leaderboard queries across all users
- Notifications table
- Weekly activity tracking
- Auto-approval edge function

**Before any implementation can begin, you must connect either Lovable Cloud (recommended) or an external Supabase project.**

---

## Once Backend is Connected — Implementation Plan

### Phase 1: Database Schema (Supabase migrations)

Create these tables with RLS:

```text
profiles          → id (FK auth.users), full_name, avatar_emoji, eco_points, streak_days, 
                    last_active_date, interests[], daily_goal, school_name, created_at
missions          → id, title, description, category, difficulty, eco_points_reward, 
                    requires_photo, requires_location, icon, steps[]
mission_submissions → id, user_id (FK), mission_id (FK), status (enum), photo_url, 
                      location_coords, notes, submitted_at, reviewed_at
notifications     → id, user_id (FK), title, body, type (enum), is_read, created_at
daily_points      → id, user_id (FK), date, points_earned
```

Seed the `missions` table with the 10 existing mock missions.

### Phase 2: Auth Integration

- **AuthPages.tsx**: Replace fake navigation with real `supabase.auth.signUp()` / `signInWithPassword()`
- **OnboardingPage.tsx**: On finish, upsert the `profiles` row with chosen avatar, interests, daily_goal
- **App.tsx**: Add auth context provider, protect `/dashboard/*` routes with auth guard redirecting to `/login`
- **AppLayout.tsx**: Pull user profile from context, show real name + avatar

### Phase 3: Dashboard Data Layer (`src/hooks/useDashboardData.ts`)

Create a custom hook using `@tanstack/react-query` that fetches:
- User profile (name, eco_points, streak, avatar)
- Level calculated via `getLevelForPoints()`
- Rank via `select count(*) from profiles where eco_points > current_user.eco_points` + 1
- Top 5 leaderboard entries
- User's mission submissions (to determine card statuses)
- Last 7 days from `daily_points` table
- Last 4 activity items from `mission_submissions`
- Unread notification count

### Phase 4: Dashboard UI Updates (`DashboardPage.tsx`)

- Replace all hardcoded `user.*` references with hook data
- Dynamic greeting based on `new Date().getHours()`
- Dynamic date chip using `Intl.DateTimeFormat`
- Loading skeleton while data fetches
- Empty states for new users (activity feed, chart, leaderboard)
- Count-up animation triggers after data loads (not on mount)
- Mission card status reflects real submission status
- Ecosystem scene matches user's actual level stage

### Phase 5: Mission Action Flows

**Accept button**:
- Insert `mission_submissions` row with status `in_progress`
- Optimistic UI update via react-query mutation
- Toast: "Quest accepted!"

**Continue button → Proof Submission Modal**:
- New component: `ProofSubmissionSheet.tsx` (slide-in sheet using vaul Drawer)
- Photo upload to Supabase Storage bucket `mission-photos`
- Optional geolocation capture via `navigator.geolocation`
- Notes textarea
- On submit: update submission row with photo_url, coords, notes, status `pending`
- Toast: "Proof submitted!"

### Phase 6: Auto-Approval & Points

- **Edge function** `auto-approve`: runs on a cron or is triggered client-side
- Simpler approach: on dashboard load, check for submissions older than 2 min with status `pending` → auto-approve them, award points, create notification
- On approval: increment `profiles.eco_points`, insert `daily_points` row, insert notification, update submission status
- If points cross level threshold → insert level-up notification

### Phase 7: Streak Logic

- On dashboard load: compare `profiles.last_active_date` with today
- Yesterday → increment streak, update last_active_date
- Today → no-op
- Older → reset streak to 1
- Streak milestones (7, 14, 30) → insert notification + toast

### Phase 8: Notifications

- `AppLayout.tsx`: query unread count from `notifications` table
- Bell dropdown: query last 10 notifications ordered by created_at desc
- "Mark all read": update all user's notifications to is_read=true

---

## Files Created/Modified

| File | Action |
|------|--------|
| `src/integrations/supabase/` | Auto-generated client + types |
| SQL migrations (5-6) | Tables, RLS, seed data, storage bucket |
| `src/hooks/useAuth.tsx` | Auth context + session management |
| `src/hooks/useDashboardData.ts` | All dashboard queries |
| `src/pages/AuthPages.tsx` | Real Supabase auth |
| `src/pages/OnboardingPage.tsx` | Profile upsert on finish |
| `src/pages/DashboardPage.tsx` | Replace mock data with hook, add empty states, action handlers |
| `src/components/ProofSubmissionSheet.tsx` | New proof modal |
| `src/components/layout/AppLayout.tsx` | Real user data, notifications |
| `src/App.tsx` | Auth guard wrapper |
| Edge function `auto-approve` | Auto-approval logic |

---

## Next Step Required

**You need to connect a backend first.** I recommend Lovable Cloud — it provides managed Supabase with automatic configuration. Would you like to connect Lovable Cloud or an external Supabase project?

