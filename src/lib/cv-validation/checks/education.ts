import type { CvInput } from '../../zod-schemas/cv.js'
import type { Locale, SectionScore, ValidationIssue } from '../types.js'

const MAX = 8

export function checkEducation(cv: CvInput, _locale: Locale): SectionScore {
  const items = cv.education.items
  let earned = 0
  const issues: ValidationIssue[] = []

  // Has items (3 pts)
  if (items.length > 0) {
    earned += 3
  } else {
    issues.push({ text: 'No education entries', priority: 'critical', section: 'education' })
    return { earned, max: MAX, issues }
  }

  // Institution + degree present (3 pts)
  const complete = items.filter(i =>
    i.institution.trim().length > 0 && i.degree.trim().length > 0,
  )
  if (complete.length === items.length) {
    earned += 3
  } else {
    const missing = items.length - complete.length
    earned += Math.round((complete.length / items.length) * 3)
    issues.push({ text: `${missing} education item(s) missing institution or degree`, priority: 'recommended', section: 'education' })
  }

  // Date present (2 pts)
  const withDate = items.filter(i => i.date.trim().length > 0)
  if (withDate.length === items.length) {
    earned += 2
  } else {
    earned += Math.round((withDate.length / items.length) * 2)
    issues.push({ text: 'Some education items are missing dates', priority: 'optional', section: 'education' })
  }

  return { earned, max: MAX, issues }
}
