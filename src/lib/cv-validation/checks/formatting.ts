import type { CvInput } from '../../zod-schemas/cv.js'
import type { Locale, SectionScore, ValidationIssue, ValidationPositive } from '../types.js'
import { pronounPatterns } from '../word-lists/pronouns.js'
import { msg } from '../messages.js'

const MAX = 15

const ATS_DATE_REGEX = /\b(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+\d{4}\b|\b\d{2}\/\d{4}\b|\b\d{4}\b|Present|Presente|Atual/i

function collectAllText(cv: CvInput): string {
  const parts: string[] = []
  parts.push(cv.summary.text)
  for (const item of cv.experience.items) {
    parts.push(item.role, item.company, ...item.highlights)
  }
  for (const item of cv.education.items) {
    parts.push(item.degree, item.institution, ...item.highlights)
  }
  for (const item of cv.projects.items) {
    parts.push(item.name, ...item.highlights)
  }
  for (const cat of cv.skills.categories) {
    parts.push(cat.name, cat.values)
  }
  return parts.join(' ')
}

function countWords(cv: CvInput): number {
  const text = collectAllText(cv)
  return text.split(/\s+/).filter(w => w.length > 0).length
}

function collectAllHighlights(cv: CvInput): string[] {
  const highlights: string[] = []
  for (const item of cv.experience.items) {
    highlights.push(...item.highlights)
  }
  for (const item of cv.education.items) {
    highlights.push(...item.highlights)
  }
  for (const item of cv.projects.items) {
    highlights.push(...item.highlights)
  }
  return highlights
}

function collectAllDates(cv: CvInput): string[] {
  const dates: string[] = []
  for (const item of cv.experience.items) {
    if (item.date.trim()) dates.push(item.date)
  }
  for (const item of cv.education.items) {
    if (item.date.trim()) dates.push(item.date)
  }
  for (const item of cv.projects.items) {
    if (item.date.trim()) dates.push(item.date)
  }
  return dates
}

export function checkFormatting(cv: CvInput, locale: Locale): SectionScore {
  let earned = 0
  const issues: ValidationIssue[] = []
  const positives: ValidationPositive[] = []

  // Word count 450-1200 (5 pts)
  const words = countWords(cv)
  if (words >= 450 && words <= 1200) {
    earned += 5
    positives.push({ text: msg(locale, 'formatting.good_length'), section: 'general' })
  } else if (words >= 200 && words <= 1500) {
    earned += 3
    if (words < 450) {
      issues.push({ text: msg(locale, 'formatting.short', { count: words }), priority: 'recommended', section: 'general' })
    } else {
      issues.push({ text: msg(locale, 'formatting.long', { count: words }), priority: 'recommended', section: 'general' })
    }
  } else if (words > 0) {
    earned += 1
    issues.push({ text: msg(locale, 'formatting.very_off', { count: words }), priority: 'critical', section: 'general' })
  } else {
    issues.push({ text: msg(locale, 'formatting.empty'), priority: 'critical', section: 'general' })
  }

  // No empty bullets (3 pts)
  const highlights = collectAllHighlights(cv)
  const emptyBullets = highlights.filter(h => h.trim().length === 0)
  if (emptyBullets.length === 0) {
    earned += 3
    if (highlights.length > 0) {
      positives.push({ text: msg(locale, 'formatting.no_empty_bullets'), section: 'general' })
    }
  } else {
    issues.push({ text: msg(locale, 'formatting.empty_bullets', { count: emptyBullets.length }), priority: 'recommended', section: 'general' })
  }

  // ATS-safe date formats (4 pts)
  const dates = collectAllDates(cv)
  if (dates.length > 0) {
    const safe = dates.filter(d => ATS_DATE_REGEX.test(d))
    if (safe.length === dates.length) {
      earned += 4
      positives.push({ text: msg(locale, 'formatting.ats_dates'), section: 'general' })
    } else {
      const unsafe = dates.length - safe.length
      earned += Math.round((safe.length / dates.length) * 4)
      issues.push({ text: msg(locale, 'formatting.bad_dates', { count: unsafe }), priority: 'recommended', section: 'general' })
    }
  } else {
    earned += 4 // no dates to check = no penalty
  }

  // No first-person pronouns globally (3 pts)
  const allText = collectAllText(cv)
  const pattern = pronounPatterns[locale] ?? pronounPatterns.en
  if (!pattern.test(allText)) {
    earned += 3
    if (words > 0) {
      positives.push({ text: msg(locale, 'formatting.no_pronouns'), section: 'general' })
    }
  } else {
    issues.push({ text: msg(locale, 'formatting.has_pronouns'), priority: 'recommended', section: 'general' })
  }

  return { earned, max: MAX, issues, positives }
}
