import type { CvInput } from '../../zod-schemas/cv.js'
import type { Locale, SectionScore, ValidationIssue } from '../types.js'
import { strongVerbs as strongVerbsEn, weakVerbs as weakVerbsEn } from '../word-lists/action-verbs-en.js'
import { strongVerbs as strongVerbsPt, weakVerbs as weakVerbsPt } from '../word-lists/action-verbs-pt.js'

const MAX = 30

const METRIC_REGEX = /\d+%|\$[\d,]+|R\$[\d.,]+|\b\d{2,}\b/

function getFirstWord(text: string): string {
  return text.trim().split(/\s+/)[0]?.toLowerCase().replace(/[.,;:]$/, '') ?? ''
}

export function checkExperience(cv: CvInput, locale: Locale): SectionScore {
  const items = cv.experience.items
  let earned = 0
  const issues: ValidationIssue[] = []

  const strong = locale === 'pt' ? strongVerbsPt : strongVerbsEn
  const weak = locale === 'pt' ? weakVerbsPt : weakVerbsEn

  // Has items (5 pts)
  if (items.length > 0) {
    earned += 5
  } else {
    issues.push({ text: 'No work experience entries', priority: 'critical', section: 'experience' })
    return { earned, max: MAX, issues }
  }

  // Required fields filled (5 pts)
  const itemsWithFields = items.filter(i =>
    i.company.trim().length > 0 && i.role.trim().length > 0 && i.date.trim().length > 0,
  )
  if (itemsWithFields.length === items.length) {
    earned += 5
  } else {
    const missing = items.length - itemsWithFields.length
    earned += Math.round((itemsWithFields.length / items.length) * 5)
    issues.push({ text: `${missing} experience item(s) missing company, role, or date`, priority: 'critical', section: 'experience' })
  }

  // 3-6 highlights per item (5 pts)
  const highlightCounts = items.map(i => i.highlights.filter(h => h.trim().length > 0).length)
  const avgHighlights = highlightCounts.reduce((a, b) => a + b, 0) / items.length
  if (avgHighlights >= 3 && avgHighlights <= 6) {
    earned += 5
  } else if (avgHighlights >= 1) {
    earned += 2
    if (avgHighlights < 3) {
      issues.push({ text: 'Add more bullet points per experience (aim for 3-6)', priority: 'recommended', section: 'experience' })
    } else {
      issues.push({ text: 'Too many bullet points per experience — focus on top 3-6 achievements', priority: 'optional', section: 'experience' })
    }
  } else {
    issues.push({ text: 'Experience items have no bullet points', priority: 'critical', section: 'experience' })
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
    } else if (ratio >= 0.5) {
      earned += 4
      issues.push({ text: 'Use stronger action verbs to start bullet points', priority: 'recommended', section: 'experience' })
    } else {
      earned += 2
      issues.push({ text: 'Most bullets start with weak verbs — use strong action verbs', priority: 'critical', section: 'experience' })
    }
  }

  // Quantified achievements 50%+ (7 pts)
  if (allHighlights.length > 0) {
    const quantified = allHighlights.filter(h => METRIC_REGEX.test(h)).length
    const ratio = quantified / allHighlights.length
    if (ratio >= 0.5) {
      earned += 7
    } else if (ratio >= 0.2) {
      earned += 3
      issues.push({ text: 'Add more metrics and numbers to your achievements', priority: 'recommended', section: 'experience' })
    } else {
      earned += 1
      issues.push({ text: 'Quantify your achievements with numbers, percentages, or dollar amounts', priority: 'critical', section: 'experience' })
    }
  }

  return { earned, max: MAX, issues }
}
