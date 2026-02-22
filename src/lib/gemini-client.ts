import { createHash } from 'node:crypto'
import { GoogleGenAI } from '@google/genai'
import { z } from 'zod'
import { cvInputSchema, type CvInput } from './zod-schemas/cv.js'
import { atsScoreResponseSchema, type AtsScoreResponse } from './zod-schemas/ats-score.js'

const MODEL = 'gemini-2.5-flash'
const TIMEOUT_MS = 30_000

function stripForAi(input: CvInput): Record<string, unknown> {
  const { customLatex, templateId, ...rest } = input
  return rest
}

const atsCache = new Map<string, { result: AtsScoreResponse; expiry: number }>()
const ATS_CACHE_TTL = 5 * 60 * 1000

function hashInput(data: unknown): string {
  return createHash('sha256').update(JSON.stringify(data)).digest('hex').slice(0, 16)
}

function buildPrompt(locale?: string): string {
  const localeInstructions = locale
    ? `- The CV is in ${locale === 'pt' ? 'Portuguese' : 'English'}. Set locale to "${locale}". Use section titles in ${locale === 'pt' ? 'Portuguese' : 'English'}:
  ${locale === 'pt'
    ? '- "Resumo Profissional", "Formacao Academica", "Experiencia Profissional", "Projetos", "Habilidades", "Idiomas"'
    : '- "Professional Summary", "Education", "Experience", "Projects", "Skills", "Languages"'}`
    : `- Auto-detect the language of the CV. Set locale to "pt" if Portuguese, "en" if English or any other language.
- Use section titles matching the detected language:
  - Portuguese: "Resumo Profissional", "Formacao Academica", "Experiencia Profissional", "Projetos", "Habilidades", "Idiomas"
  - English: "Professional Summary", "Education", "Experience", "Projects", "Skills", "Languages"`

  return `You are a CV/resume parser. Extract ALL information from this PDF resume into the structured JSON format.

Rules:
${localeInstructions}
- Each bullet point or achievement = one separate string in the highlights array
- For skills, group by category (e.g. "Programming Languages", "Frameworks"). The "values" field is a comma-separated string of skills in that category
- For languages, include name and proficiency level
- Empty or missing fields = empty string ""
- Keep dates in the original format found in the CV
- Do NOT invent or hallucinate information not present in the PDF
- Set templateId to "jake"
- Extract the person's name, location, phone, email, LinkedIn URL, and GitHub URL from the header/contact section
- If a section is not present in the CV, use an empty title and empty items array`
}

const STRIPPED_KEYS = new Set([
  '$schema',
  'additionalProperties',
  'maxLength',
  'maxItems',
  'default',
])

function stripIncompatibleFields(obj: unknown): unknown {
  if (Array.isArray(obj)) {
    return obj.map(stripIncompatibleFields)
  }
  if (obj !== null && typeof obj === 'object') {
    const result: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
      if (STRIPPED_KEYS.has(key)) continue
      result[key] = stripIncompatibleFields(value)
    }
    return result
  }
  return obj
}

function buildResponseSchema(): object {
  const jsonSchema = z.toJSONSchema(cvInputSchema)
  return stripIncompatibleFields(jsonSchema) as object
}

export async function parseCvFromPdf(
  pdfBuffer: ArrayBuffer,
  locale?: string,
): Promise<CvInput> {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured')
  }

  const ai = new GoogleGenAI({ apiKey })
  const base64Data = Buffer.from(pdfBuffer).toString('base64')

  const apiCall = ai.models.generateContent({
    model: MODEL,
    contents: [
      { text: buildPrompt(locale) },
      {
        inlineData: {
          mimeType: 'application/pdf',
          data: base64Data,
        },
      },
    ],
    config: {
      responseMimeType: 'application/json',
      responseJsonSchema: buildResponseSchema(),
    },
  })

  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error('Request timeout')), TIMEOUT_MS)
  })

  const response = await Promise.race([apiCall, timeoutPromise])

  // Check for content blocking
  const blockReason = response.promptFeedback?.blockReason
  if (blockReason) {
    throw new Error(`Content blocked by safety filter: ${blockReason}`)
  }

  const text = response.text
  if (!text) {
    throw new Error('Gemini returned empty response — PDF may be unreadable or blocked by safety filters')
  }

  const parsed = JSON.parse(text)
  return cvInputSchema.parse(parsed)
}

function buildAtsPrompt(locale: string): string {
  const lang = locale === 'pt' ? 'Portuguese' : 'English'
  return `Expert ATS analyst. Evaluate CV for ATS compatibility.
- Respond in ${lang}
- Score each section 0-100 (ATS parsing friendliness)
- Overall = weighted avg (Experience/Skills weighted higher)
- Each category needs "section" field: header/summary/experience/education/skills/projects/languages/general
- 3-7 suggestions with text, priority (critical/recommended/optional), section
- Focus: Workday, Greenhouse, Lever, iCIMS`
}

function buildAtsResponseSchema(): object {
  const jsonSchema = z.toJSONSchema(atsScoreResponseSchema)
  return stripIncompatibleFields(jsonSchema) as object
}

export async function analyzeCvAtsScore(
  cvInput: CvInput,
  locale: string,
): Promise<AtsScoreResponse> {
  const stripped = stripForAi(cvInput)
  const cacheKey = hashInput({ cv: stripped, locale })
  const cached = atsCache.get(cacheKey)
  if (cached && cached.expiry > Date.now()) {
    return cached.result
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured')
  }

  const ai = new GoogleGenAI({ apiKey })

  const apiCall = ai.models.generateContent({
    model: MODEL,
    contents: [
      { text: buildAtsPrompt(locale) },
      { text: `CV Data:\n${JSON.stringify(stripped)}` },
    ],
    config: {
      temperature: 0,
      responseMimeType: 'application/json',
      responseJsonSchema: buildAtsResponseSchema(),
      thinkingConfig: { thinkingBudget: 1024 },
    },
  })

  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error('Request timeout')), TIMEOUT_MS)
  })

  const response = await Promise.race([apiCall, timeoutPromise])
  const text = response.text ?? ''

  let parsed: unknown
  try {
    parsed = JSON.parse(text)
  } catch {
    throw new Error('Invalid response from AI service')
  }

  const result = atsScoreResponseSchema.parse(parsed)
  atsCache.set(cacheKey, { result, expiry: Date.now() + ATS_CACHE_TTL })
  return result
}

function buildTranslatePrompt(targetLocale: string): string {
  const targetLang = targetLocale === 'pt' ? 'Brazilian Portuguese' : 'English'
  const sectionTitles = targetLocale === 'pt'
    ? '"Resumo Profissional", "Formacao Academica", "Experiencia Profissional", "Projetos Principais", "Habilidades Tecnicas", "Idiomas"'
    : '"Professional Summary", "Education", "Professional Experience", "Key Projects", "Technical Skills", "Languages"'

  return `Translate CV to ${targetLang}. Set locale="${targetLocale}".
Section titles: ${sectionTitles}
Translate: titles, summary, highlights, job titles, degrees, skill names, language levels.
Keep: proper names, companies, URLs, emails, phones, tech names (React, Python, etc).
Keep same JSON structure. Professional tone.`
}

export async function translateCvContent(
  cvInput: CvInput,
  targetLocale: string,
): Promise<CvInput> {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured')
  }

  const ai = new GoogleGenAI({ apiKey })

  const apiCall = ai.models.generateContent({
    model: MODEL,
    contents: [
      { text: buildTranslatePrompt(targetLocale) },
      { text: `CV Data to translate:\n${JSON.stringify(stripForAi(cvInput))}` },
    ],
    config: {
      temperature: 0,
      responseMimeType: 'application/json',
      responseJsonSchema: buildResponseSchema(),
      thinkingConfig: { thinkingBudget: 1024 },
    },
  })

  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error('Request timeout')), TIMEOUT_MS)
  })

  const response = await Promise.race([apiCall, timeoutPromise])
  const text = response.text ?? ''

  let parsed: unknown
  try {
    parsed = JSON.parse(text)
  } catch {
    throw new Error('Invalid translation response from AI service')
  }

  return cvInputSchema.parse(parsed)
}
