

# 4 Fixes — Implementation Plan

## FIX 1: Teacher Redirect After Onboarding
**File**: `src/pages/OnboardingPage.tsx` line 41

Change `setTimeout(() => navigate('/dashboard'), 2000)` to check `role` from `useAuth()`:
- If role is `'teacher'` or `'school_admin'` → navigate to `/teacher`
- Otherwise → navigate to `/dashboard`

Already have access to `role` via `useAuth()` — just destructure it.

## FIX 2: Teacher Onboarding Flow
**File**: `src/pages/OnboardingPage.tsx`

Add role-aware branching. When `role === 'teacher' || role === 'school_admin'`:
- Show a 2-step flow instead of the 4-step student flow
- Step 1: Welcome + school name input + subject input
- Step 2: "You're all set!" with CTA to enter teacher dashboard
- `finish` saves `school_name` to profiles and redirects to `/teacher`

Student flow remains unchanged.

## FIX 3: Forest Name — Use Full Name
**Files**: `src/pages/DashboardPage.tsx` line 265, `src/pages/ProfilePage.tsx` line 283

- Dashboard: Change `{firstName}'s Forest` → `{profile.full_name}'s Forest`
- Profile: Change `{profile.full_name.split(' ')[0]}'s Forest` → `{profile.full_name}'s Forest`

## FIX 4: Ecosystem Scene on Profile
The profile page already imports `EcosystemViewer` and wraps it with fireflies/leaf drifts (lines 274-282). The component receives `ecoPoints={profile.eco_points}`. This should already work for all users. The `bg-bg-dark-panel` class and animations are present. No code change needed here — this was already fixed in the previous round.

## Files to Modify
| File | Change |
|------|--------|
| `src/pages/OnboardingPage.tsx` | Role-based redirect + teacher onboarding flow |
| `src/pages/DashboardPage.tsx` | Line 265: full name for forest |
| `src/pages/ProfilePage.tsx` | Line 283: full name for forest |

