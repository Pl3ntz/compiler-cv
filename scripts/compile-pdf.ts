import { execSync, execFileSync } from 'node:child_process'
import {
  copyFileSync,
  readFileSync,
  writeFileSync,
  mkdirSync,
  existsSync,
  rmSync,
} from 'node:fs'
import { resolve, dirname, join } from 'node:path'
import { parse } from 'yaml'
import { tmpdir } from 'node:os'
import { randomUUID } from 'node:crypto'

export function compilePdf(locale: string): string {
  const texPath = resolve(process.cwd(), `dist/latex/cv-${locale}.tex`)

  if (!existsSync(texPath)) {
    throw new Error(`TEX file not found: ${texPath}. Run generate-tex first.`)
  }

  const preambleSrc = resolve(process.cwd(), 'latex/jake/preamble.tex')
  const preambleDst = resolve(dirname(texPath), 'preamble.tex')
  copyFileSync(preambleSrc, preambleDst)

  execSync(`tectonic ${texPath}`, {
    cwd: dirname(texPath),
    stdio: 'inherit',
  })

  const pdfName = texPath.replace('.tex', '.pdf')
  const cvPath = resolve(process.cwd(), `data/cv.${locale}.yaml`)
  const cv = parse(readFileSync(cvPath, 'utf-8'))
  const outFilename = cv.meta.pdfFilename

  const publicPdfDir = resolve(process.cwd(), 'public/pdf')
  mkdirSync(publicPdfDir, { recursive: true })
  const finalPath = resolve(publicPdfDir, `${outFilename}.pdf`)
  copyFileSync(pdfName, finalPath)

  return finalPath
}

export function compilePdfFromTex(texContent: string, preamblePath?: string): Buffer {
  const tempDir = join(tmpdir(), `cv-pdf-${randomUUID()}`)
  mkdirSync(tempDir, { recursive: true })

  try {
    const preambleSrc = preamblePath ?? resolve(process.cwd(), 'latex/jake/preamble.tex')
    const preambleDst = join(tempDir, 'preamble.tex')
    copyFileSync(preambleSrc, preambleDst)

    const texPath = join(tempDir, 'cv.tex')
    writeFileSync(texPath, texContent, 'utf-8')

    execFileSync('tectonic', [texPath], {
      cwd: tempDir,
      stdio: 'pipe',
      timeout: 60_000,
    })

    const pdfPath = join(tempDir, 'cv.pdf')
    return readFileSync(pdfPath)
  } finally {
    rmSync(tempDir, { recursive: true, force: true })
  }
}

if (process.argv[1]?.endsWith('compile-pdf.ts') || process.argv[1]?.endsWith('compile-pdf.js')) {
  const locales = ['pt', 'en']
  for (const locale of locales) {
    try {
      const path = compilePdf(locale)
      console.log(`[OK] Compiled ${path}`)
    } catch (error) {
      console.error(`[FAIL] Failed to compile ${locale}:`, error)
      process.exit(1)
    }
  }
}
