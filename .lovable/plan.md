

# Dashboard Page Complete Rebuild

## Current State
The dashboard at `/dashboard` is currently **blank** — the top nav renders correctly but no content appears below it. The existing code references `EcosystemViewer`, `GameUI` components, and Recharts, but nothing is visible. This rebuild will fix that and deliver the premium gamified dashboard.

## What Will Be Built

### File 1: `src/pages/DashboardPage.tsx` — Full Rewrite
Complete rewrite with all data inline. No Recharts dependency — pure CSS bar chart instead.

**Two-column layout**: Left (380px fixed) + Right (fluid)

**Left Column:**
1. **Ecosystem Viewer Card** — Dark `#1A2E1A` rounded card wrapping `<EcosystemViewer>`. Below: "🌳 Your Ecosystem" title, "🌿 Sprout · Lv 3" pill badge, animated health progress bar (0→72%), two mini stat boxes (7 Trees Planted, 24kg CO₂ Saved). CSS firefly dots overlaid (6 glowing dots with staggered blink animation).

2. **Mini Leaderboard Card** — White card, 5 rows with rank medals (🥇🥈🥉), avatar emoji circles, name+school, points, change arrows. Row 4 "Rohan (You)" highlighted with pale green background + left green border.

**Right Column (6 sections stacked):**
1. **Greeting Bar** — "Good morning, Rohan! 🌞" + streak motivational text. Date chip on right ("📅 Sun, 8 Mar 2026").

2. **4 Stat Cards** — Horizontal grid with animated count-up numbers (useEffect + requestAnimationFrame). Each card: white bg, 4px colored left border, decorative bg emoji at 12% opacity, uppercase label, large number, trend text. EcoPoints (green) / Streak (orange) / Level (blue) / Rank (purple). Staggered entrance with 80ms delay.

3. **Seasonal Challenge Banner** — Full-width dark green gradient card. Large 🌧️ emoji, "SEASONAL CHALLENGE · ACTIVE" label, title, animated progress bar (0→58%), school progress text, "5d remaining" countdown, decorative rotating 🌿 leaf.

4. **Today's Quests** — 3 mission cards in grid. Each: colored gradient top band (72px) with bobbing emoji, status badge, title, description, difficulty+time chips, points + CTA button. Card 2 shows "In Progress" with 65% progress bar.

5. **Weekly Chart + Activity** — Side by side. Left: Pure CSS 7-bar chart with staggered height animation, today's bar in gradient green with glow. Right: 4 activity rows with colored icon circles, action text, timestamps, points.

6. **Badge Gallery** — Horizontal scroll of 6 badges. Earned: colored + shadow + hover scale/rotate. Locked: grayscale + lock overlay.

**Animations:**
- Framer Motion `staggerChildren: 0.08` for page entrance
- JS count-up for stat numbers (requestAnimationFrame, 1.2s)
- CSS `@keyframes bob` for mission emojis
- CSS `@keyframes firefly-blink` for ecosystem fireflies  
- CSS `@keyframes rotate-slow` for challenge leaf
- CSS `@keyframes growBar` for chart bars with staggered delays
- `whileHover={{ y: -4 }}` + shadow transition on all cards
- `whileTap={{ scale: 0.97 }}` press feel

### File 2: `src/index.css` — Add New Keyframes
Add these keyframes and utility classes:
- `@keyframes bob` — translateY(0 → -4px → 0), 2.5s
- `@keyframes firefly-blink` — opacity 0→1→0, 2s with staggered delays
- `@keyframes rotate-slow` — rotate 0→360deg, 8s linear infinite
- `@keyframes growBar` — scaleY(0→1), 0.6s ease-out
- Corresponding `.animate-bob`, `.animate-firefly`, `.animate-rotate-slow` utility classes

### Responsive Behavior
- Desktop (1280px+): Two-column as described
- Tablet (768-1280px): Single column, stat cards 2×2 grid, missions 2-col
- Mobile (<768px): Single column, full width, shorter ecosystem viewer

### Signup→Dashboard Flow
Already works correctly: Signup → `/onboarding` → confetti → `/dashboard`. Login → `/dashboard` directly. No routing changes needed.

## Files Modified
1. `src/pages/DashboardPage.tsx` — complete rewrite
2. `src/index.css` — add keyframes

