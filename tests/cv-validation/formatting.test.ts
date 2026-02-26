import { describe, it, expect } from 'vitest'
import { checkFormatting } from '../../src/lib/cv-validation/checks/formatting.js'
import { makeFullCv, makeEmptyCv } from './helpers.js'

describe('checkFormatting', () => {
  it('gives good score for well-formatted CV', () => {
    const result = checkFormatting(makeFullCv(), 'en')
    expect(result.earned).toBeGreaterThanOrEqual(10)
    expect(result.max).toBe(15)
    expect(result.positives.length).toBeGreaterThan(0)
  })

  it('flags empty CV', () => {
    const result = checkFormatting(makeEmptyCv(), 'en')
    expect(result.issues.some(i => i.text.includes('empty'))).toBe(true)
  })

  it('detects empty bullet points', () => {
    const cv = makeFullCv()
    cv.experience.items[0].highlights = ['Good bullet', '', 'Another good one']
    const result = checkFormatting(cv, 'en')
    expect(result.issues.some(i => i.text.includes('empty bullet'))).toBe(true)
  })

  it('detects first-person pronouns globally', () => {
    const cv = makeFullCv()
    cv.experience.items[0].highlights = ['I built a platform that serves millions of users']
    const result = checkFormatting(cv, 'en')
    expect(result.issues.some(i => i.text.includes('pronouns'))).toBe(true)
  })

  it('validates ATS-safe date formats', () => {
    const cv = makeFullCv()
    // Good dates are already in the full CV
    const result = checkFormatting(cv, 'en')
    expect(result.issues.every(i => !i.text.includes('ATS-friendly'))).toBe(true)
  })

  it('flags non-ATS date formats', () => {
    const cv = makeFullCv()
    cv.experience.items = [
      {
        company: 'Co',
        role: 'Dev',
        date: 'Last year to now',
        location: '',
        highlights: ['Built things with metrics of 50% improvement'],
      },
    ]
    const result = checkFormatting(cv, 'en')
    expect(result.issues.some(i => i.text.includes('ATS-friendly'))).toBe(true)
  })

  it('returns positives in Portuguese when locale is pt', () => {
    const result = checkFormatting(makeFullCv(), 'pt')
    expect(result.positives.some(p => p.text.includes('bullet points'))).toBe(true)
  })
})
