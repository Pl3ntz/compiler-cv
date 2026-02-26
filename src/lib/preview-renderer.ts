import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import type { CvData } from '../types/cv.js'
import { getTemplate, isValidTemplateId, DEFAULT_TEMPLATE_ID, type TemplateId } from './templates.js'

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function renderHeader(header: CvData['header'], cssClass = '', sectionId = ''): string {
  const dataAttr = sectionId ? ` data-section="${escapeHtml(sectionId)}"` : ''
  const cls = cssClass ? ` ${cssClass}` : ''
  return `<header class="cv-header${cls}"${dataAttr}>
  <h1>${escapeHtml(header.name)}</h1>
  <div class="location">${escapeHtml(header.location)}</div>
  <div class="contacts">
    <span>${escapeHtml(header.phone)}</span>
    <span class="separator">|</span>
    <a href="mailto:${escapeHtml(header.email)}">${escapeHtml(header.email)}</a>
    <span class="separator">|</span>
    <a href="https://${escapeHtml(header.linkedin)}">${escapeHtml(header.linkedin)}</a>
    <span class="separator">|</span>
    <a href="https://${escapeHtml(header.github)}">${escapeHtml(header.github)}</a>
  </div>
</header>`
}

function renderSection(title: string, content: string, sectionId = '', cssClass = ''): string {
  const dataAttr = sectionId ? ` data-section="${escapeHtml(sectionId)}"` : ''
  const cls = cssClass ? ` ${cssClass}` : ''
  return `<section class="cv-section${cls}"${dataAttr}>
  <h2>${escapeHtml(title)}</h2>
  ${content}
</section>`
}

function renderSummary(summary: CvData['summary'], sectionId = '', cssClass = ''): string {
  return renderSection(
    summary.title,
    `<div class="cv-summary"><p>${escapeHtml(summary.text)}</p></div>`,
    sectionId,
    cssClass,
  )
}

function renderHighlights(highlights: readonly string[]): string {
  if (highlights.length === 0) return ''
  const items = highlights.map((h) => `<li>${escapeHtml(h)}</li>`).join('\n')
  return `<ul class="cv-highlights">${items}</ul>`
}

function renderEducation(education: CvData['education'], sectionId = '', cssClass = ''): string {
  const items = education.items
    .map(
      (item) => `<div class="cv-entry">
  <div class="cv-entry-header">
    <span class="primary">${escapeHtml(item.institution)}</span>
    <span class="secondary">${escapeHtml(item.date)}</span>
  </div>
  <div class="cv-entry-sub">
    <span class="role">${escapeHtml(item.degree)}</span>
    <span class="location">${escapeHtml(item.location)}</span>
  </div>
  ${renderHighlights(item.highlights)}
</div>`,
    )
    .join('\n')
  return renderSection(education.title, items, sectionId, cssClass)
}

function renderExperience(experience: CvData['experience'], sectionId = '', cssClass = ''): string {
  const items = experience.items
    .map(
      (item) => `<div class="cv-entry">
  <div class="cv-entry-header">
    <span class="primary">${escapeHtml(item.company)}</span>
    <span class="secondary">${escapeHtml(item.date)}</span>
  </div>
  <div class="cv-entry-sub">
    <span class="role">${escapeHtml(item.role)}</span>
    <span class="location">${escapeHtml(item.location)}</span>
  </div>
  ${renderHighlights(item.highlights)}
</div>`,
    )
    .join('\n')
  return renderSection(experience.title, items, sectionId, cssClass)
}

function renderProjects(projects: CvData['projects'], sectionId = '', cssClass = ''): string {
  const items = projects.items
    .map(
      (item) => `<div class="cv-entry">
  <div class="cv-project-header">
    <div>
      <span class="name">${escapeHtml(item.name)}</span>
      <span class="tech"> | ${escapeHtml(item.tech)}</span>
    </div>
    <span class="date">${escapeHtml(item.date)}</span>
  </div>
  ${renderHighlights(item.highlights)}
</div>`,
    )
    .join('\n')
  return renderSection(projects.title, items, sectionId, cssClass)
}

function renderSkills(skills: CvData['skills'], sectionId = '', cssClass = ''): string {
  const items = skills.categories
    .map(
      (cat) =>
        `<li><span class="category-name">${escapeHtml(cat.name)}</span>: ${escapeHtml(cat.values)}</li>`,
    )
    .join('\n')
  return renderSection(
    skills.title,
    `<ul class="cv-skills-list">${items}</ul>`,
    sectionId,
    cssClass,
  )
}

function renderLanguages(languages: CvData['languages'], sectionId = '', cssClass = ''): string {
  const items = languages.items
    .map(
      (lang) =>
        `<li><span class="lang-name">${escapeHtml(lang.name)}</span>: ${escapeHtml(lang.level)}</li>`,
    )
    .join('\n')
  return renderSection(
    languages.title,
    `<ul class="cv-languages-list">${items}</ul>`,
    sectionId,
    cssClass,
  )
}

const cssCache = new Map<string, string>()

function loadCss(templateId: TemplateId): string {
  const cached = cssCache.get(templateId)
  if (cached) return cached

  const config = getTemplate(templateId)
  const css = ['cv-reset.css', 'cv-layout.css', 'cv-typography.css', 'cv-components.css']
    .map((file) => readFileSync(resolve(process.cwd(), config.cssDir, file), 'utf-8'))
    .join('\n')

  cssCache.set(templateId, css)
  return css
}

function isSectionEmpty(key: string, cvData: CvData): boolean {
  switch (key) {
    case 'header': return !cvData.header.name
    case 'summary': return !cvData.summary.text
    case 'education': return cvData.education.items.length === 0
    case 'experience': return cvData.experience.items.length === 0
    case 'projects': return cvData.projects.items.length === 0
    case 'skills': return cvData.skills.categories.length === 0
    case 'languages': return cvData.languages.items.length === 0
    default: {
      const cs = cvData.customSections?.find(s => s.id === key)
      return !cs || cs.items.length === 0
    }
  }
}

const GHOST_CSS = `
.cv-sample-section { opacity: 0.3; transition: opacity 0.3s ease; }
.cv-user-section { opacity: 1; }
[data-section].cv-active-section {
  outline: 2px dashed #e87040;
  outline-offset: 4px;
  border-radius: 4px;
}
`

const GHOST_SCRIPT = `
<script>
window.addEventListener('message', function(e) {
  if (e.data && e.data.type === 'highlight-section') {
    document.querySelectorAll('[data-section]').forEach(function(el) {
      el.classList.remove('cv-active-section');
    });
    var t = document.querySelector('[data-section="' + e.data.section + '"]');
    if (t) {
      t.classList.add('cv-active-section');
      t.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }
});
</script>
`

export function renderGhostPreview(userData: CvData, sampleData: CvData): string {
  const templateId = isValidTemplateId(userData.meta.templateId)
    ? userData.meta.templateId
    : DEFAULT_TEMPLATE_ID
  const css = loadCss(templateId)

  const DEFAULT_ORDER = ['summary', 'education', 'experience', 'projects', 'skills', 'languages'] as const
  const order = userData.meta.sectionOrder ?? DEFAULT_ORDER

  const pick = (key: string) => {
    const empty = isSectionEmpty(key, userData)
    const source = empty ? sampleData : userData
    const cls = empty ? 'cv-sample-section' : 'cv-user-section'
    return { source, cls }
  }

  const headerPick = pick('header')
  const headerHtml = renderHeader(headerPick.source.header, headerPick.cls, 'header')

  const sectionHtml = order.map(k => {
    if (k.startsWith('custom-')) {
      const cs = userData.customSections?.find(s => s.id === k)
      if (!cs || cs.items.length === 0) return ''
      const items = cs.items.map(item => `<li>${escapeHtml(item.text)}</li>`).join('\n')
      return renderSection(cs.title, `<ul class="cv-highlights">${items}</ul>`, k, 'cv-user-section')
    }

    const { source, cls } = pick(k)

    const renderers: Record<string, () => string> = {
      summary: () => renderSummary(source.summary, k, cls),
      education: () => renderEducation(source.education, k, cls),
      experience: () => renderExperience(source.experience, k, cls),
      projects: () => renderProjects(source.projects, k, cls),
      skills: () => renderSkills(source.skills, k, cls),
      languages: () => renderLanguages(source.languages, k, cls),
    }

    return renderers[k]?.() ?? ''
  }).join('\n')

  const body = [headerHtml, sectionHtml].join('\n')

  return `<!doctype html>
<html lang="${escapeHtml(userData.meta.locale)}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>${css}${GHOST_CSS}</style>
</head>
<body>
  <main class="cv-page">
    ${body}
  </main>
${GHOST_SCRIPT}
</body>
</html>`
}

export function renderCvPreview(cvData: CvData): string {
  const templateId = isValidTemplateId(cvData.meta.templateId)
    ? cvData.meta.templateId
    : DEFAULT_TEMPLATE_ID
  const css = loadCss(templateId)

  const DEFAULT_ORDER = ['summary', 'education', 'experience', 'projects', 'skills', 'languages'] as const
  const order = cvData.meta.sectionOrder ?? DEFAULT_ORDER

  const renderCustomSection = (sectionId: string): string => {
    const cs = cvData.customSections?.find(s => s.id === sectionId)
    if (!cs || cs.items.length === 0) return ''
    const items = cs.items.map(item => `<li>${escapeHtml(item.text)}</li>`).join('\n')
    return renderSection(cs.title, `<ul class="cv-highlights">${items}</ul>`)
  }

  const renderers: Record<string, () => string> = {
    summary: () => cvData.summary.text ? renderSummary(cvData.summary) : '',
    education: () => cvData.education.items.length > 0 ? renderEducation(cvData.education) : '',
    experience: () => cvData.experience.items.length > 0 ? renderExperience(cvData.experience) : '',
    projects: () => cvData.projects.items.length > 0 ? renderProjects(cvData.projects) : '',
    skills: () => cvData.skills.categories.length > 0 ? renderSkills(cvData.skills) : '',
    languages: () => cvData.languages.items.length > 0 ? renderLanguages(cvData.languages) : '',
  }

  const body = [renderHeader(cvData.header), ...order.map(k => {
    if (k.startsWith('custom-')) return renderCustomSection(k)
    return renderers[k]?.() ?? ''
  })].join('\n')

  return `<!doctype html>
<html lang="${escapeHtml(cvData.meta.locale)}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>${css}</style>
</head>
<body>
  <main class="cv-page">
    ${body}
  </main>
</body>
</html>`
}
