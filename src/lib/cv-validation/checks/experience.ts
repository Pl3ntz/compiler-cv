import type { CvInput } from '../../zod-schemas/cv.js'
import type { Locale, SectionScore, ValidationIssue, ValidationPositive } from '../types.js'
import { strongVerbs as strongVerbsEn, weakVerbs as weakVerbsEn } from '../word-lists/action-verbs-en.js'
import { strongVerbs as strongVerbsPt, weakVerbs as weakVerbsPt } from '../word-lists/action-verbs-pt.js'
import { msg } from '../messages.js'

const MAX = 30

const METRIC_REGEX = /\d+%|\$[\d,]+|R\$[\d.,]+|\b\d{2,}\b/

function getFirstWord(text: string): string {
  return text.trim().split(/\s+/)[0]?.toLowerCase().replace(/[.,;:]$/, '') ?? ''
}

export function checkExperience(cv: CvInput, locale: Locale): SectionScore {
  const items = cv.experience.items
  let earned = 0
  const issues: ValidationIssue[] = []
  const positives: ValidationPositive[] = []

  const strong = locale === 'pt' ? strongVerbsPt : strongVerbsEn
  const weak = locale === 'pt' ? weakVerbsPt : weakVerbsEn

  // Has items (5 pts)
  if (items.length > 0) {
    earned += 5
    positives.push({ text: msg(locale, 'experience.has_items'), section: 'experience' })
  } else {
    issues.push({ text: msg(locale, 'experience.no_items'), priority: 'critical', section: 'experience' })
    return { earned, max: MAX, issues, positives }
  }

  // Required fields filled (5 pts)
  const itemsWithFields = items.filter(i =>
    i.company.trim().length > 0 && i.role.trim().length > 0 && i.date.trim().length > 0,
  )
  if (itemsWithFields.length === items.length) {
    earned += 5
    positives.push({ text: msg(locale, 'experience.fields_complete'), section: 'experience' })
  } else {
    const missing = items.length - itemsWithFields.length
    earned += Math.round((itemsWithFields.length / items.length) * 5)
    issues.push({ text: msg(locale, 'experience.missing_fields', { count: missing }), priority: 'critical', section: 'experience' })
  }

  // 3-6 highlights per item (5 pts)
  const highlightCounts = items.map(i => i.highlights.filter(h => h.trim().length > 0).length)
  const avgHighlights = highlightCounts.reduce((a, b) => a + b, 0) / items.length
  if (avgHighlights >= 3 && avgHighlights <= 6) {
    earned += 5
    positives.push({ text: msg(locale, 'experience.good_highlights'), section: 'experience' })
  } else if (avgHighlights >= 1) {
    earned += 2
    if (avgHighlights < 3) {
      issues.push({ text: msg(locale, 'experience.few_highlights'), priority: 'recommended', section: 'experience' })
    } else {
      issues.push({ text: msg(locale, 'experience.many_highlights'), priority: 'optional', section: 'experience' })
    }
  } else {
    issues.push({ text: msg(locale, 'experience.no_highlights'), priority: 'critical', section: 'experience' })
  }

  // Strong action verbs 80%+ (8 pts)
  const allHighlights = items.flatMap(i => i.highlights.filter(h => h.trim().length > 0))
  if (allHighlights.length > 0) {
    let strongCount = 0
    let weakCount = 0
    for (const h of allHighlights) {
      const first = getFirstWord(h)
      if (strong.has(first)) strongCount++
      else if (weak.has(first)) weakCount++
      else strongCount++ // unknown verbs get benefit of the doubt
    }
    const ratio = strongCount / allHighlights.length
    if (ratio >= 0.8) {
      earned += 8
      positives.push({ text: msg(locale, 'experience.strong_verbs'), section: 'experience' })
    } else if (ratio >= 0.5) {
      earned += 4
      issues.push({ text: msg(locale, 'experience.some_weak_verbs'), priority: 'recommended', section: 'experience' })
    } else {
      earned += 2
      issues.push({ text: msg(locale, 'experience.weak_verbs'), priority: 'critical', section: 'experience' })
    }
  }

  // Quantified achievements 50%+ (7 pts)
  if (allHighlights.length > 0) {
    const quantified = allHighlights.filter(h => METRIC_REGEX.test(h)).length
    const ratio = quantified / allHighlights.length
    if (ratio >= 0.5) {
      earned += 7
      positives.push({ text: msg(locale, 'experience.quantified'), section: 'experience' })
    } else if (ratio >= 0.2) {
      earned += 3
      issues.push({ text: msg(locale, 'experience.some_metrics'), priority: 'recommended', section: 'experience' })
    } else {
      earned += 1
      issues.push({ text: msg(locale, 'experience.needs_metrics'), priority: 'critical', section: 'experience' })
    }
  }

  return { earned, max: MAX, issues, positives }
}
