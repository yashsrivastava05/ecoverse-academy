

# Build Complete Learn Section

## Overview
Transform the mock Learn page into a full database-backed learning system with 3 views (Topic Hub, Lesson List, Lesson Reader) plus AI-generated quizzes via Lovable AI. All lesson completions and quiz scores award real EcoPoints to Supabase.

## Database Changes

### New Tables
1. **`lessons`** - Store all article content
   - `id`, `topic`, `title`, `content_type`, `body`, `summary`, `fact_boxes` (JSONB), `key_takeaways` (text[]), `eco_points_reward`, `estimated_minutes`, `order_index`

2. **`lesson_completions`** - Track completed lessons per user
   - `id`, `user_id`, `lesson_id`, `completed_at`
   - Unique constraint on (user_id, lesson_id)

3. **`quiz_attempts`** - Store quiz results
   - `id`, `user_id`, `topic`, `score`, `total_questions`, `points_earned`, `created_at`

### Seed Data
Insert the 7 full articles as requested:
- Climate Change: "What is Climate Change?", "Climate Solutions"
- Pollution: "Understanding Pollution"  
- Waste: "Waste Reduction Strategies"
- Energy: "Renewable Energy Sources"
- Water: "Water Conservation"
- Biodiversity: "Why Biodiversity Matters"

Each article ~500 words with 2 "Did you know?" fact boxes and 3-4 key takeaways.

## Edge Function: `generate-quiz`

Uses **LOVABLE_API_KEY** (already available) to call Lovable AI Gateway with `google/gemini-3-flash-preview`:
- Accepts `topic` parameter
- Returns 7 questions (3 MCQ, 2 true/false, 2 fill-in-blank)
- Structured output via tool calling for reliable JSON

## Routing Changes (App.tsx)

Add nested routes:
```
/learn              → LearnHub (topic grid)
/learn/:topic       → TopicLessons (lesson list)
/learn/:topic/:lessonId → LessonReader (article)
/learn/:topic/quiz  → QuizExperience (AI quiz)
```

## New Files

1. **`src/pages/LearnHub.tsx`** - Topic grid with real progress from DB
2. **`src/pages/TopicLessons.tsx`** - Lesson list + quiz card
3. **`src/pages/LessonReader.tsx`** - Full article with scroll progress, "Mark Complete" button
4. **`src/pages/QuizExperience.tsx`** - AI quiz with 3 question types, scoring, EcoPoints award
5. **`src/hooks/useLearnData.ts`** - Queries for lessons, completions, quiz attempts + mutations
6. **`supabase/functions/generate-quiz/index.ts`** - Edge function for AI quiz generation

## EcoPoints Logic

- **Article completion**: +20 EcoPoints via mutation that inserts into `lesson_completions` and updates `profiles.eco_points`
- **Quiz completion**: Up to +30 EcoPoints based on score (score/7 × 30, rounded to nearest 10)
- Quiz is unlocked only after completing at least 1 lesson in that topic

## Key UI Details

- Topic cards: 280px tall, gradient backgrounds, real progress rings
- Lesson items: numbered circles, status badges (Start/Continue/Completed)
- Article reader: scroll progress bar, "Did you know?" boxes with green left border
- Quiz: loading spinner while AI generates, 3 question types with distinct UI, results screen with performance message

## Files Modified
1. `src/App.tsx` - Add 4 new routes
2. `supabase/config.toml` - Add generate-quiz function config
3. Delete/replace `src/pages/LearnPage.tsx` with new routing structure

