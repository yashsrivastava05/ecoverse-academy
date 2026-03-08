

# Onboarding Page Updates

## 1. Increase Interest Selection Limit
Change `toggleInterest` (line 25) from `prev.length < 3` to `prev.length < 6` — allow selecting all 6 interests. Update the label text from "Choose up to 3" to "Choose the areas you care about".

## 2. Recreate Daily Goals Step (Step 3)
Replace the basic 3-number-button layout with a richer, more engaging design:

- **3 goal tiers as illustrated cards** (not plain squares):
  - 🌱 **Casual** (1/day) — "Take it easy, 50+ pts/day" — pale green card
  - 🌿 **Regular** (2/day) — "Steady growth, 100+ pts/day" — jungle-green card (recommended badge)
  - 🔥 **Hardcore** (3/day) — "Maximum impact, 150+ pts/day" — sun-gold card
- Each card: vertical layout with large emoji, tier name in bold, missions count, estimated daily points, a short motivational tagline
- Selected card: scale up, colored border, shadow, checkmark badge
- Add a "⭐ Recommended" pill on the Regular option
- Below cards: a summary line showing projected weekly EcoPoints and estimated ecosystem growth

**File**: `src/pages/OnboardingPage.tsx` only

