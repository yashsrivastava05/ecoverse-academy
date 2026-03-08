
# EcoQuest — Phase 1 MVP Plan

## Design Foundation
- **Theme**: "Bioluminescent Jungle" — dark backgrounds (#050A0E), glowing green accents (#00FF87), organic feel
- **Fonts**: Syne (display), Nunito (headings), DM Sans (body), JetBrains Mono (stats)
- **Animations**: Framer Motion for page transitions and complex animations, CSS for breathing effects, hover states, and micro-interactions
- **Install**: framer-motion, canvas-confetti, react-markdown

## Custom Design System
- Full Tailwind theme with bioluminescent color palette (void-black, glow-green, amber-sun, sky-biolume, etc.)
- Glow utility classes and breathing card animations
- Reusable components: EcoPointsBadge, MissionCard, LevelBadge, StreakFlame, ProgressRing, BadgeCard, RewardCard

## Pages to Build (MVP Scope — 8 pages)

### 1. Landing Page (/)
- Animated hero with forest background (CSS gradient mesh + subtle animations)
- Tagline, animated stat counters, feature highlight cards, CTA buttons
- Sticky nav with logo and links

### 2. Login & Signup (/login, /signup)
- Split-screen layout with ecosystem illustration
- Signup form with role selector and school selector (mock data)
- Visual preview of starting level ("You'll start as a 🌱 Seed!")

### 3. Onboarding (/onboarding)
- 4-step wizard: avatar selection → interest areas → daily goal → welcome with confetti
- Animated transitions between steps

### 4. Student Dashboard (/dashboard) — Core page
- **Left panel**: Animated SVG ecosystem viewer that evolves through 7 states based on points
- **Right panel**: Stat cards (EcoPoints, Streak, Level, Rank), daily missions, recent activity, weekly chart, badge row
- Ecosystem includes: swaying trees, flowing river, drifting clouds, fireflies at night

### 5. Missions Page (/missions)
- Category filter tabs, difficulty filter
- Mission cards with category-themed animated backgrounds
- Mission detail modal with photo upload area, location tag, notes field
- "AI Recommended" section with mock recommendations

### 6. Learning Hub (/learn)
- 6 topic cards with animated icons
- Lesson viewer with article content and embedded quiz
- Quiz with animated correct/wrong feedback, point awards
- "Sort the Waste" mini-game (drag items to correct bins)

### 7. Leaderboard (/leaderboard)
- Individual / School tabs, time period filter
- Animated top-3 podium with gold/silver/bronze effects
- Ranked list with change indicators
- "Your Position" sticky card

### 8. Profile (/profile)
- Avatar, level badge, ecosystem mini-view
- Stats grid, badge gallery (earned vs locked), activity timeline

## Gamification System (Mock Data)
- **EcoPoints**: Displayed everywhere with animated counters and slot-machine roll-up effect
- **8 Levels**: Seed → Sprout → Sapling → Tree → Grove → Forest → Eco Warrior → Planet Guardian
- **Level-up ceremony**: Full-screen blur overlay, badge animation, confetti, ecosystem evolution preview
- **10+ Badges**: Visual badge cards, earned glow vs locked greyed-out
- **Streaks**: Flame icon with daily tracking, streak freeze concept

## Virtual Ecosystem (SVG Component)
- 7-layer animated SVG scene (sky, mountains, trees, river, ground, animals, particles)
- 7 evolution states from barren wasteland to Planet Guardian
- Day/night cycle based on local time
- Smooth transition animations between states
- Mouse parallax on desktop

## Navigation
- Desktop: Sidebar with glowing active indicator
- Mobile: Bottom tab bar with animated sliding indicator
- Top bar: Logo, notification bell with count, EcoPoints badge, avatar dropdown

## Notifications
- Custom toast system with colored borders and animated icons per type
- Bell icon dropdown with notification list

## Mobile Responsive
- Full mobile-first responsive design
- Bottom tab navigation on mobile
- Full-width cards and touch-friendly interactions

## Mock Data Layer
- Hardcoded demo data for: 3 schools, 10 missions, 6 topics with lessons, 20 badges, leaderboard entries, 2 student profiles
- All data structured to match the planned Supabase schema for easy migration later

## Custom Cursor (Desktop)
- Green glowing dot cursor with expansion on hover and leaf particle burst on click
