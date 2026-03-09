

# Build Complete Learn Section

## Current State
- Database tables exist: `lessons` (7 articles seeded), `lesson_completions`, `quiz_attempts`
- Current `LearnPage.tsx` uses mock data and state-based navigation
- Need to convert to URL-based routing with real Supabase data

## Implementation

### 1. App.tsx — Add Routes
Add 4 new routes under `/learn`:
- `/learn` → LearnHub
- `/learn/:topic` → TopicLessons  
- `/learn/:topic/:lessonId` → LessonReader
- `/learn/:topic/quiz` → QuizExperience

### 2. Edge Function: `generate-quiz`
Uses Lovable AI (`google/gemini-3-flash-preview`) via tool calling to generate 7 questions per topic:
- 3 MCQ, 2 true/false, 2 fill-in-blank
- Returns structured JSON with question, options, answer, explanation
- Config: `verify_jwt = false` with manual auth check

### 3. Hook: `useLearnData.ts`
Queries:
- `useLessons(topic?)` - fetch lessons from DB
- `useUserCompletions()` - user's completed lessons
- `useQuizAttempts(topic?)` - best scores per topic
- `completeLesson` mutation - inserts completion + awards EcoPoints
- `saveQuizAttempt` mutation - saves score + awards EcoPoints

### 4. Page Components

**LearnHub.tsx** - Topic grid with 6 cards, real progress rings, gradient backgrounds per spec

**TopicLessons.tsx** - Lesson list with completion status, locked quiz card until 1 lesson done

**LessonReader.tsx** - Full article from DB (body, fact_boxes, key_takeaways), scroll progress bar, "Mark Complete" button awards +20 pts

**QuizExperience.tsx** - Calls edge function, renders 3 question types (MCQ/T-F/Fill-blank), scores up to +30 pts, saves to `quiz_attempts`

### 5. Files
| File | Action |
|------|--------|
| `src/App.tsx` | Add 4 learn routes |
| `supabase/config.toml` | Add generate-quiz function |
| `supabase/functions/generate-quiz/index.ts` | Create AI quiz generator |
| `src/hooks/useLearnData.ts` | Create data hook |
| `src/pages/LearnHub.tsx` | Create topic grid |
| `src/pages/TopicLessons.tsx` | Create lesson list |
| `src/pages/LessonReader.tsx` | Create article reader |
| `src/pages/QuizExperience.tsx` | Create quiz UI |
| `src/pages/LearnPage.tsx` | Delete (replaced by new pages) |

### EcoPoints Awards
- Article completion: +20 pts (insert `lesson_completions` + update `profiles.eco_points`)
- Quiz completion: (score/7) × 30, rounded to nearest 10
- All updates use `refreshProfile()` to sync nav counter

