import { describe, it, expect } from 'vitest'
import { checkSkills } from '../../src/lib/cv-validation/checks/skills.js'
import { makeFullCv, makeEmptyCv } from './helpers.js'

describe('checkSkills', () => {
  it('gives full score for well-organized skills', () => {
    const result = checkSkills(makeFullCv(), 'en')
    expect(result.earned).toBe(12)
    expect(result.max).toBe(12)
    expect(result.issues).toHaveLength(0)
    expect(result.positives.length).toBeGreaterThan(0)
  })

  it('gives 0 for empty skills', () => {
    const result = checkSkills(makeEmptyCv(), 'en')
    expect(result.earned).toBe(0)
    expect(result.issues.some(i => i.priority === 'critical')).toBe(true)
    expect(result.positives).toHaveLength(0)
  })

  it('penalizes single category', () => {
    const cv = makeFullCv()
    cv.skills.categories = [
      { name: 'All Skills', values: 'TypeScript, React, Node.js, Python, AWS, Docker, SQL, Go' },
    ]
    const result = checkSkills(cv, 'en')
    // Has items (3) + not 2+ cats (0) + 8+ skills (3) + no empty (3) = 9
    expect(result.earned).toBe(9)
    expect(result.issues.some(i => i.text.includes('2 skill categories'))).toBe(true)
  })

  it('penalizes too few total skills', () => {
    const cv = makeFullCv()
    cv.skills.categories = [
      { name: 'Languages', values: 'TypeScript' },
      { name: 'Frameworks', values: 'React' },
    ]
    const result = checkSkills(cv, 'en')
    expect(result.issues.some(i => i.text.includes('skills listed'))).toBe(true)
  })

  it('penalizes empty category values', () => {
    const cv = makeFullCv()
    cv.skills.categories = [
      { name: 'Languages', values: 'TypeScript, Python' },
      { name: '', values: '' },
    ]
    const result = checkSkills(cv, 'en')
    expect(result.issues.some(i => i.text.includes('empty name or values'))).toBe(true)
  })

  it('returns positives in Portuguese when locale is pt', () => {
    const result = checkSkills(makeFullCv(), 'pt')
    expect(result.positives.some(p => p.text === 'Seção de habilidades preenchida')).toBe(true)
  })
})
