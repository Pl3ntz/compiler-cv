import type { CvInput } from '../../zod-schemas/cv.js'
import type { Locale, SectionScore, ValidationIssue } from '../types.js'

const MAX = 12

export function checkSkills(cv: CvInput, _locale: Locale): SectionScore {
  const cats = cv.skills.categories
  let earned = 0
  const issues: ValidationIssue[] = []

  // Has categories (3 pts)
  if (cats.length > 0) {
    earned += 3
  } else {
    issues.push({ text: 'No skill categories listed', priority: 'critical', section: 'skills' })
    return { earned, max: MAX, issues }
  }

  // 2+ categories (3 pts)
  if (cats.length >= 2) {
    earned += 3
  } else {
    issues.push({ text: 'Add at least 2 skill categories for better organization', priority: 'recommended', section: 'skills' })
  }

  // 8+ skills total (3 pts)
  const totalSkills = cats.reduce((sum, c) => {
    return sum + c.values.split(',').filter(v => v.trim().length > 0).length
  }, 0)
  if (totalSkills >= 8) {
    earned += 3
  } else {
    issues.push({ text: `Only ${totalSkills} skills listed — aim for at least 8`, priority: 'recommended', section: 'skills' })
  }

  // No empty categories (3 pts)
  const empty = cats.filter(c => c.name.trim().length === 0 || c.values.trim().length === 0)
  if (empty.length === 0) {
    earned += 3
  } else {
    issues.push({ text: `${empty.length} skill category(ies) have empty name or values`, priority: 'recommended', section: 'skills' })
  }

  return { earned, max: MAX, issues }
}
