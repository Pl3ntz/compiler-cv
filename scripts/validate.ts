import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { parse } from 'yaml'
import Ajv from 'ajv'

const cvSchema = {
  type: 'object',
  required: ['meta', 'header', 'summary', 'education', 'experience', 'projects', 'skills', 'languages'],
  properties: {
    meta: {
      type: 'object',
      required: ['locale', 'pdfFilename'],
      properties: {
        locale: { type: 'string' },
        pdfFilename: { type: 'string' },
      },
    },
    header: {
      type: 'object',
      required: ['name', 'location', 'phone', 'email', 'linkedin', 'github'],
      properties: {
        name: { type: 'string' },
        location: { type: 'string' },
        phone: { type: 'string' },
        email: { type: 'string' },
        linkedin: { type: 'string' },
        github: { type: 'string' },
      },
    },
    summary: {
      type: 'object',
      required: ['title', 'text'],
      properties: {
        title: { type: 'string' },
        text: { type: 'string' },
      },
    },
    education: {
      type: 'object',
      required: ['title', 'items'],
      properties: {
        title: { type: 'string' },
        items: {
          type: 'array',
          minItems: 1,
          items: {
            type: 'object',
            required: ['institution', 'degree', 'date', 'location', 'highlights'],
            properties: {
              institution: { type: 'string' },
              degree: { type: 'string' },
              date: { type: 'string' },
              location: { type: 'string' },
              highlights: { type: 'array', items: { type: 'string' } },
            },
          },
        },
      },
    },
    experience: {
      type: 'object',
      required: ['title', 'items'],
      properties: {
        title: { type: 'string' },
        items: {
          type: 'array',
          minItems: 1,
          items: {
            type: 'object',
            required: ['company', 'role', 'date', 'location', 'highlights'],
            properties: {
              company: { type: 'string' },
              role: { type: 'string' },
              date: { type: 'string' },
              location: { type: 'string' },
              highlights: { type: 'array', items: { type: 'string' } },
            },
          },
        },
      },
    },
    projects: {
      type: 'object',
      required: ['title', 'items'],
      properties: {
        title: { type: 'string' },
        items: {
          type: 'array',
          minItems: 1,
          items: {
            type: 'object',
            required: ['name', 'tech', 'date', 'highlights'],
            properties: {
              name: { type: 'string' },
              tech: { type: 'string' },
              date: { type: 'string' },
              highlights: { type: 'array', items: { type: 'string' } },
            },
          },
        },
      },
    },
    skills: {
      type: 'object',
      required: ['title', 'categories'],
      properties: {
        title: { type: 'string' },
        categories: {
          type: 'array',
          minItems: 1,
          items: {
            type: 'object',
            required: ['name', 'values'],
            properties: {
              name: { type: 'string' },
              values: { type: 'string' },
            },
          },
        },
      },
    },
    languages: {
      type: 'object',
      required: ['title', 'items'],
      properties: {
        title: { type: 'string' },
        items: {
          type: 'array',
          minItems: 1,
          items: {
            type: 'object',
            required: ['name', 'level'],
            properties: {
              name: { type: 'string' },
              level: { type: 'string' },
            },
          },
        },
      },
    },
  },
}

export function validateCv(data: unknown): { valid: boolean; errors: string[] } {
  const ajv = new Ajv({ allErrors: true })
  const validate = ajv.compile(cvSchema)
  const valid = validate(data) as boolean

  if (!valid && validate.errors) {
    const errors = validate.errors.map(
      (e) => `${e.instancePath || '/'} ${e.message}`
    )
    return { valid: false, errors }
  }

  return { valid: true, errors: [] }
}

const locales = ['pt', 'en'] as const

if (process.argv[1]?.endsWith('validate.ts') || process.argv[1]?.endsWith('validate.js')) {
  let hasErrors = false

  for (const locale of locales) {
    const filePath = resolve(process.cwd(), `data/cv.${locale}.yaml`)
    const raw = readFileSync(filePath, 'utf-8')
    const data = parse(raw)
    const result = validateCv(data)

    if (result.valid) {
      console.log(`[OK] cv.${locale}.yaml is valid`)
    } else {
      console.error(`[FAIL] cv.${locale}.yaml has errors:`)
      for (const err of result.errors) {
        console.error(`  - ${err}`)
      }
      hasErrors = true
    }
  }

  if (hasErrors) {
    process.exit(1)
  }
}
