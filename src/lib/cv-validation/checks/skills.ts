import type { CvInput } from '../../zod-schemas/cv.js'
import type { Locale, SectionScore, ValidationIssue, ValidationPositive } from '../types.js'
import { msg } from '../messages.js'

const MAX = 12

export function checkSkills(cv: CvInput, locale: Locale): SectionScore {
  const cats = cv.skills.categories
  let earned = 0
  const issues: ValidationIssue[] = []
  const positives: ValidationPositive[] = []

  // Has categories (3 pts)
  if (cats.length > 0) {
    earned += 3
    positives.push({ text: msg(locale, 'skills.has_categories'), section: 'skills' })
  } else {
    issues.push({ text: msg(locale, 'skills.no_categories'), priority: 'critical', section: 'skills' })
    return { earned, max: MAX, issues, positives }
  }

  // 2+ categories (3 pts)
  if (cats.length >= 2) {
    earned += 3
    positives.push({ text: msg(locale, 'skills.good_categories'), section: 'skills' })
  } else {
    issues.push({ text: msg(locale, 'skills.few_categories'), priority: 'recommended', section: 'skills' })
  }

  // 8+ skills total (3 pts)
  const totalSkills = cats.reduce((sum, c) => {
    return sum + c.values.split(',').filter(v => v.trim().length > 0).length
  }, 0)
  if (totalSkills >= 8) {
    earned += 3
    positives.push({ text: msg(locale, 'skills.enough_skills'), section: 'skills' })
  } else {
    issues.push({ text: msg(locale, 'skills.few_skills', { count: totalSkills }), priority: 'recommended', section: 'skills' })
  }

  // No empty categories (3 pts)
  const empty = cats.filter(c => c.name.trim().length === 0 || c.values.trim().length === 0)
  if (empty.length === 0) {
    earned += 3
    positives.push({ text: msg(locale, 'skills.no_empty'), section: 'skills' })
  } else {
    issues.push({ text: msg(locale, 'skills.empty_category', { count: empty.length }), priority: 'recommended', section: 'skills' })
  }

  return { earned, max: MAX, issues, positives }
}
