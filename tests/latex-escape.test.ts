import { describe, it, expect } from 'vitest'
import { latexEscape } from '../src/lib/latex-escape.js'

describe('latexEscape', () => {
  it('should escape ampersand', () => {
    expect(latexEscape('H&S Software')).toBe('H\\&S Software')
  })

  it('should escape percent', () => {
    expect(latexEscape('90% coverage')).toBe('90\\% coverage')
  })

  it('should escape dollar sign', () => {
    expect(latexEscape('$100')).toBe('\\$100')
  })

  it('should escape hash', () => {
    expect(latexEscape('item #1')).toBe('item \\#1')
  })

  it('should escape underscore', () => {
    expect(latexEscape('my_var')).toBe('my\\_var')
  })

  it('should escape curly braces', () => {
    expect(latexEscape('{test}')).toBe('\\{test\\}')
  })

  it('should escape tilde', () => {
    expect(latexEscape('~home')).toBe('\\textasciitilde{}home')
  })

  it('should escape caret', () => {
    expect(latexEscape('^top')).toBe('\\textasciicircum{}top')
  })

  it('should escape multiple special chars', () => {
    expect(latexEscape('H&S: 100% of $50 #1'))
      .toBe('H\\&S: 100\\% of \\$50 \\#1')
  })

  it('should return plain text unchanged', () => {
    expect(latexEscape('Hello World')).toBe('Hello World')
  })

  it('should handle empty string', () => {
    expect(latexEscape('')).toBe('')
  })
})
