import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { parse } from 'yaml'
import { eq } from 'drizzle-orm'
import { db } from '../src/db/index.js'
import {
  cvs,
  cvEducationItems,
  cvExperienceItems,
  cvProjectItems,
  cvSkillCategories,
  cvLanguageItems,
} from '../src/db/schema/index.js'
import { users } from '../src/db/schema/users.js'
import { auth } from '../src/lib/auth.js'
import type { CvData } from '../src/types/cv.js'
import { LOCALES } from '../src/lib/locales.js'

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? ''
const ADMIN_SEED_PASSWORD = process.env.ADMIN_SEED_PASSWORD ?? ''
const SEED_DEMO = process.env.SEED_DEMO === 'true'
const DEMO_EMAIL = process.env.DEMO_EMAIL ?? 'demo@cvbuilder.local'
const DEMO_PASSWORD = process.env.DEMO_PASSWORD ?? 'demo12341234'

const MIN_PASSWORD_LENGTH = 12

async function createUser(
  email: string,
  password: string,
  name: string,
  role: 'admin' | 'user',
): Promise<string | null> {
  if (!email || !password) {
    return null
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    console.error(`[seed] Password for ${email} must be at least ${MIN_PASSWORD_LENGTH} characters`)
    return null
  }

  try {
    const ctx = await auth.api.signUpEmail({
      body: { email, password, name },
    })
    const userId = ctx.user.id
    console.log(`[seed] Created user: ${email} (role: ${role})`)

    if (role === 'admin') {
      await db
        .update(users)
        .set({ role: 'admin' })
        .where(eq(users.id, userId))
      console.log(`[seed] Promoted ${email} to admin`)
    }

    return userId
  } catch {
    console.log(`[seed] User ${email} may already exist, looking up...`)
    const rows = await db
      .select({ id: users.id, role: users.role })
      .from(users)
      .where(eq(users.email, email))
      .limit(1)

    if (rows.length === 0) {
      console.error(`[seed] Could not create or find user: ${email}`)
      return null
    }

    const existing = rows[0]

    if (role === 'admin' && existing.role !== 'admin') {
      await db
        .update(users)
        .set({ role: 'admin' })
        .where(eq(users.id, existing.id))
      console.log(`[seed] Promoted existing user ${email} to admin`)
    } else {
      console.log(`[seed] Found existing user: ${email} (role: ${existing.role})`)
    }

    return existing.id
  }
}

async function seedCvData(userId: string): Promise<void> {
  for (const locale of LOCALES) {
    console.log(`[seed] Seeding CV for locale: ${locale}...`)

    const filePath = resolve(process.cwd(), `data/cv.${locale}.yaml`)
    const raw = readFileSync(filePath, 'utf-8')
    const cv: CvData = parse(raw)

    const [inserted] = await db
      .insert(cvs)
      .values({
        userId,
        locale,
        pdfFilename: cv.meta.pdfFilename,
        name: cv.header.name,
        location: cv.header.location,
        phone: cv.header.phone,
        email: cv.header.email,
        linkedin: cv.header.linkedin,
        github: cv.header.github,
        summaryTitle: cv.summary.title,
        summaryText: cv.summary.text,
        educationTitle: cv.education.title,
        experienceTitle: cv.experience.title,
        projectsTitle: cv.projects.title,
        skillsTitle: cv.skills.title,
        languagesTitle: cv.languages.title,
      })
      .onConflictDoNothing()
      .returning({ id: cvs.id })

    if (!inserted) {
      console.log(`[seed] CV for ${locale} already exists, skipping.`)
      continue
    }

    const cvId = inserted.id

    if (cv.education.items.length > 0) {
      await db.insert(cvEducationItems).values(
        cv.education.items.map((item, i) => ({
          cvId,
          orderIndex: i,
          institution: item.institution,
          degree: item.degree,
          date: item.date,
          location: item.location,
          highlights: [...item.highlights],
        })),
      )
    }

    if (cv.experience.items.length > 0) {
      await db.insert(cvExperienceItems).values(
        cv.experience.items.map((item, i) => ({
          cvId,
          orderIndex: i,
          company: item.company,
          role: item.role,
          date: item.date,
          location: item.location,
          highlights: [...item.highlights],
        })),
      )
    }

    if (cv.projects.items.length > 0) {
      await db.insert(cvProjectItems).values(
        cv.projects.items.map((item, i) => ({
          cvId,
          orderIndex: i,
          name: item.name,
          tech: item.tech,
          date: item.date,
          highlights: [...item.highlights],
        })),
      )
    }

    if (cv.skills.categories.length > 0) {
      await db.insert(cvSkillCategories).values(
        cv.skills.categories.map((cat, i) => ({
          cvId,
          orderIndex: i,
          name: cat.name,
          values: cat.values,
        })),
      )
    }

    if (cv.languages.items.length > 0) {
      await db.insert(cvLanguageItems).values(
        cv.languages.items.map((lang, i) => ({
          cvId,
          orderIndex: i,
          name: lang.name,
          level: lang.level,
        })),
      )
    }

    console.log(`[seed] CV ${locale} seeded successfully (id: ${cvId})`)
  }
}

async function seed() {
  // 1. Create admin user (always, if env vars are set)
  if (ADMIN_EMAIL && ADMIN_SEED_PASSWORD) {
    console.log('[seed] Creating admin user...')
    await createUser(ADMIN_EMAIL, ADMIN_SEED_PASSWORD, 'Admin', 'admin')
  } else {
    console.log('[seed] ADMIN_EMAIL or ADMIN_SEED_PASSWORD not set, skipping admin creation')
  }

  // 2. Create demo user with sample CV data (only if SEED_DEMO=true)
  if (SEED_DEMO) {
    console.log('[seed] Creating demo user (SEED_DEMO=true)...')
    const demoUserId = await createUser(DEMO_EMAIL, DEMO_PASSWORD, 'Demo User', 'user')

    if (demoUserId) {
      await seedCvData(demoUserId)
    }
  } else {
    console.log('[seed] SEED_DEMO not enabled, skipping demo user')
  }

  console.log('[seed] Done!')
  process.exit(0)
}

seed().catch((err) => {
  console.error('[seed] Error:', err)
  process.exit(1)
})
