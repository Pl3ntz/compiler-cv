import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { parse } from 'yaml'
import ejs from 'ejs'
import { latexEscape } from '../src/lib/latex-escape.js'
import type { CvData } from '../src/types/cv.js'
import { getTemplate, isValidTemplateId, DEFAULT_TEMPLATE_ID } from '../src/lib/templates.js'

const BABEL_MAP: Record<string, string> = {
  pt: 'brazilian',
  en: 'english',
}

export function generateTexFromData(cvData: CvData): string {
  const templateId = isValidTemplateId(cvData.meta.templateId)
    ? cvData.meta.templateId
    : DEFAULT_TEMPLATE_ID
  const config = getTemplate(templateId)
  const templatePath = resolve(process.cwd(), config.latexDir, 'template.tex.ejs')
  const template = readFileSync(templatePath, 'utf-8')

  const babelLang = BABEL_MAP[cvData.meta.locale] ?? 'english'

  return ejs.render(template, {
    ...cvData,
    meta: cvData.meta,
    customSections: cvData.customSections ?? [],
    babelLang,
    e: latexEscape,
  })
}

export function generateTex(locale: string): string {
  const cvPath = resolve(process.cwd(), `data/cv.${locale}.yaml`)
  const cvRaw = readFileSync(cvPath, 'utf-8')
  const cv: CvData = parse(cvRaw)

  return generateTexFromData(cv)
}

export function writeTex(locale: string): string {
  const tex = generateTex(locale)
  const outDir = resolve(process.cwd(), 'dist/latex')
  mkdirSync(outDir, { recursive: true })
  const outPath = resolve(outDir, `cv-${locale}.tex`)
  writeFileSync(outPath, tex, 'utf-8')
  return outPath
}

if (process.argv[1]?.endsWith('generate-tex.ts') || process.argv[1]?.endsWith('generate-tex.js')) {
  const locales = ['pt', 'en']
  for (const locale of locales) {
    const path = writeTex(locale)
    console.log(`[OK] Generated ${path}`)
  }
}
