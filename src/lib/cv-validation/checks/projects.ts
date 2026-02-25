import type { CvInput } from '../../zod-schemas/cv.js'
import type { Locale, SectionScore, ValidationIssue } from '../types.js'

const MAX = 5

export function checkProjects(cv: CvInput, _locale: Locale): SectionScore {
  const items = cv.projects.items
  let earned = 0
  const issues: ValidationIssue[] = []

  // Has items (2 pts)
  if (items.length > 0) {
    earned += 2
  } else {
    issues.push({ text: 'No projects listed', priority: 'optional', section: 'projects' })
    return { earned, max: MAX, issues }
  }

  // Name + highlights present (3 pts)
  const complete = items.filter(i =>
    i.name.trim().length > 0 && i.highlights.some(h => h.trim().length > 0),
  )
  if (complete.length === items.length) {
    earned += 3
  } else {
    const missing = items.length - complete.length
    earned += Math.round((complete.length / items.length) * 3)
    issues.push({ text: `${missing} project(s) missing name or highlights`, priority: 'recommended', section: 'projects' })
  }

  return { earned, max: MAX, issues }
}
