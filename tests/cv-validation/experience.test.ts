import { describe, it, expect } from 'vitest'
import { checkExperience } from '../../src/lib/cv-validation/checks/experience.js'
import { makeFullCv, makeEmptyCv } from './helpers.js'

describe('checkExperience', () => {
  it('gives high score for well-formed experience', () => {
    const result = checkExperience(makeFullCv(), 'en')
    expect(result.earned).toBeGreaterThanOrEqual(25)
    expect(result.max).toBe(30)
    expect(result.positives.length).toBeGreaterThan(0)
  })

  it('gives only base points for empty experience', () => {
    const result = checkExperience(makeEmptyCv(), 'en')
    expect(result.earned).toBe(0)
    expect(result.issues.some(i => i.priority === 'critical')).toBe(true)
    expect(result.positives).toHaveLength(0)
  })

  it('penalizes missing required fields', () => {
    const cv = makeFullCv()
    cv.experience.items = [
      { company: '', role: 'Engineer', date: '2020', location: '', highlights: ['Built stuff'] },
    ]
    const result = checkExperience(cv, 'en')
    expect(result.issues.some(i => i.text.includes('missing company'))).toBe(true)
  })

  it('penalizes too few highlights', () => {
    const cv = makeFullCv()
    cv.experience.items = [
      { company: 'Co', role: 'Dev', date: 'Jan 2020 - Present', location: '', highlights: ['Did thing'] },
    ]
    const result = checkExperience(cv, 'en')
    expect(result.issues.some(i => i.text.includes('bullet points'))).toBe(true)
  })

  it('penalizes weak action verbs', () => {
    const cv = makeFullCv()
    cv.experience.items = [
      {
        company: 'Co',
        role: 'Dev',
        date: 'Jan 2020 - Present',
        location: '',
        highlights: [
          'Helped build a feature',
          'Assisted with testing',
          'Worked on the frontend',
          'Was responsible for deployment',
        ],
      },
    ]
    const result = checkExperience(cv, 'en')
    expect(result.issues.some(i => i.text.toLowerCase().includes('verb'))).toBe(true)
  })

  it('rewards quantified achievements', () => {
    const cv = makeFullCv()
    cv.experience.items = [
      {
        company: 'Co',
        role: 'Dev',
        date: 'Jan 2020 - Present',
        location: '',
        highlights: [
          'Increased revenue by 25%',
          'Reduced latency from 200ms to 50ms',
          'Led team of 12 engineers',
          'Saved $100,000 in infrastructure costs',
        ],
      },
    ]
    const result = checkExperience(cv, 'en')
    // Should score high on quantification
    expect(result.earned).toBeGreaterThanOrEqual(20)
  })

  it('returns positives in Portuguese when locale is pt', () => {
    const cv = makeFullCv()
    const result = checkExperience(cv, 'pt')
    expect(result.positives.some(p => p.text === 'Seção de experiência preenchida')).toBe(true)
  })
})
