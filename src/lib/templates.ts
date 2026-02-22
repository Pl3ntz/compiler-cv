export const TEMPLATE_IDS = ['jake'] as const
export type TemplateId = (typeof TEMPLATE_IDS)[number]
export const DEFAULT_TEMPLATE_ID: TemplateId = 'jake'

export interface TemplateConfig {
  readonly id: TemplateId
  readonly name: string
  readonly description: string
  readonly latexDir: string
  readonly cssDir: string
}

export const TEMPLATES: Readonly<Record<TemplateId, TemplateConfig>> = {
  jake: {
    id: 'jake',
    name: "Jake's Resume",
    description: 'Clean single-column resume. Popular on Overleaf.',
    latexDir: 'latex/jake',
    cssDir: 'src/styles/templates/jake',
  },
}

export function getTemplate(id: TemplateId): TemplateConfig {
  return TEMPLATES[id]
}

export function isValidTemplateId(value: string): value is TemplateId {
  return TEMPLATE_IDS.includes(value as TemplateId)
}
