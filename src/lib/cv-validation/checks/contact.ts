import type { CvInput } from '../../zod-schemas/cv.js'
import type { Locale, SectionScore, ValidationIssue } from '../types.js'

const MAX = 10

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const LINKEDIN_REGEX = /linkedin\.com\/in\//i

export function checkContact(cv: CvInput, _locale: Locale): SectionScore {
  const h = cv.header
  let earned = 0
  const issues: ValidationIssue[] = []

  // Name present (2 pts)
  if (h.name.trim().length > 0) {
    earned += 2
  } else {
    issues.push({ text: 'Name is missing', priority: 'critical', section: 'header' })
  }

  // Email present + valid (3 pts)
  if (h.email.trim().length > 0) {
    earned += 1
    if (EMAIL_REGEX.test(h.email.trim())) {
      earned += 2
    } else {
      issues.push({ text: 'Email format is invalid', priority: 'recommended', section: 'header' })
    }
  } else {
    issues.push({ text: 'Email is missing', priority: 'critical', section: 'header' })
  }

  // Phone present (2 pts)
  if (h.phone.trim().length > 0) {
    earned += 2
  } else {
    issues.push({ text: 'Phone number is missing', priority: 'recommended', section: 'header' })
  }

  // LinkedIn present + valid (2 pts)
  if (h.linkedin.trim().length > 0) {
    if (LINKEDIN_REGEX.test(h.linkedin.trim())) {
      earned += 2
    } else {
      earned += 1
      issues.push({ text: 'LinkedIn URL should contain linkedin.com/in/', priority: 'recommended', section: 'header' })
    }
  } else {
    issues.push({ text: 'LinkedIn profile is missing', priority: 'recommended', section: 'header' })
  }

  // Location present (1 pt)
  if (h.location.trim().length > 0) {
    earned += 1
  } else {
    issues.push({ text: 'Location is missing', priority: 'optional', section: 'header' })
  }

  return { earned, max: MAX, issues }
}
