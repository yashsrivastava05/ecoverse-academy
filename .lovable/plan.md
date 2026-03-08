

# Changes to Implement

## 1. Signup School Field — Text Input with Suggestion
Replace the school dropdown in `AuthPages.tsx` with a free-text input field. Add "Maharana Pratap" to `MOCK_SCHOOLS` in `mock-data.ts`. Show a datalist/autocomplete with existing schools (including Maharana Pratap) as suggestions, but allow typing any school name.

**Files**: `src/pages/AuthPages.tsx`, `src/lib/mock-data.ts`

## 2. Recreate Dashboard Page
Rebuild `DashboardPage.tsx` with a more polished, game-like layout per the original design spec:

- **Welcome header** with user greeting + daily goal progress ring
- **Left panel (40%)**: Ecosystem viewer in dark panel with health bar, level badge, trees planted / CO2 saved stats — keep existing structure but add a seasonal challenge banner card with countdown and progress bar
- **Right panel (60%)**:
  - 4 stat cards row (EcoPoints, Streak, Level, Rank) — same structure, better spacing
  - **Daily Missions section** with 3 mission cards — add thin progress indicators for partially complete missions, clickable cards that navigate to missions
  - **Weekly Chart + Recent Activity** side by side — area chart left (60%), activity timeline right (40%)
  - **Upcoming Challenge banner** — seasonal challenge card with countdown timer, progress bar, and 1.5x multiplier badge
  - **Recent Badges strip** — horizontal scroll with earned/locked states

**File**: `src/pages/DashboardPage.tsx`

## 3. Recreate Missions Page
Rebuild `MissionsPage.tsx` with enhanced quest-style energy:

- **Page header banner** — dark green panel with title, subtitle, mission count stats, and AI Recommended sparkle badge
- **AI Recommended section** — 3 personalized mission cards with "AI Pick" badges and reasoning text
- **Category filter bar** — horizontal pill tabs with active state animation, plus difficulty filter dropdown
- **Mission cards grid** (2 columns desktop, 1 mobile) — each card:
  - 120px gradient top band with large centered emoji
  - Difficulty badge (top-right corner overlay on the gradient)
  - Card body: title, description (2-line clamp), requirement chips (photo, location, teacher approval), EcoPoints reward, "Start" CTA button
  - Hover: lift + shadow deepen
- **Mission Detail side panel** — slides from right, includes steps, photo upload zone, location tag, notes textarea, submit button — keep existing but polish styling
- **Empty state** when no missions match filters

**File**: `src/pages/MissionsPage.tsx`

