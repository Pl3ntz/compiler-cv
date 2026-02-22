import type { Locale } from './locales.js'
import type { CvInput } from './zod-schemas/cv.js'

const DEFAULTS: Record<Locale, CvInput> = {
  pt: {
    templateId: 'jake',
    sectionOrder: ['summary', 'education', 'experience', 'projects', 'skills', 'languages'],
    header: {
      name: '',
      location: '',
      phone: '',
      email: '',
      linkedin: '',
      github: '',
    },
    summary: {
      title: 'Resumo Profissional',
      text: '',
    },
    education: {
      title: 'Formacao Academica',
      items: [],
    },
    experience: {
      title: 'Experiencia Profissional',
      items: [],
    },
    projects: {
      title: 'Projetos Principais',
      items: [],
    },
    skills: {
      title: 'Habilidades Tecnicas',
      categories: [],
    },
    languages: {
      title: 'Idiomas',
      items: [],
    },
  },
  en: {
    templateId: 'jake',
    sectionOrder: ['summary', 'education', 'experience', 'projects', 'skills', 'languages'],
    header: {
      name: '',
      location: '',
      phone: '',
      email: '',
      linkedin: '',
      github: '',
    },
    summary: {
      title: 'Professional Summary',
      text: '',
    },
    education: {
      title: 'Education',
      items: [],
    },
    experience: {
      title: 'Professional Experience',
      items: [],
    },
    projects: {
      title: 'Key Projects',
      items: [],
    },
    skills: {
      title: 'Technical Skills',
      categories: [],
    },
    languages: {
      title: 'Languages',
      items: [],
    },
  },
}

export function getFormDefaults(locale: Locale): CvInput {
  return DEFAULTS[locale]
}
