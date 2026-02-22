import { z } from 'zod'

const sectionKey = z.enum(['header', 'summary', 'education', 'experience', 'projects', 'skills', 'languages', 'general'])

export const atsCategorySchema = z.object({
  name: z.string(),
  score: z.number().int().min(0).max(100),
  feedback: z.string(),
  section: sectionKey.optional(),
})

export const atsSuggestionSchema = z.object({
  text: z.string(),
  priority: z.enum(['critical', 'recommended', 'optional']),
  section: sectionKey.optional(),
})

export const atsScoreResponseSchema = z.object({
  overallScore: z.number().int().min(0).max(100),
  categories: z.array(atsCategorySchema),
  suggestions: z.array(atsSuggestionSchema),
})

export type AtsSuggestion = z.infer<typeof atsSuggestionSchema>
export type AtsScoreResponse = z.infer<typeof atsScoreResponseSchema>
