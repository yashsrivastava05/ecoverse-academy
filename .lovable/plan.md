

# 4 Consolidated Fixes — Implementation Plan

## FIX 1: Role Selector on Signup

**Problem**: The `/signup` form has no role dropdown. After signup, no role is inserted into `user_roles` (and the table blocks INSERT via RLS anyway).

**Solution**:
- Add a `role` field to the signup form state (default: `'student'`)
- Add a `<Select>` dropdown between School and Create Account button with options: Student / Teacher / School Admin
- Pass the selected role as user metadata during `signUp` (e.g. `options.data.role`)
- Create a **database trigger** on `auth.users` insert (extend the existing `handle_new_user` function) to also insert into `user_roles` using the `raw_user_meta_data->>'role'` value
- This avoids RLS issues since `handle_new_user` is `SECURITY DEFINER`

**Database migration**: Update `handle_new_user()` to also insert a row into `user_roles` based on signup metadata. Default to `'student'` if no role specified.

**Files**: `src/pages/AuthPages.tsx` (add Select to SignupPage), one SQL migration

## FIX 2: Bold/Markdown Rendering in Lessons

**Problem**: The `renderMarkdown` function exists but article body still shows raw `**text**`. Looking at the code, the function IS applied via `dangerouslySetInnerHTML`. The issue is likely that the body contains more markdown than just bold — headers (`## Heading`), bullet lists (`- item`), etc.

**Solution**: Enhance `renderMarkdown` to handle:
- `## Heading` → `<h2>` and `### Heading` → `<h3>`
- `- item` or `* item` → `<li>` wrapped in `<ul>`
- Already handles `**bold**` and `*italic*`
- Process paragraphs more carefully: split by `\n\n`, then within each block check for headers/lists before wrapping in `<p>`

**File**: `src/pages/LessonReader.tsx` — rewrite the body rendering section

## FIX 3: Profile Stat Cards Left Borders

**Problem**: Looking at the code (lines 246-267 of ProfilePage), the stat cards already HAVE `borderLeft: '5px solid ${s.borderColor}'` and gradient backgrounds using CSS variable colors like `hsl(var(--jungle-bright))`. The user wants exact hex colors: `#40916C`, `#48CAE4`, `#F4A261`, `#B197FC` with 8% opacity tint backgrounds.

**Solution**: Replace the CSS variable border colors with exact hex values and update gradient tints:
- EcoPoints: border `#40916C`, bg tint `rgba(64,145,108,0.08)`
- Missions Done: border `#48CAE4`, bg tint `rgba(72,202,228,0.08)`
- Day Streak: border `#F4A261`, bg tint `rgba(244,162,97,0.08)`
- Badges: border `#B197FC`, bg tint `rgba(177,151,252,0.08)`

**File**: `src/pages/ProfilePage.tsx` lines 246-267

## FIX 4: Ecosystem Scene on Profile Page

**Problem**: The `EcosystemViewer` component IS already imported and used on the profile page (line 275). The user reports seeing "a plain brown rectangle" — this is actually what State 1 looks like (bare ground for low EcoPoints). However, the issue may be that the dark panel wrapper `bg-bg-dark-panel` isn't resolving, or the component needs the same dark-panel wrapping as the dashboard.

Looking at the dashboard (line 247): it wraps EcosystemViewer in `bg-bg-dark-panel p-4 shadow-float` with fireflies and leaf drifts.
Profile page (line 274): wraps in `bg-bg-dark-panel p-3 shadow-[var(--shadow-float)]`.

The component is being used correctly. The "brown rectangle" IS the ecosystem at State 1 (0-199 points). The `bg-bg-dark-panel` class resolves to `hsl(140 30% 13%)` which is dark green, not brown — the brown is the SVG ground color for State 1.

The fix is to ensure the EcosystemViewer is rendering properly with animations. Looking more carefully, the profile page already has the viewer. The issue might be CSS — the `bg-bg-dark-panel` Tailwind class may not work (it needs to be defined in tailwind config). Let me verify.

**Solution**: The component is already there and should work. Will verify the Tailwind config has `bg-dark-panel` mapped, and ensure the wrapper styling matches the dashboard exactly (with fireflies, leaf drifts, etc).

**File**: `src/pages/ProfilePage.tsx` — update the ecosystem section wrapper to match dashboard styling

---

## Files to Modify

| File | Change |
|------|--------|
| `src/pages/AuthPages.tsx` | Add role dropdown to SignupPage, pass role in metadata |
| `src/hooks/useAuth.tsx` | Pass role metadata through signUp function |
| `src/pages/LessonReader.tsx` | Enhanced markdown renderer for headers, lists, bold, italic |
| `src/pages/ProfilePage.tsx` | Fix stat card border colors to exact hex + enhance ecosystem wrapper |
| SQL migration | Update `handle_new_user()` to insert into `user_roles` |

## Execution Order
1. Database migration (extend `handle_new_user` trigger)
2. Update `useAuth.tsx` signUp to accept role
3. Update `AuthPages.tsx` signup form with role selector
4. Fix `LessonReader.tsx` markdown rendering
5. Fix `ProfilePage.tsx` stat cards + ecosystem wrapper

