import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { parse } from 'yaml'
import { validateCv } from '../scripts/validate.js'

describe('validateCv', () => {
  it('should validate cv.pt.yaml successfully', () => {
    const raw = readFileSync(resolve(process.cwd(), 'data/cv.pt.yaml'), 'utf-8')
    const data = parse(raw)
    const result = validateCv(data)
    expect(result.valid).toBe(true)
    expect(result.errors).toEqual([])
  })

  it('should validate cv.en.yaml successfully', () => {
    const raw = readFileSync(resolve(process.cwd(), 'data/cv.en.yaml'), 'utf-8')
    const data = parse(raw)
    const result = validateCv(data)
    expect(result.valid).toBe(true)
    expect(result.errors).toEqual([])
  })

  it('should reject empty object', () => {
    const result = validateCv({})
    expect(result.valid).toBe(false)
    expect(result.errors.length).toBeGreaterThan(0)
  })

  it('should reject missing required fields', () => {
    const result = validateCv({
      meta: { locale: 'pt', pdfFilename: 'test' },
      header: { name: 'Test' },
    })
    expect(result.valid).toBe(false)
  })

  it('should reject invalid meta', () => {
    const raw = readFileSync(resolve(process.cwd(), 'data/cv.pt.yaml'), 'utf-8')
    const data = parse(raw)
    const modified = { ...data, meta: { locale: 123 } }
    const result = validateCv(modified)
    expect(result.valid).toBe(false)
  })
})
