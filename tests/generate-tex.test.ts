import { describe, it, expect } from 'vitest'
import { generateTex } from '../scripts/generate-tex.js'

describe('generateTex', () => {
  it('should generate valid LaTeX for PT locale', () => {
    const tex = generateTex('pt')
    expect(tex).toContain('\\input{preamble}')
    expect(tex).toContain('\\usepackage[brazilian]{babel}')
    expect(tex).toContain('Vitor Plentz')
    expect(tex).toContain('\\begin{document}')
    expect(tex).toContain('\\end{document}')
  })

  it('should generate valid LaTeX for EN locale', () => {
    const tex = generateTex('en')
    expect(tex).toContain('\\input{preamble}')
    expect(tex).toContain('\\usepackage[english]{babel}')
    expect(tex).toContain('Vitor Plentz')
    expect(tex).toContain('Professional Summary')
  })

  it('should escape special LaTeX characters in company name', () => {
    const tex = generateTex('pt')
    expect(tex).toContain('H\\&S Software')
  })

  it('should contain all CV sections', () => {
    const tex = generateTex('pt')
    expect(tex).toContain('\\section{')
    expect(tex).toContain('\\resumeSubheading')
    expect(tex).toContain('\\resumeProjectHeading')
    expect(tex).toContain('\\resumeItem{')
  })
})
