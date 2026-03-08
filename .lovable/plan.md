

# FIX 1 — Leaderboard Always Populated + FIX 2 — Ecosystem Redesign

## FIX 1: Leaderboard Seeding

**File:** `src/pages/DashboardPage.tsx` (lines 303-328)

Merge 4 seeded bot entries into the leaderboard array before rendering:

```typescript
const SEEDED_USERS = [
  { id: 'bot-maya', full_name: '🌍 EcoBot Maya', avatar_emoji: '🌍', eco_points: 1850, school_name: 'Green Valley Academy' },
  { id: 'bot-arjun', full_name: '🌱 EcoBot Arjun', avatar_emoji: '🌱', eco_points: 1340, school_name: 'Sunrise School' },
  { id: 'bot-priya', full_name: '🌿 EcoBot Priya', avatar_emoji: '🌿', eco_points: 890, school_name: 'Nordic Nature School' },
  { id: 'bot-sam', full_name: '🌳 EcoBot Sam', avatar_emoji: '🌳', eco_points: 420, school_name: 'EcoQuest Community' },
];
```

- Combine real `dashboard.leaderboard` with seeded users
- Sort all by `eco_points` descending, take top 5
- Real user's row identified by `row.id === user?.id` and highlighted with green border (existing logic)
- Seeded entries distinguished by their emoji prefix in name (already in the name string)

## FIX 2: Ecosystem Complete Redesign

**File:** `src/components/game/EcosystemViewer.tsx` — full rewrite

Replace the entire component with a new SVG scene built from scratch with 6 distinct states based on `getEcosystemStage(ecoPoints)` (stages 0-5 map to the 6 states described; stage 6 maps to state 6/Planet Guardian).

Remap stages to match the request:
- State 1 "The Seed": stage 0 (0-199 pts)
- State 2 "Sprouting": stage 1 (200-599)
- State 3 "Growing": stage 2 (600-1199)
- State 4 "Thriving": stage 3 (1200-2499)
- State 5 "Forest": stages 4-5 (2500-9999)
- State 6 "Planet Guardian": stage 6 (10000+)

Key elements per state using pure SVG + CSS animations:

**State 1:** Warm amber-to-grey sky gradient. Dark brown curved ground with crack textures. Center: tiny seedling with 2 leaves, CSS `breathing` animation (scale 1→1.03). Single raindrop falling every 4s. Floating dust particles drifting upward.

**State 2:** Warmer blue sky with golden horizon. Thin grass strip. Plant with 4-6 swaying leaves (staggered CSS rotate). Butterfly on figure-8 path. Small flowers.

**State 3:** Blue sky with drifting clouds. Young tree with trunk + 3 branch clusters, gentle sway. Animated stream at bottom (gradient path with scroll animation). Bird V-shape crossing sky.

**State 4:** Fuller tree with 5-6 branch clusters. Wider stream with sparkle dots. Deer silhouette. 2 butterflies. Larger clouds.

**State 5:** Multiple trees (central large + 2 smaller). Waterfall strip in background. Several birds. Fireflies (blinking dots). Full grass coverage.

**State 6:** Maximum density. Subtle aurora in upper sky. All animals. Central tree with golden glow aura. All animations running.

**Animation approach:** All continuous animations use CSS `@keyframes` defined in `src/index.css`. New keyframes needed:
- `breathing` (scale 1↔1.03, 3s)
- `raindrop` (translateY with opacity, 4s)
- `dust-rise` (translateY upward + fade, 5s)
- `leaf-sway` (rotate -2deg↔2deg, 3s)
- `butterfly-path` (figure-8 using translate, 8s)
- `cloud-drift` (translateX 0→100%, 30s)
- `stream-flow` (translateX, 3s)
- `bird-fly` (translateX -50→850, 12s)
- `sparkle` (opacity 0→1→0, 2s)
- `firefly-glow` (opacity + slight translate, 2s)
- `aurora-wave` (opacity shift, 6s)
- `tree-glow-pulse` (filter brightness, 4s)

Growth transitions use Framer Motion `AnimatePresence` with spring scale 0→1 for new elements appearing when stage changes.

**Files modified:**
1. `src/components/game/EcosystemViewer.tsx` — complete rewrite
2. `src/index.css` — add new keyframes
3. `src/pages/DashboardPage.tsx` — leaderboard seeding logic (lines ~164-175 area + lines 303-328)

