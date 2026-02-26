import type { CvInput } from '../../zod-schemas/cv.js'
import type { Locale, SectionScore, ValidationIssue, ValidationPositive } from '../types.js'
import { pronounPatterns } from '../word-lists/pronouns.js'
import { msg } from '../messages.js'

const MAX = 10

function countSentences(text: string): number {
  return text.split(/[.!?]+/).filter(s => s.trim().length > 0).length
}

export function checkSummary(cv: CvInput, locale: Locale): SectionScore {
  const text = cv.summary.text.trim()
  let earned = 0
  const issues: ValidationIssue[] = []
  const positives: ValidationPositive[] = []

  // Summary present (3 pts)
  if (text.length > 0) {
    earned += 3
    positives.push({ text: msg(locale, 'summary.present'), section: 'summary' })
  } else {
    issues.push({ text: msg(locale, 'summary.missing'), priority: 'critical', section: 'summary' })
    return { earned, max: MAX, issues, positives }
  }

  // Adequate length 2-5 sentences (4 pts)
  const sentences = countSentences(text)
  if (sentences >= 2 && sentences <= 5) {
    earned += 4
    positives.push({ text: msg(locale, 'summary.good_length'), section: 'summary' })
  } else {
    earned += 2
    if (sentences < 2) {
      issues.push({ text: msg(locale, 'summary.too_short'), priority: 'recommended', section: 'summary' })
    } else {
      issues.push({ text: msg(locale, 'summary.too_long'), priority: 'recommended', section: 'summary' })
    }
  }

  // No first-person pronouns (3 pts)
  const pattern = pronounPatterns[locale] ?? pronounPatterns.en
  if (!pattern.test(text)) {
    earned += 3
    positives.push({ text: msg(locale, 'summary.no_pronouns'), section: 'summary' })
  } else {
    issues.push({ text: msg(locale, 'summary.has_pronouns'), priority: 'recommended', section: 'summary' })
  }

  return { earned, max: MAX, issues, positives }
}
