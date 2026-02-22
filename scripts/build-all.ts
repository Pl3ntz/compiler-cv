import { writeTex } from './generate-tex.js'
import { compilePdf } from './compile-pdf.js'

const LOCALES = ['pt', 'en'] as const

console.log('=== Generating .tex files ===')
for (const locale of LOCALES) {
  const texPath = writeTex(locale)
  console.log(`  [OK] ${texPath}`)
}

console.log('\n=== Compiling PDFs ===')
for (const locale of LOCALES) {
  const pdfPath = compilePdf(locale)
  console.log(`  [OK] ${pdfPath}`)
}

console.log('\n=== Build complete ===')
