

# Dashboard Surgical Fix Round 2

## Fix 1 — Hover Return Speed
**Problem**: Framer Motion's `whileHover` applies a fast `transition: { duration: 0.15 }` on hover-in, but on hover-out it falls back to the element's base `transition` prop (0.5s from the entrance animation). This makes the return feel sluggish.

**Fix**: Add `transition: { duration: 0.15 }` to the base `animate` transition for all interactive cards, OR better — move the hover transition config to the top-level `transition` prop and use separate `initial`/`animate` transitions for entrance only. The cleanest approach: override the base transition after mount. Since Framer Motion uses the element's `transition` prop for both directions of `whileHover`, we need to set the base transition to 0.15s and use a delayed entrance via `initial`/`animate` with their own timing.

Affected elements (lines):
- Stat cards (251-266): Add base transition override
- Mission cards (327-384): Same
- Ecosystem card (135-198): Same
- Leaderboard card (201-237): Same
- Badge gallery items (475-503): Already using spring, fine
- Weekly chart + activity wrapper (390-461): Same

## Fix 2 — Count-Up Starting Wrong
**Problem**: `useCountUp` runs immediately on mount (line 79-92). The animation fires before the cards are visible due to Framer Motion entrance delays.

**Fix**: Add a `delay` parameter to `useCountUp`. Use `setTimeout` to defer the `requestAnimationFrame` loop start. Set delays: ecoPoints 500ms, streak 620ms, rank 740ms. Level doesn't count (already text). This ensures counting starts after cards fade in (0.2s base + stagger).

## Fix 3 — Badges Clipped on Hover
**Problem**: The badge scroll container at line 473 has `overflow-x-auto` which clips the scaled badges. The badge items scale to 1.15 + rotate on hover but get cut off.

**Fix**: 
- Add `overflow-visible` to the outer badge container and use a wrapper approach: keep `overflow-x-auto` on an inner scroll div but add padding so scaled badges have room.
- Simpler: change `overflow-x-auto` to `overflow-x-clip` won't work. Best: add `py-4 -my-4` padding hack so vertical overflow has room, and keep `overflow-x-auto`.

## Fix 4 — Stat Card Watermark Opacity + Twemoji
**Problem**: Watermark emojis at `opacity-[0.08]` are invisible. System emojis look cheap.

**Fix**:
- Increase opacity to `0.18`
- Replace emoji text with `<img>` tags loading Twemoji SVGs from `https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/`. Unicode codepoints: 🌿=1f33f, 🔥=1f525, ⭐=2b50, 🏆=1f3c6. Same for badges: 🌱=1f331, 🔥=1f525, 💧=1f4a7, 🌳=1f333, 🏆=1f3c6, ♻️=267b.

Create a helper function `twemoji(emoji_codepoint)` that returns the CDN URL.

## Files Modified
1. `src/pages/DashboardPage.tsx` — all 4 fixes

