import { describe, it, expect } from 'vitest'
import { checkDateContinuity } from '../../src/lib/cv-validation/checks/date-continuity.js'
import { makeFullCv, makeEmptyCv } from './helpers.js'

describe('checkDateContinuity', () => {
  it('gives full score for continuous timeline', () => {
    const result = checkDateContinuity(makeFullCv(), 'en')
    expect(result.earned).toBe(5)
    expect(result.max).toBe(5)
    expect(result.issues).toHaveLength(0)
    expect(result.positives.length).toBeGreaterThan(0)
  })

  it('gives full score for empty experience (no penalty)', () => {
    const result = checkDateContinuity(makeEmptyCv(), 'en')
    expect(result.earned).toBe(5)
  })

  it('detects large employment gaps', () => {
    const cv = makeFullCv()
    cv.experience.items = [
      { company: 'A', role: 'Dev', date: 'Jan 2022 - Present', location: '', highlights: ['Built things'] },
      { company: 'B', role: 'Dev', date: 'Jan 2018 - Jun 2019', location: '', highlights: ['Built stuff'] },
    ]
    const result = checkDateContinuity(cv, 'en')
    expect(result.issues.some(i => i.text.includes('gap'))).toBe(true)
  })

  it('handles MM/YYYY format', () => {
    const cv = makeFullCv()
    cv.experience.items = [
      { company: 'A', role: 'Dev', date: '01/2022 - 12/2023', location: '', highlights: ['Built things'] },
      { company: 'B', role: 'Dev', date: '06/2020 - 12/2021', location: '', highlights: ['Built stuff'] },
    ]
    const result = checkDateContinuity(cv, 'en')
    expect(result.earned).toBe(5) // continuous
  })

  it('handles unparseable dates gracefully', () => {
    const cv = makeFullCv()
    cv.experience.items = [
      { company: 'A', role: 'Dev', date: 'Some random text', location: '', highlights: ['Built things'] },
    ]
    const result = checkDateContinuity(cv, 'en')
    // Unparseable = full credit (don't penalize)
    expect(result.earned).toBe(5)
  })

  it('handles Present keyword', () => {
    const cv = makeFullCv()
    cv.experience.items = [
      { company: 'A', role: 'Dev', date: 'Jan 2020 - Present', location: '', highlights: ['Built things'] },
    ]
    const result = checkDateContinuity(cv, 'en')
    expect(result.earned).toBe(5)
  })

  it('returns positives in Portuguese when locale is pt', () => {
    const result = checkDateContinuity(makeFullCv(), 'pt')
    expect(result.positives.some(p => p.text === 'Todas as datas de emprego são interpretáveis')).toBe(true)
  })
})
