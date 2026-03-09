
# Fix Learn Section Issues

## Issues Identified

1. **Blank fact boxes**: Database stores `{text: "..."}` but code reads `fact.title` and `fact.content`
2. **Markdown not rendering**: Article body contains `**bold**` syntax but no conversion to HTML
3. **Quiz "FalseBase" bug**: AI returning malformed answers; answer display concatenating incorrectly
4. **Quiz not referencing article content**: Prompt is generic, should include article content for topic-specific questions

## Changes

### 1. LessonReader.tsx — Fix Fact Boxes + Markdown
- Change fact box rendering to use `fact.text` (matching database schema)
- Add markdown-to-HTML conversion for `**bold**` → `<strong>bold</strong>`
- Simple regex replacement: `/\*\*(.+?)\*\*/g` → `<strong>$1</strong>`

### 2. generate-quiz/index.ts — Fix Quiz Generation
- Fetch lesson content from database for the topic
- Include article content in the AI prompt so questions are relevant
- Add explicit instruction: "For true_false questions, the answer must be exactly 'True' or 'False'"
- Normalize true/false answers in the response before returning

### 3. QuizExperience.tsx — Fix Answer Display
- Normalize answer comparison to handle case variations
- Fix the "FalseBase" display by ensuring clean answer strings

## Files to Modify
| File | Change |
|------|--------|
| `src/pages/LessonReader.tsx` | Fix fact boxes to read `text`, add markdown conversion |
| `supabase/functions/generate-quiz/index.ts` | Fetch article content, improve prompt, normalize answers |
| `src/pages/QuizExperience.tsx` | Normalize answer handling |
