

# Fix 3 Leaderboard & Teacher Routing Bugs

## BUG 1 — Teacher routing broken

**Root cause**: In `useAuth.tsx`, `setLoading(false)` fires *before* `fetchProfile()` and `fetchRole()` complete. The role is still `null` when `TeacherRoute` evaluates `isTeacher`, so it sees `false` and redirects to `/dashboard`.

**Fix in `useAuth.tsx`**:
- Make `setLoading(false)` wait until BOTH `fetchProfile` and `fetchRole` resolve
- In `onAuthStateChange`: await both fetches before setting loading false (remove the `setTimeout`)
- In `getSession`: same — await both, then set loading false
- Add a `roleLoaded` flag so route guards don't render until role is known

**Fix in `ProtectedRoute.tsx`**:
- Also check `role` and `isTeacher` — if user is a teacher hitting a student route like `/dashboard`, redirect to `/teacher`

## BUG 2 — Teachers in student leaderboard

**Root cause**: The student leaderboard queries `profiles` without filtering out teacher/admin users. The `user_roles` table has RLS that only lets users see their *own* roles, so a student can't query teacher user_ids to exclude them.

**Fix — database migration**: Create a `SECURITY DEFINER` function `get_non_student_user_ids()` that returns user_ids with teacher/school_admin roles. This bypasses RLS.

```sql
CREATE OR REPLACE FUNCTION public.get_non_student_user_ids()
RETURNS uuid[]
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT COALESCE(array_agg(DISTINCT user_id), '{}')
  FROM public.user_roles
  WHERE role IN ('teacher', 'school_admin')
$$;
```

**Fix in `useLeaderboardData.ts`**:
- Before fetching profiles, call `supabase.rpc('get_non_student_user_ids')` to get excluded IDs
- Filter them out of results in both `fetchAllTimeLeaderboard` and `fetchTimePeriodLeaderboard`

## BUG 3 — My School tab empty

**Root cause**: Query runs with empty `schoolFilter` when profile hasn't loaded yet, returning nothing.

**Fix in `useLeaderboardData.ts`**:
- Already has `enabled: scope === 'global' || !!schoolName` — but `schoolName` is derived from `profile?.school_name ?? ''`, and empty string is truthy! Fix: use `profile?.school_name || undefined` so empty string becomes falsy.

**Fix in `LeaderboardPage.tsx`**:
- When scope is `my_school` and `profile?.school_name` is empty/null, show message: "Add your school name in Profile settings to see your school's leaderboard."

## Files to modify

| File | Change |
|------|--------|
| SQL migration | Add `get_non_student_user_ids()` function |
| `src/hooks/useAuth.tsx` | Await fetchProfile + fetchRole before setLoading(false) |
| `src/components/ProtectedRoute.tsx` | Redirect teachers to `/teacher` |
| `src/hooks/useLeaderboardData.ts` | Exclude teachers via RPC; fix empty school_name guard |
| `src/pages/LeaderboardPage.tsx` | Show message when school_name missing |

## Execution order
1. Database migration (RPC function)
2. Fix `useAuth.tsx` loading race
3. Fix `ProtectedRoute.tsx` teacher redirect
4. Fix `useLeaderboardData.ts` teacher exclusion + school guard
5. Fix `LeaderboardPage.tsx` empty school message

