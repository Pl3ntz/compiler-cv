import type { CvInput } from '../../zod-schemas/cv.js'
import type { Locale, SectionScore, ValidationIssue, ValidationPositive } from '../types.js'
import { msg } from '../messages.js'

const MAX = 8

export function checkEducation(cv: CvInput, locale: Locale): SectionScore {
  const items = cv.education.items
  let earned = 0
  const issues: ValidationIssue[] = []
  const positives: ValidationPositive[] = []

  // Has items (3 pts)
  if (items.length > 0) {
    earned += 3
    positives.push({ text: msg(locale, 'education.has_items'), section: 'education' })
  } else {
    issues.push({ text: msg(locale, 'education.no_items'), priority: 'critical', section: 'education' })
    return { earned, max: MAX, issues, positives }
  }

  // Institution + degree present (3 pts)
  const complete = items.filter(i =>
    i.institution.trim().length > 0 && i.degree.trim().length > 0,
  )
  if (complete.length === items.length) {
    earned += 3
    positives.push({ text: msg(locale, 'education.fields_complete'), section: 'education' })
  } else {
    const missing = items.length - complete.length
    earned += Math.round((complete.length / items.length) * 3)
    issues.push({ text: msg(locale, 'education.missing_fields', { count: missing }), priority: 'recommended', section: 'education' })
  }

  // Date present (2 pts)
  const withDate = items.filter(i => i.date.trim().length > 0)
  if (withDate.length === items.length) {
    earned += 2
    positives.push({ text: msg(locale, 'education.dates_complete'), section: 'education' })
  } else {
    earned += Math.round((withDate.length / items.length) * 2)
    issues.push({ text: msg(locale, 'education.missing_dates'), priority: 'optional', section: 'education' })
  }

  return { earned, max: MAX, issues, positives }
}
