import type { CvInput } from '../../zod-schemas/cv.js'
import type { Locale, SectionScore, ValidationIssue } from '../types.js'
import { pronounPatterns } from '../word-lists/pronouns.js'

const MAX = 10

function countSentences(text: string): number {
  return text.split(/[.!?]+/).filter(s => s.trim().length > 0).length
}

export function checkSummary(cv: CvInput, locale: Locale): SectionScore {
  const text = cv.summary.text.trim()
  let earned = 0
  const issues: ValidationIssue[] = []

  // Summary present (3 pts)
  if (text.length > 0) {
    earned += 3
  } else {
    issues.push({ text: 'Professional summary is missing', priority: 'critical', section: 'summary' })
    return { earned, max: MAX, issues }
  }

  // Adequate length 2-5 sentences (4 pts)
  const sentences = countSentences(text)
  if (sentences >= 2 && sentences <= 5) {
    earned += 4
  } else {
    earned += 2
    if (sentences < 2) {
      issues.push({ text: 'Summary is too short — aim for 2-5 sentences', priority: 'recommended', section: 'summary' })
    } else {
      issues.push({ text: 'Summary is too long — aim for 2-5 sentences', priority: 'recommended', section: 'summary' })
    }
  }

  // No first-person pronouns (3 pts)
  const pattern = pronounPatterns[locale] ?? pronounPatterns.en
  if (!pattern.test(text)) {
    earned += 3
  } else {
    issues.push({ text: 'Avoid first-person pronouns in summary (e.g. "I", "my")', priority: 'recommended', section: 'summary' })
  }

  return { earned, max: MAX, issues }
}
