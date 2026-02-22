import { Hono } from 'hono'
import { eq, and, asc } from 'drizzle-orm'
import { db } from '../../db/index.js'
import {
  cvs,
  cvEducationItems,
  cvExperienceItems,
  cvProjectItems,
  cvSkillCategories,
  cvLanguageItems,
} from '../../db/schema/index.js'
import { cvRowsToCvData } from '../../lib/cv-to-data.js'
import { renderCvPreview } from '../../lib/preview-renderer.js'
import { isValidUuid } from '../../lib/validation.js'

const app = new Hono()

app.get('/:userId/:cvId', async (c) => {
  const userId = c.req.param('userId')
  const cvId = c.req.param('cvId')

  if (!userId || !cvId || !isValidUuid(cvId)) {
    return c.text('CV not found', 404)
  }

  const [cv] = await db
    .select()
    .from(cvs)
    .where(and(eq(cvs.id, cvId), eq(cvs.userId, userId)))
    .limit(1)

  if (!cv) {
    return c.text('CV not found', 404)
  }

  const [education, experience, projects, skills, languages] = await Promise.all([
    db.select().from(cvEducationItems).where(eq(cvEducationItems.cvId, cv.id)).orderBy(asc(cvEducationItems.orderIndex)),
    db.select().from(cvExperienceItems).where(eq(cvExperienceItems.cvId, cv.id)).orderBy(asc(cvExperienceItems.orderIndex)),
    db.select().from(cvProjectItems).where(eq(cvProjectItems.cvId, cv.id)).orderBy(asc(cvProjectItems.orderIndex)),
    db.select().from(cvSkillCategories).where(eq(cvSkillCategories.cvId, cv.id)).orderBy(asc(cvSkillCategories.orderIndex)),
    db.select().from(cvLanguageItems).where(eq(cvLanguageItems.cvId, cv.id)).orderBy(asc(cvLanguageItems.orderIndex)),
  ])

  const cvData = cvRowsToCvData(cv, education, experience, projects, skills, languages)

  const pageTitle = cvData.header.name
    ? `${cvData.header.name} - CV`
    : 'CV'

  const previewHtml = renderCvPreview(cvData)

  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="CV - ${escapeHtml(cvData.header.name)}" />
    <meta property="og:title" content="${escapeHtml(pageTitle)}" />
    <meta property="og:description" content="CV - ${escapeHtml(cvData.header.name)}" />
    <meta property="og:type" content="website" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <title>${escapeHtml(pageTitle)}</title>
  </head>
  <body>
    <main class="cv-page">
      ${previewHtml}
    </main>
  </body>
</html>`

  return c.html(html)
})

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export default app
