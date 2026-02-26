import type { CvInput } from '../../zod-schemas/cv.js'
import type { Locale, SectionScore, ValidationIssue, ValidationPositive } from '../types.js'
import { msg } from '../messages.js'

const MAX = 5

export function checkLanguages(cv: CvInput, locale: Locale): SectionScore {
  const items = cv.languages.items
  let earned = 0
  const issues: ValidationIssue[] = []
  const positives: ValidationPositive[] = []

  // Has items (2 pts)
  if (items.length > 0) {
    earned += 2
    positives.push({ text: msg(locale, 'languages.has_items'), section: 'languages' })
  } else {
    issues.push({ text: msg(locale, 'languages.no_items'), priority: 'optional', section: 'languages' })
    return { earned, max: MAX, issues, positives }
  }

  // Name + level present (3 pts)
  const complete = items.filter(i =>
    i.name.trim().length > 0 && i.level.trim().length > 0,
  )
  if (complete.length === items.length) {
    earned += 3
    positives.push({ text: msg(locale, 'languages.fields_complete'), section: 'languages' })
  } else {
    const missing = items.length - complete.length
    earned += Math.round((complete.length / items.length) * 3)
    issues.push({ text: msg(locale, 'languages.missing_fields', { count: missing }), priority: 'recommended', section: 'languages' })
  }

  return { earned, max: MAX, issues, positives }
}
