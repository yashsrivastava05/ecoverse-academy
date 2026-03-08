

# EcoQuest Complete UI Redesign — "Warm Jungle" Theme

## Overview
Complete visual overhaul from dark bioluminescent theme to a warm, premium, light-mode design inspired by JungleAI. Every file touched: CSS variables, Tailwind config, all 8 pages, all game components, layout, and ecosystem viewer.

## Technical Approach

### Phase 1: Design System Foundation

**index.css** — Replace all CSS variables with warm palette:
- `--background`: warm cream `#F5F0E8`
- `--card`: pure white `#FFFFFF`
- `--primary`: jungle bright `#40916C`
- `--foreground`: deep green `#1B4332`
- New variables: `--jungle-deep`, `--jungle-mid`, `--jungle-light`, `--jungle-pale`, `--sun-gold`, `--sky-blue`, `--coral`, `--lavender`
- Replace all glow utilities with soft shadow utilities (`--shadow-card`, `--shadow-hover`, `--shadow-float`)
- Remove dark-mode gradients, noise textures, bioluminescent effects
- Add warm gradient mesh background (subtle cream-to-mint)
- Update all animation keyframes to be subtler and warmer

**tailwind.config.ts** — Update extended colors, add new shadow utilities, update font families (add "Cabinet Grotesk" as display font, keep Nunito/DM Sans/Syne Mono for stats)

**index.html** — Update Google Fonts import to include Cabinet Grotesk (from Fontshare or fallback to Syne)

### Phase 2: Core Components

**GameUI.tsx** — Redesign all components:
- `EcoPointsBadge`: white card with jungle-green text, leaf icon, soft shadow instead of glow
- `StatCard`: white card with thick colored left border, large stat number
- `LevelBadge`: pill badge with warm green background
- `StreakFlame`: warm orange/gold styling
- `BadgeCard`: white cards, earned = colored + shadow, locked = greyed with lock overlay
- `ProgressRing`: jungle-green stroke on light background

**EcosystemViewer.tsx** — Visual redesign:
- Warm sky gradients (cream/pale blue instead of dark)
- Earth tones for ground (warm browns, sage greens)
- Trees with thicker rounded SVG paths (illustrated sticker style)
- River in `--sky-blue` with warmer tones
- Keep all animation logic (sway, flow, butterflies, birds)
- Dark panel wrapper (`--bg-dark-panel: #1A2E1A`) around the viewer in dashboard for contrast
- Remove bioluminescent glows, add soft warm highlights

### Phase 3: Layout

**AppLayout.tsx** — Full redesign:
- Top nav: white background, 64px height, clean/minimal
  - Center: nav links with pill-style active indicator in jungle-green
  - Right: streak badge, EcoPoints counter (warm style), bell, avatar
- Desktop sidebar: remove (move nav to top center)
- Mobile bottom tab bar: frosted white glass style, jungle-green active indicator
- Background: warm cream `--bg-base` everywhere

### Phase 4: Pages (all 8)

**LandingPage.tsx** — JungleAI-inspired redesign:
- Warm cream background throughout
- Hero: two-column layout (left text 55%, right floating mockup 45%)
  - Pill badge: "🌿 1M+ Students Worldwide"
  - Cabinet Grotesk hero text: "Learning that grows with you."
  - Two CTAs: green primary + ghost secondary
  - Social proof avatars below
- Social proof ticker: dark green strip with scrolling school logos
- Features: 3-column grid with illustrated icons on pale green circles
- "How It Works": 4-step horizontal flow with dotted connector line
- Testimonial cards with slight rotations
- Dark green footer

**AuthPages.tsx** — Warm redesign:
- Cream background, white form cards with shadow
- Left panel: warm illustrated ecosystem scene
- Green primary buttons, rounded inputs (12px radius)
- Level preview badge in warm green

**OnboardingPage.tsx** — Warm styling:
- Cream background, white selection cards
- Green active states instead of glow effects
- Confetti colors updated to greens/golds

**DashboardPage.tsx** — Two-column layout:
- Left: Ecosystem viewer in dark green panel card (24px radius)
  - "Your Forest" label in cream text
  - Health bar + level badge below
- Right: 4 stat cards (white, left color border), daily missions, weekly chart, badges
- All cards: white background, `--shadow-card`, 20px radius
- Chart: jungle-green fill, warm tooltip styling

**MissionsPage.tsx** — Quest-style redesign:
- Dark green page header banner with cream text
- Pill filter tabs: active = jungle-green bg, inactive = white with border
- Mission cards: white cards with 120px colored gradient top band + emoji
  - Difficulty/category chips, EcoPoints display
  - Status badge top-right corner
- Mission detail: slide-in side panel (400px) instead of center modal

**LearnPage.tsx** — Gradient topic cards:
- Each topic: unique gradient background (deep green, blue, amber, violet etc.)
- White text, emoji top-left, lesson count chip, progress ring top-right
- Quiz: large white question card, tappable answer options with green/coral feedback
- Timer bar with draining animation

**LeaderboardPage.tsx** — Competition energy:
- "Who's Saving the Planet?" heading
- Custom podium with gold/silver/bronze gradient cards
- Shimmer animations on top 3 borders
- Clean table-style ranked list, alternating row backgrounds
- Sticky "Your Position" card

**ProfilePage.tsx** — Clean profile:
- White cards on cream background
- Stats grid with colored left borders
- Badge gallery: earned = colored + soft shadow, locked = greyscale + lock
- Ecosystem mini-view in dark green panel

### Phase 5: Polish

- All hover states: `translateY(-4px)` + shadow deepen (200ms ease)
- Click states: quick `scale(0.97)` press feel
- Staggered page load animations via Framer Motion `staggerChildren`
- Toast notifications: white cards with colored left border (4px), slide from right
- Update button component styling for warm green primary color

## Files to Modify
1. `index.html` — fonts
2. `src/index.css` — full CSS variable + utility rewrite
3. `tailwind.config.ts` — colors, shadows, fonts
4. `src/components/game/GameUI.tsx` — all component styling
5. `src/components/game/EcosystemViewer.tsx` — warm palette + illustrated style
6. `src/components/layout/AppLayout.tsx` — top nav + bottom tab bar redesign
7. `src/pages/LandingPage.tsx` — JungleAI-inspired layout
8. `src/pages/AuthPages.tsx` — warm auth forms
9. `src/pages/OnboardingPage.tsx` — warm onboarding
10. `src/pages/DashboardPage.tsx` — two-panel warm dashboard
11. `src/pages/MissionsPage.tsx` — quest cards redesign
12. `src/pages/LearnPage.tsx` — gradient topics + quiz
13. `src/pages/LeaderboardPage.tsx` — podium + competition UI
14. `src/pages/ProfilePage.tsx` — clean warm profile

No new dependencies needed. All existing libraries (Framer Motion, Recharts, canvas-confetti) continue to be used.

