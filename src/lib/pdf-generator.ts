import { resolve } from 'node:path'
import type { CvData } from '../types/cv.js'
import { generateTexFromData } from '../../scripts/generate-tex.js'
import { compilePdfFromTex } from '../../scripts/compile-pdf.js'
import { pdfQueue } from './pdf-queue.js'
import { getTemplate, isValidTemplateId, DEFAULT_TEMPLATE_ID } from './templates.js'

export async function generatePdf(cvData: CvData): Promise<Buffer> {
  return pdfQueue.add(async () => {
    const templateId = isValidTemplateId(cvData.meta.templateId)
      ? cvData.meta.templateId
      : DEFAULT_TEMPLATE_ID
    const config = getTemplate(templateId)
    const preamblePath = resolve(process.cwd(), config.latexDir, 'preamble.tex')
    const tex = generateTexFromData(cvData)
    return compilePdfFromTex(tex, preamblePath)
  }) as Promise<Buffer>
}

const DANGEROUS_LATEX = /\\(write18|openin|openout|read|newread|newwrite|catcode|immediate|input|include|verbatiminput|csname|expandafter|directlua|special|usepackage\s*\{.*shell)/i

export async function generatePdfFromCustomLatex(latex: string): Promise<Buffer> {
  if (DANGEROUS_LATEX.test(latex)) {
    throw new Error('LaTeX source contains disallowed commands')
  }
  return pdfQueue.add(async () => {
    return compilePdfFromTex(latex)
  }) as Promise<Buffer>
}
