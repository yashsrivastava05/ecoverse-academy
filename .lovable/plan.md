

# Build Complete Profile Page

## Overview
Replace the current mock-data-based ProfilePage with a fully dynamic, Supabase-backed profile page with 5 sections: Hero (with edit mode + avatar picker), Stats row, Ecosystem snapshot, Badge gallery (12 badges), and Activity history with pagination.

## Database Changes
**Add `city` column to profiles table** via migration:
```sql
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS city text DEFAULT '';
```
No other schema changes needed.

## Files Modified

### 1. `src/pages/ProfilePage.tsx` — Complete rewrite
The main page component. Uses `useAuth` for profile data and a new `useProfileData` hook for profile-specific queries.

**Structure:**
- Hero card with avatar (96px), name, school, city, level/points/member-since pills, "Edit Profile" button
- Edit mode: inline inputs for name, school, city with Save/Cancel
- Avatar picker: Dialog with the 6 AVATARS from onboarding, saves to `profiles.avatar_emoji`
- 4 stat cards (EcoPoints, Missions Done, Day Streak, Badges) with countUp animation
- Ecosystem snapshot: 55/45 split — left has `<EcosystemViewer>`, right has health bar + 4 mini stats (trees, CO2, water, waste) + motivational line
- Badge gallery: 4-column grid, 12 badges, earned = colored with glow, locked = grayscale + lock icon
- Activity history: fetches last 20 submissions, color-coded by status, filter dropdown, "Load more" pagination, empty state

### 2. `src/hooks/useProfileData.ts` — New hook
Profile-specific queries:
- `missionsCompleted`: count of approved submissions
- `treesPlanted`: approved planting missions count  
- `waterMissions`: approved water missions count
- `wasteMissions`: approved waste missions count
- `allSubmissions`: paginated submissions with mission join (limit 20, offset-based)
- `weeklyPoints`: sum of last 7 days for trend
- `monthlyMissions`: approved count this month
- `totalBadgeData`: category counts for badge calculations
- `updateProfile` mutation: updates name, school, city
- `updateAvatar` mutation: updates avatar_emoji

### 3. `src/hooks/useAuth.tsx` — Minor update
Add `city` to the Profile interface.

### 4. Badge Logic (12 badges)
All calculated from real data in the hook:
1. First Steps — any approved submission exists
2. On Fire — streak_days >= 7
3. Water Guardian — 5+ approved water missions
4. Recycling Hero — 5+ approved waste missions
5. Tree Hugger — 3+ approved planting missions
6. Eco Scholar — 10+ lesson completions (placeholder: eco_points >= 1000)
7. Top 10 — realUserCount >= 10 AND rank <= 10
8. Globe Trotter — approved missions in 3+ different categories
9. Quick Learner — placeholder: eco_points >= 500
10. Team Player — placeholder: eco_points >= 800
11. Early Bird — placeholder: eco_points >= 400
12. Night Owl — placeholder: eco_points >= 600

Badges without trackable data (lessons, quizzes, time-of-day) use point thresholds as placeholders until those features exist.

### 5. Database migration
Add `city` column to profiles.

## Key Design Decisions
- Reuse `EcosystemViewer` component as-is for the ecosystem snapshot
- Reuse `useCountUp` pattern from DashboardPage
- Avatar picker uses same `AVATARS` array as OnboardingPage
- Activity history pagination via offset state + "Load more" button
- All stat calculations from real Supabase data
- Edit mode uses local state, saves via mutation, shows toast on success

