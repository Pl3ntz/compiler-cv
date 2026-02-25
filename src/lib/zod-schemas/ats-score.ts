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
  ruleScore: z.number().int().min(0).max(100).optional(),
  llmGrade: z.enum(['A', 'B', 'C', 'D', 'F']).optional(),
  breakdown: z.object({
    contact: z.number().int().min(0).max(10),
    summary: z.number().int().min(0).max(10),
    experience: z.number().int().min(0).max(30),
    education: z.number().int().min(0).max(8),
    skills: z.number().int().min(0).max(12),
    formatting: z.number().int().min(0).max(15),
    dateContinuity: z.number().int().min(0).max(5),
    languages: z.number().int().min(0).max(5),
    projects: z.number().int().min(0).max(5),
  }).optional(),
})

export type AtsSuggestion = z.infer<typeof atsSuggestionSchema>
export type AtsScoreResponse = z.infer<typeof atsScoreResponseSchema>
