import type { CvInput } from '../../zod-schemas/cv.js'
import type { Locale, SectionScore, ValidationIssue, ValidationPositive } from '../types.js'
import { msg } from '../messages.js'

const MAX = 10

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const LINKEDIN_REGEX = /linkedin\.com\/in\//i

export function checkContact(cv: CvInput, locale: Locale): SectionScore {
  const h = cv.header
  let earned = 0
  const issues: ValidationIssue[] = []
  const positives: ValidationPositive[] = []

  // Name present (2 pts)
  if (h.name.trim().length > 0) {
    earned += 2
    positives.push({ text: msg(locale, 'contact.name_ok'), section: 'header' })
  } else {
    issues.push({ text: msg(locale, 'contact.name_missing'), priority: 'critical', section: 'header' })
  }

  // Email present + valid (3 pts)
  if (h.email.trim().length > 0) {
    earned += 1
    if (EMAIL_REGEX.test(h.email.trim())) {
      earned += 2
      positives.push({ text: msg(locale, 'contact.email_ok'), section: 'header' })
    } else {
      issues.push({ text: msg(locale, 'contact.email_invalid'), priority: 'recommended', section: 'header' })
    }
  } else {
    issues.push({ text: msg(locale, 'contact.email_missing'), priority: 'critical', section: 'header' })
  }

  // Phone present (2 pts)
  if (h.phone.trim().length > 0) {
    earned += 2
    positives.push({ text: msg(locale, 'contact.phone_ok'), section: 'header' })
  } else {
    issues.push({ text: msg(locale, 'contact.phone_missing'), priority: 'recommended', section: 'header' })
  }

  // LinkedIn present + valid (2 pts)
  if (h.linkedin.trim().length > 0) {
    if (LINKEDIN_REGEX.test(h.linkedin.trim())) {
      earned += 2
      positives.push({ text: msg(locale, 'contact.linkedin_ok'), section: 'header' })
    } else {
      earned += 1
      issues.push({ text: msg(locale, 'contact.linkedin_invalid'), priority: 'recommended', section: 'header' })
    }
  } else {
    issues.push({ text: msg(locale, 'contact.linkedin_missing'), priority: 'recommended', section: 'header' })
  }

  // Location present (1 pt)
  if (h.location.trim().length > 0) {
    earned += 1
    positives.push({ text: msg(locale, 'contact.location_ok'), section: 'header' })
  } else {
    issues.push({ text: msg(locale, 'contact.location_missing'), priority: 'optional', section: 'header' })
  }

  return { earned, max: MAX, issues, positives }
}
