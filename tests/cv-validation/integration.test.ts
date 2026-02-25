import { describe, it, expect } from 'vitest'
import { runRuleBasedChecks } from '../../src/lib/cv-validation/index.js'
import { makeFullCv, makeEmptyCv } from './helpers.js'

describe('runRuleBasedChecks (integration)', () => {
  it('scores a complete CV near 100', () => {
    const result = runRuleBasedChecks(makeFullCv(), 'en')
    expect(result.totalScore).toBeGreaterThanOrEqual(85)
    expect(result.maxScore).toBe(100)
  })

  it('scores an empty CV at 0 plus date-continuity credit', () => {
    const result = runRuleBasedChecks(makeEmptyCv(), 'en')
    // Empty experience gets full dateContinuity (5) + no-dates formatting credit (4)
    // but the rest should be 0 or near 0
    expect(result.totalScore).toBeLessThanOrEqual(15)
  })

  it('is deterministic — same input always same output', () => {
    const cv = makeFullCv()
    const r1 = runRuleBasedChecks(cv, 'en')
    const r2 = runRuleBasedChecks(cv, 'en')
    const r3 = runRuleBasedChecks(cv, 'en')
    const r4 = runRuleBasedChecks(cv, 'en')
    const r5 = runRuleBasedChecks(cv, 'en')
    expect(r1.totalScore).toBe(r2.totalScore)
    expect(r2.totalScore).toBe(r3.totalScore)
    expect(r3.totalScore).toBe(r4.totalScore)
    expect(r4.totalScore).toBe(r5.totalScore)
  })

  it('returns all expected section keys', () => {
    const result = runRuleBasedChecks(makeFullCv(), 'en')
    const keys = Object.keys(result.sections)
    expect(keys).toContain('contact')
    expect(keys).toContain('summary')
    expect(keys).toContain('experience')
    expect(keys).toContain('education')
    expect(keys).toContain('skills')
    expect(keys).toContain('projects')
    expect(keys).toContain('languages')
    expect(keys).toContain('formatting')
    expect(keys).toContain('dateContinuity')
  })

  it('totalScore equals sum of section earned scores', () => {
    const result = runRuleBasedChecks(makeFullCv(), 'en')
    const sum = Object.values(result.sections).reduce((s, sec) => s + sec.earned, 0)
    expect(result.totalScore).toBe(sum)
  })

  it('section max values are correct', () => {
    const result = runRuleBasedChecks(makeFullCv(), 'en')
    expect(result.sections.contact.max).toBe(10)
    expect(result.sections.summary.max).toBe(10)
    expect(result.sections.experience.max).toBe(30)
    expect(result.sections.education.max).toBe(8)
    expect(result.sections.skills.max).toBe(12)
    expect(result.sections.projects.max).toBe(5)
    expect(result.sections.languages.max).toBe(5)
    expect(result.sections.formatting.max).toBe(15)
    expect(result.sections.dateContinuity.max).toBe(5)
  })

  it('max scores sum to 100', () => {
    const result = runRuleBasedChecks(makeFullCv(), 'en')
    const sum = Object.values(result.sections).reduce((s, sec) => s + sec.max, 0)
    expect(sum).toBe(100)
  })

  it('works with PT locale', () => {
    const cv = makeFullCv()
    cv.locale = 'pt'
    const result = runRuleBasedChecks(cv, 'pt')
    expect(result.totalScore).toBeGreaterThanOrEqual(80)
    expect(result.maxScore).toBe(100)
  })

  it('collects all issues across sections', () => {
    const result = runRuleBasedChecks(makeEmptyCv(), 'en')
    const allIssues = Object.values(result.sections).flatMap(s => s.issues)
    expect(allIssues.length).toBeGreaterThan(0)
    // Should have critical issues for missing essential sections
    expect(allIssues.some(i => i.priority === 'critical')).toBe(true)
  })
})
