import type { CvInput } from '../../zod-schemas/cv.js'
import type { Locale, SectionScore, ValidationIssue } from '../types.js'

const MAX = 5

const MONTH_MAP: Record<string, number> = {
  jan: 0, january: 0, janeiro: 0,
  feb: 1, february: 1, fevereiro: 1,
  mar: 2, march: 2, marco: 2, 'março': 2,
  apr: 3, april: 3, abril: 3,
  may: 4, maio: 4,
  jun: 5, june: 5, junho: 5,
  jul: 6, july: 6, julho: 6,
  aug: 7, august: 7, agosto: 7,
  sep: 8, sept: 8, september: 8, setembro: 8, set: 8,
  oct: 9, october: 9, outubro: 9, out: 9,
  nov: 10, november: 10, novembro: 10,
  dec: 11, december: 11, dezembro: 11, dez: 11,
}

interface DateRange {
  start: number // months since epoch
  end: number
}

function parseMonthYear(text: string): number | null {
  // Try "Month YYYY" or "Mon YYYY"
  const monthYear = text.match(/([a-záéíóúãõç]+)\s+(\d{4})/i)
  if (monthYear) {
    const month = MONTH_MAP[monthYear[1].toLowerCase()]
    const year = parseInt(monthYear[2])
    if (month !== undefined && year >= 1900 && year <= 2100) {
      return year * 12 + month
    }
  }

  // Try "MM/YYYY"
  const mmYyyy = text.match(/(\d{1,2})\/(\d{4})/)
  if (mmYyyy) {
    const month = parseInt(mmYyyy[1]) - 1
    const year = parseInt(mmYyyy[2])
    if (month >= 0 && month <= 11 && year >= 1900 && year <= 2100) {
      return year * 12 + month
    }
  }

  // Try bare "YYYY"
  const yyyy = text.match(/\b(\d{4})\b/)
  if (yyyy) {
    const year = parseInt(yyyy[1])
    if (year >= 1900 && year <= 2100) {
      return year * 12 + 6 // mid-year estimate
    }
  }

  return null
}

function parseDateRange(dateStr: string): DateRange | null {
  const isPresent = /present|atual|presente/i.test(dateStr)

  // Split by common delimiters
  const parts = dateStr.split(/\s*[-–—]\s*|\s+to\s+|\s+a\s+/i)

  if (parts.length >= 2) {
    const start = parseMonthYear(parts[0])
    const end = isPresent ? (new Date().getFullYear() * 12 + new Date().getMonth()) : parseMonthYear(parts[parts.length - 1])
    if (start !== null && end !== null) {
      return { start, end }
    }
  } else if (parts.length === 1) {
    const val = parseMonthYear(parts[0])
    if (val !== null) {
      return { start: val, end: isPresent ? (new Date().getFullYear() * 12 + new Date().getMonth()) : val }
    }
  }

  return null
}

export function checkDateContinuity(cv: CvInput, _locale: Locale): SectionScore {
  const items = cv.experience.items
  let earned = 0
  const issues: ValidationIssue[] = []

  if (items.length === 0) {
    return { earned: MAX, max: MAX, issues } // no experience = no penalty
  }

  // Parse all date ranges
  const ranges: DateRange[] = []
  let unparseable = 0

  for (const item of items) {
    if (item.date.trim().length === 0) continue
    const range = parseDateRange(item.date)
    if (range) {
      ranges.push(range)
    } else {
      unparseable++
    }
  }

  // If we can't parse any dates, give full credit (don't penalize)
  if (ranges.length === 0) {
    return { earned: MAX, max: MAX, issues }
  }

  // Dates are parseable (2 pts)
  if (unparseable === 0) {
    earned += 2
  } else {
    earned += 1
    issues.push({ text: `${unparseable} date(s) could not be parsed for gap analysis`, priority: 'optional', section: 'experience' })
  }

  // Check for gaps > 6 months (3 pts)
  if (ranges.length >= 2) {
    const sorted = [...ranges].sort((a, b) => b.end - a.end) // most recent first
    let hasLargeGap = false

    for (let i = 0; i < sorted.length - 1; i++) {
      const gapMonths = sorted[i].start - sorted[i + 1].end
      if (gapMonths > 6) {
        hasLargeGap = true
        break
      }
    }

    if (!hasLargeGap) {
      earned += 3
    } else {
      issues.push({ text: 'Employment gap longer than 6 months detected — consider addressing it', priority: 'optional', section: 'experience' })
    }
  } else {
    earned += 3 // single job, no gap possible
  }

  return { earned, max: MAX, issues }
}
