

# Rebuild Dashboard Page — Premium Gamified Design

## What Changes
Complete rewrite of `src/pages/DashboardPage.tsx` with all inline data, richer visual hierarchy, and new sub-components. The existing `EcosystemViewer`, `GameUI` components, and `AppLayout` stay as-is — we only replace the dashboard page content.

## Layout
Two-column grid: left 380px fixed (ecosystem + mini leaderboard), right fills remaining space (greeting, stats, challenge banner, missions, chart+activity, badges). Single column on mobile.

## Sections to Build (all in DashboardPage.tsx)

### Left Column
1. **Ecosystem Card** — reuse `<EcosystemViewer>` inside a dark `#1A2E1A` rounded card. Below the SVG: "🌳 Your Ecosystem" title, "🌿 Sprout · Lv 3" pill, health progress bar (animated from 0 to 72%), two mini stat boxes (trees planted, CO₂ saved). Add CSS fireflies (6-8 tiny glowing dots with staggered opacity animation) overlaid on the scene.

2. **Mini Leaderboard Card** — white card with 5 rows from inline data. Rank medals (🥇🥈🥉), avatar emoji circles, name+school, points, change indicator. "You" row highlighted with pale green bg + left green border.

### Right Column
1. **Greeting Bar** — "Good morning, Rohan! 🌞" heading + streak motivational text. Date chip on right.

2. **4 Stat Cards** — horizontal grid. Each: white card, 4px colored left border, decorative background emoji (opacity 0.12), uppercase label, large Nunito 900 number (count-up animation via `useEffect` + `requestAnimationFrame`), trend text. Cards: EcoPoints (green), Streak (orange), Level (blue), Rank (purple). Staggered fade-up entrance.

3. **Seasonal Challenge Banner** — full-width gradient card (dark green gradient). Large emoji, uppercase label, title, animated progress bar (58%), school progress text, countdown "5d remaining", decorative rotating leaf.

4. **Today's Quests** — 3 mission cards in a grid. Each card: colored gradient top band (72px) with centered emoji (bob animation), status badge top-right, card body with title, description, difficulty+time chips, points + CTA button. Second card shows in-progress state with thin progress bar at bottom.

5. **Weekly Chart + Activity** — two cards side by side. Left: CSS bar chart (7 bars, staggered height animation, today's bar in gradient green with glow). Right: 4 activity rows with colored icon circles, action text, timestamp, points earned.

6. **Badge Gallery** — horizontal scroll of 6 badges. Earned: colored bg + shadow, hover scale+rotate. Locked: grayscale + lock overlay.

## Animation System
- Page load: Framer Motion `staggerChildren: 0.08` on container, each section `fadeUp` variant
- Stat numbers: JS counter from 0 using requestAnimationFrame over 1.2s
- Progress bars: Framer `initial={{ width: 0 }}` → `animate={{ width: 'X%' }}`
- Mission emoji: CSS `bob` keyframe (translateY 0→-4px→0, 2.5s)
- Challenge leaf: CSS rotate 0→360deg, 8s linear infinite
- Card hovers: `whileHover={{ y: -4 }}` + shadow transition
- Card clicks: `whileTap={{ scale: 0.97 }}`
- Bar chart: CSS `@keyframes growBar` with staggered `animation-delay`

## Mock Data
All data inline in the component file (user, missions, leaderboard, weekly chart, activity, badges) per the spec — no changes to mock-data.ts needed since this uses dashboard-specific display data.

## Files Modified
- `src/pages/DashboardPage.tsx` — full rewrite
- `src/index.css` — add `bob`, `firefly-blink`, `rotate-slow` keyframes + utility classes

## No New Dependencies
Uses existing Framer Motion for entrance animations. Chart is pure CSS bars (no Recharts). All within current stack.

