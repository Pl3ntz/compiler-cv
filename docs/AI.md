# AI Features Documentation

Compiler CV integrates with Google Gemini 2.5 Flash to provide three AI-powered features: PDF parsing, ATS scoring, and CV translation.

All AI logic is centralized in `src/lib/gemini-client.ts`.

---

## Setup

AI features are optional. To enable them, set the `GEMINI_API_KEY` environment variable:

```env
GEMINI_API_KEY=your-api-key-here
```

Get a free API key at [AI Studio](https://aistudio.google.com/apikey).

If the key is not set, AI endpoints will return an error but the rest of the application works normally.

---

## Configuration

| Setting | Value | Reason |
|---------|-------|--------|
| Model | `gemini-2.5-flash` | Fast, cost-effective for structured tasks |
| Timeout | 30 seconds | Fail fast if the API is slow |
| Temperature | `0` | Deterministic output for scoring and translation |
| Thinking budget | `1024` tokens | Limits internal reasoning tokens for speed |
| Response format | `application/json` | Structured JSON with schema validation |

---

## Feature 1: PDF Import (`parseCvFromPdf`)

### What It Does

Takes a PDF resume file and extracts all content into the structured CV format used by the editor.

### How It Works

1. PDF buffer is converted to base64
2. Sent to Gemini as an inline PDF document
3. A response JSON schema (derived from Zod's `cvInputSchema`) constrains the output
4. Gemini extracts: header info, summary, education, experience, projects, skills, languages
5. Response is validated with Zod before returning

### Prompt Strategy

The prompt instructs the AI to:
- Extract ALL information — no invention or hallucination
- Auto-detect language (or use provided locale hint)
- Map each section to the expected JSON structure
- Use locale-appropriate section titles
- Preserve original date formats

### Validation

- File must be `application/pdf` MIME type
- First 4 bytes must be PDF magic bytes (`%PDF`)
- Max file size: 5MB
- Gemini response validated against `cvInputSchema`

---

## Feature 2: ATS Score Analysis (`analyzeCvAtsScore`)

### What It Does

Evaluates a CV for compatibility with major Applicant Tracking Systems (Workday, Greenhouse, Lever, iCIMS) and provides actionable improvement suggestions.

### Response Structure

```typescript
{
  overallScore: number       // 0-100, weighted average
  categories: [{
    name: string            // e.g., "Contact Info", "Experience"
    score: number           // 0-100
    feedback: string        // Explanation
    section: string         // "header" | "summary" | "experience" | etc.
  }]
  suggestions: [{
    text: string            // Actionable suggestion
    priority: string        // "critical" | "recommended" | "optional"
    section: string         // Which CV section it applies to
  }]
}
```

### Scoring Logic

- Each section scored 0-100 independently
- Overall score is a weighted average (Experience and Skills weighted higher)
- 3-7 suggestions provided per analysis
- Suggestions include priority levels:
  - **critical** — Missing information or formatting issues that will cause ATS rejection
  - **recommended** — Significant improvements for better parsing
  - **optional** — Polish items for marginally better results

### Performance Optimizations

1. **Input stripping** — `customLatex` (up to 100KB!) and `templateId` are removed before sending to the AI, saving significant tokens
2. **Compact JSON** — `JSON.stringify()` without indentation (no `null, 2`)
3. **Thinking budget** — Limited to 1024 tokens to reduce "reasoning" overhead
4. **In-memory cache** — Results cached for 5 minutes using SHA-256 hash of input:
   ```
   Cache key = SHA256({ stripped CV data, locale }).slice(0, 16)
   TTL = 5 minutes
   ```
   Same CV analyzed twice within 5 minutes returns instantly from cache.
5. **Concise prompt** — Minimal instruction set since the JSON response schema already communicates structure

### Cache Behavior

```
First request:  CV data → hash → cache miss → API call → store result → return
Second request: CV data → hash → cache hit (< 5 min) → return immediately
After 5 min:    CV data → hash → cache expired → API call → update cache → return
```

The cache is a simple `Map<string, { result, expiry }>` in process memory. It resets when the server restarts.

---

## Feature 3: Clone & Translate (`translateCvContent`)

### What It Does

Takes a CV in one language and translates all content to the target language while preserving the JSON structure.

### Translation Rules

**Translated:**
- Section titles (e.g., "Experiencia Profissional" → "Professional Experience")
- Summary text
- Highlights and achievements
- Job titles and role descriptions
- Academic degrees
- Skill category names
- Language names and proficiency levels

**Preserved (not translated):**
- Proper names (people, companies, institutions)
- URLs, emails, phone numbers
- Technology names (React, Python, Docker, Laravel, etc.)
- JSON structure (exact same shape in/out)

### Performance Optimizations

Same as ATS scoring:
- Input stripping (no `customLatex`/`templateId`)
- Compact JSON serialization
- Thinking budget limited to 1024 tokens
- 30-second timeout

Translation does NOT use caching because different source CVs translate differently.

---

## Error Handling

All AI functions handle these error cases:

| Error | Handling |
|-------|----------|
| Missing API key | Throws `"GEMINI_API_KEY is not configured"` |
| API timeout (>30s) | Throws `"Request timeout"` |
| Content blocked by safety filter | Throws with block reason |
| Empty response | Throws descriptive error |
| Invalid JSON response | Throws `"Invalid response from AI service"` |
| Zod validation failure | Throws with validation details |

---

## Cost Considerations

- **Gemini 2.5 Flash** is one of the cheapest models available
- Input stripping saves ~50-80% of tokens for CVs with custom LaTeX
- Compact JSON saves ~20-30% of input tokens vs pretty-printed
- ATS cache eliminates duplicate API calls within 5 minutes
- Thinking budget cap prevents runaway token usage
- Free tier API key is sufficient for personal/small-team use

---

## Adding New AI Features

To add a new AI feature:

1. Define a Zod schema for the expected response in `src/lib/zod-schemas/`
2. Create a response schema builder (see `buildAtsResponseSchema()` pattern)
3. Write a prompt builder function
4. Implement the async function following the existing pattern:
   - Strip input with `stripForAi()`
   - Build prompt and call `ai.models.generateContent()`
   - Race with timeout
   - Parse and validate response with Zod
   - Optionally add caching
5. Add the API route in `src/server/api/cv.ts`
6. Add rate limiting if the operation is expensive
