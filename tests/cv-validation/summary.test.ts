import { describe, it, expect } from 'vitest'
import { checkSummary } from '../../src/lib/cv-validation/checks/summary.js'
import { makeFullCv, makeEmptyCv } from './helpers.js'

describe('checkSummary', () => {
  it('gives full score for a well-written summary', () => {
    const result = checkSummary(makeFullCv(), 'en')
    expect(result.earned).toBe(10)
    expect(result.max).toBe(10)
    expect(result.issues).toHaveLength(0)
  })

  it('gives 0 for empty summary', () => {
    const result = checkSummary(makeEmptyCv(), 'en')
    expect(result.earned).toBe(0)
    expect(result.issues.some(i => i.priority === 'critical')).toBe(true)
  })

  it('penalizes single-sentence summary', () => {
    const cv = makeFullCv()
    cv.summary.text = 'Software engineer with experience.'
    const result = checkSummary(cv, 'en')
    // 3 (present) + 2 (1 sentence, partial) + 3 (no pronouns) = 8
    expect(result.earned).toBe(8)
    expect(result.issues.some(i => i.text.includes('too short'))).toBe(true)
  })

  it('penalizes too many sentences', () => {
    const cv = makeFullCv()
    cv.summary.text = 'First. Second. Third. Fourth. Fifth. Sixth. Seventh.'
    const result = checkSummary(cv, 'en')
    expect(result.earned).toBe(8) // 3 + 2 + 3
    expect(result.issues.some(i => i.text.includes('too long'))).toBe(true)
  })

  it('penalizes first-person pronouns in EN', () => {
    const cv = makeFullCv()
    cv.summary.text = 'I am a software engineer. I have built many applications. My experience spans 8 years.'
    const result = checkSummary(cv, 'en')
    expect(result.issues.some(i => i.text.includes('pronouns'))).toBe(true)
    expect(result.earned).toBeLessThan(10)
  })

  it('penalizes first-person pronouns in PT', () => {
    const cv = makeFullCv()
    cv.summary.text = 'Eu sou um engenheiro de software. Minha experiencia abrange 8 anos. Trabalho com tecnologia.'
    const result = checkSummary(cv, 'pt')
    expect(result.issues.some(i => i.text.includes('pronouns'))).toBe(true)
  })
})
