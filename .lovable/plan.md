

# 4 Surgical Fixes

## FIX 1 — Rank includes seeded bots

**Problem:** Rank query only counts real DB users. Seeded bots (1850, 1340, 890, 420 pts) aren't factored in.

**Fix in `DashboardPage.tsx` (~line 148 and ~line 350):** After getting `dashboard.rank` from DB (real users only), compute adjusted rank by counting how many seeded bot point values are above `profile.eco_points`, then add that to the DB rank. Use this `adjustedRank` for the stat card and `useCountUp`.

```
const SEEDED_POINTS = [1850, 1340, 890, 420];
const botsAbove = SEEDED_POINTS.filter(p => p > profile.eco_points).length;
const adjustedRank = dashboard.rank + botsAbove;
```

Also update the rank trend text on line 350 to use `adjustedRank`.

## FIX 2 — Trees Planted from real data

**Problem:** `treesPlanted` is `Math.floor(eco_points / 200)` — not based on actual approved planting missions.

**Fix:** Add a `treesPlanted` value to `useDashboardData.ts` — a new query counting approved submissions where the joined mission's category is `'planting'`. In `DashboardPage.tsx`, replace `Math.floor(profile.eco_points / 200)` with `dashboard.treesPlanted`.

New query in `useDashboardData.ts`:
```sql
SELECT count(*) FROM mission_submissions ms
JOIN missions m ON ms.mission_id = m.id
WHERE ms.user_id = userId AND ms.status = 'approved' AND m.category = 'planting'
```

## FIX 3 — Top 10 badge requires 10+ real users

**Problem:** Badge unlocks when `dashboard.rank <= 10`, but with only 1 real user that's always true.

**Fix in `DashboardPage.tsx` line 205:** Add a `realUserCount` to `useDashboardData` (count of all profiles). Badge condition becomes:
```
b.name === 'Top 10' && realUserCount >= 10 && dashboard.rank <= 10
```

New query in `useDashboardData.ts`: `select count(*) from profiles` → exposed as `realUserCount`.

## FIX 4 — Ecosystem auto-zoom

**Fix in `EcosystemViewer.tsx`:** Wrap the SVG in a container that applies a CSS transform based on state, with a 1.2s ease-out transition. Add wheel/pinch zoom handling and a reset button.

Zoom config per state:
- State 1: `scale(1.8) translateY(15%)`
- State 2: `scale(1.5) translateY(10%)`
- State 3: `scale(1.2) translateY(5%)`
- State 4: `scale(1.1) translateY(2%)`
- State 5-6: `scale(1)` (no zoom)

Add `useState` for manual zoom override (0.8–2.5 range via wheel events). Show a ⟳ reset button when manually zoomed. Reset animates back to default with 0.6s transition.

---

**Files modified:**
1. `src/hooks/useDashboardData.ts` — add `treesPlanted` query + `realUserCount` query
2. `src/pages/DashboardPage.tsx` — adjusted rank calc, real treesPlanted, Top 10 badge fix
3. `src/components/game/EcosystemViewer.tsx` — auto-zoom + manual zoom + reset

