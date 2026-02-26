import type { CvInput } from '../../zod-schemas/cv.js'
import type { Locale, SectionScore, ValidationIssue, ValidationPositive } from '../types.js'
import { msg } from '../messages.js'

const MAX = 5

export function checkProjects(cv: CvInput, locale: Locale): SectionScore {
  const items = cv.projects.items
  let earned = 0
  const issues: ValidationIssue[] = []
  const positives: ValidationPositive[] = []

  // Has items (2 pts)
  if (items.length > 0) {
    earned += 2
    positives.push({ text: msg(locale, 'projects.has_items'), section: 'projects' })
  } else {
    issues.push({ text: msg(locale, 'projects.no_items'), priority: 'optional', section: 'projects' })
    return { earned, max: MAX, issues, positives }
  }

  // Name + highlights present (3 pts)
  const complete = items.filter(i =>
    i.name.trim().length > 0 && i.highlights.some(h => h.trim().length > 0),
  )
  if (complete.length === items.length) {
    earned += 3
    positives.push({ text: msg(locale, 'projects.fields_complete'), section: 'projects' })
  } else {
    const missing = items.length - complete.length
    earned += Math.round((complete.length / items.length) * 3)
    issues.push({ text: msg(locale, 'projects.missing_fields', { count: missing }), priority: 'recommended', section: 'projects' })
  }

  return { earned, max: MAX, issues, positives }
}
