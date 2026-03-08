

# Dashboard Fix & Upgrade Plan

## File 1: `src/pages/DashboardPage.tsx` — Targeted Fixes

### Fix 1 — Weekly Chart (lines 337-356)
Replace the broken bar chart with a working implementation. The issue is that `height: X%` inside a flex container doesn't work as expected — the bars have `flex-1` parent but percentage height doesn't resolve. Fix: use explicit pixel heights relative to the 140px container, add hover tooltip state, and use inline styles with proper height calculation.

- Each bar: explicit `height` in px (`value/100 * 130`), not `%`
- Add `useState` for hovered bar index to show tooltip pill above bar
- Tooltip: absolute positioned pill with `#1B4332` bg, white text, shows points (value × 7 rounded)
- Staggered CSS animation via `animationDelay`

### Fix 2 — Hover Speeds
Update all Framer Motion `transition` props and inline `transition` CSS:
- Card `whileHover`: add `transition: { duration: 0.15 }` 
- Buttons: `transition: all 0.12s ease` via className
- Leaderboard rows: already use `transition-colors`, keep as-is (fast enough)
- Badge hover: add `transition: { type: 'spring', stiffness: 500, damping: 15 }` for springy feel

### Fix 3 — Ecosystem Scene Personalization
- Change "🌳 Your Ecosystem" → "🌳 Rohan's Forest" (line 135)
- Add milestone text below: "Growing since Day 1 · 7 trees strong"
- Add 2 drifting leaf elements (absolute positioned `🍃` with CSS `leafDrift` animation)
- Health bar: add shimmer animation class
- Ecosystem card: add `cardGlow` animation via inline style

### Fix 4 — Stat Cards
- Number size: `text-[32px]` instead of `text-[28px]`
- Background emoji: `text-[36px]` instead of `text-[28px]`, add `rotate(10deg)`
- Add gradient tint backgrounds per card via inline `style`
- Left border: `border-l-[5px]` instead of `border-l-4`
- Trend text: add colored arrow icons, use `font-heading font-bold` for trend

### Fix 5 — Challenge Banner
- Padding: `p-[22px_26px]` 
- Progress bar: `h-2` (8px), add shimmer class to fill
- Add live pulse dot (8px green circle with CSS animation) before label
- Countdown: wrap in frosted pill div, increase text to `text-[28px]`
- Decorative leaf: `text-[80px]`, `opacity-[0.14]`, animation duration 12s

### Fix 6 — Badges
- Earned: `w-16 h-16` (64px), `rounded-[18px]`, colored box-shadow per badge, `border-2 border-white/80`, emoji `text-[28px]`, name label darker
- Locked: `w-[52px] h-[52px]`, `rounded-[14px]`, centered 🔒 at 14px
- Add "+3 more to unlock →" pill at end of scroll row
- Springy hover via Framer spring transition

### Additional Polish
- Mission progress bar: `h-[5px]`, add shimmer class
- Leaderboard "You" row: `border-l-[4px]`, gradient bg, bolder name
- Activity icons: ensure `w-10 h-10 rounded-xl` with distinct bg colors (already correct)
- Page load stagger: update delay values to match spec sequence

## File 2: `src/index.css` — New Keyframes
Add these new keyframes and utilities:
- `@keyframes leafDrift` — translateY(-20px→300px) + rotate + translateX, 6s/9s
- `@keyframes cardGlow` — box-shadow pulse 4s
- `@keyframes livePulse` — expanding ring 2s
- `.animate-leaf-drift`, `.animate-card-glow`, `.animate-live-pulse` utility classes

No structural changes to layout, colors, fonts, or routing.

