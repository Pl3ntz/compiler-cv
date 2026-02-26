import { describe, it, expect } from 'vitest'
import { checkContact } from '../../src/lib/cv-validation/checks/contact.js'
import { makeFullCv, makeEmptyCv } from './helpers.js'

describe('checkContact', () => {
  it('gives full score for complete contact info', () => {
    const result = checkContact(makeFullCv(), 'en')
    expect(result.earned).toBe(10)
    expect(result.max).toBe(10)
    expect(result.issues).toHaveLength(0)
    expect(result.positives.length).toBeGreaterThan(0)
  })

  it('gives 0 for empty contact info', () => {
    const result = checkContact(makeEmptyCv(), 'en')
    expect(result.earned).toBe(0)
    expect(result.max).toBe(10)
    expect(result.issues.length).toBeGreaterThan(0)
    expect(result.issues.some(i => i.priority === 'critical')).toBe(true)
    expect(result.positives).toHaveLength(0)
  })

  it('validates email format', () => {
    const cv = makeFullCv()
    cv.header.email = 'not-an-email'
    const result = checkContact(cv, 'en')
    // Gets 1 pt for present, but not 2 for valid format
    expect(result.earned).toBe(8) // 2(name) + 1(email present) + 2(phone) + 2(linkedin) + 1(location)
    expect(result.issues.some(i => i.text.includes('Email format'))).toBe(true)
  })

  it('validates LinkedIn URL format', () => {
    const cv = makeFullCv()
    cv.header.linkedin = 'https://example.com/janedoe'
    const result = checkContact(cv, 'en')
    // Gets 1 pt for present, but not 2 for valid linkedin.com/in/
    expect(result.earned).toBe(9) // 2+3+2+1+1 = 9
    expect(result.issues.some(i => i.text.includes('linkedin.com/in/'))).toBe(true)
  })

  it('marks missing phone as recommended', () => {
    const cv = makeFullCv()
    cv.header.phone = ''
    const result = checkContact(cv, 'en')
    expect(result.earned).toBe(8) // missing 2 pts
    expect(result.issues.some(i => i.text.includes('Phone') && i.priority === 'recommended')).toBe(true)
  })

  it('marks missing location as optional', () => {
    const cv = makeFullCv()
    cv.header.location = ''
    const result = checkContact(cv, 'en')
    expect(result.earned).toBe(9) // missing 1 pt
    expect(result.issues.some(i => i.text.includes('Location') && i.priority === 'optional')).toBe(true)
  })

  it('returns messages in Portuguese when locale is pt', () => {
    const result = checkContact(makeFullCv(), 'pt')
    expect(result.earned).toBe(10)
    expect(result.positives.some(p => p.text === 'Nome preenchido')).toBe(true)
    expect(result.positives.some(p => p.text === 'E-mail válido')).toBe(true)
  })

  it('returns messages in English when locale is en', () => {
    const result = checkContact(makeFullCv(), 'en')
    expect(result.positives.some(p => p.text === 'Name is present')).toBe(true)
    expect(result.positives.some(p => p.text === 'Valid email address')).toBe(true)
  })
})
