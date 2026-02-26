import { describe, it, expect } from 'vitest'
import { checkEducation } from '../../src/lib/cv-validation/checks/education.js'
import { makeFullCv, makeEmptyCv } from './helpers.js'

describe('checkEducation', () => {
  it('gives full score for complete education', () => {
    const result = checkEducation(makeFullCv(), 'en')
    expect(result.earned).toBe(8)
    expect(result.max).toBe(8)
    expect(result.issues).toHaveLength(0)
    expect(result.positives.length).toBeGreaterThan(0)
  })

  it('gives 0 for empty education', () => {
    const result = checkEducation(makeEmptyCv(), 'en')
    expect(result.earned).toBe(0)
    expect(result.issues.some(i => i.priority === 'critical')).toBe(true)
    expect(result.positives).toHaveLength(0)
  })

  it('penalizes missing institution or degree', () => {
    const cv = makeFullCv()
    cv.education.items = [
      { institution: '', degree: 'B.S.', date: '2016', location: '', highlights: [] },
    ]
    const result = checkEducation(cv, 'en')
    expect(result.earned).toBeLessThan(8)
    expect(result.issues.some(i => i.text.includes('missing institution'))).toBe(true)
  })

  it('penalizes missing date', () => {
    const cv = makeFullCv()
    cv.education.items = [
      { institution: 'MIT', degree: 'B.S.', date: '', location: '', highlights: [] },
    ]
    const result = checkEducation(cv, 'en')
    expect(result.earned).toBeLessThan(8)
    expect(result.issues.some(i => i.text.includes('dates'))).toBe(true)
  })

  it('returns positives in Portuguese when locale is pt', () => {
    const result = checkEducation(makeFullCv(), 'pt')
    expect(result.positives.some(p => p.text === 'Seção de formação preenchida')).toBe(true)
  })
})
