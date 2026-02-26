import { Hono } from 'hono'
import { eq, sql, desc } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '../../db/index.js'
import { users, sessions } from '../../db/schema/users.js'
import { cvs } from '../../db/schema/cvs.js'
import { feedback } from '../../db/schema/feedback.js'

const app = new Hono()

// GET /stats — admin dashboard stats
app.get('/stats', async (c) => {
  try {
    const [userCount] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(users)

    const [cvCount] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(cvs)

    const [activeSessionCount] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(sessions)
      .where(sql`${sessions.expiresAt} > now()`)

    const [feedbackCount] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(feedback)

    const recentUsers = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        createdAt: users.createdAt,
      })
      .from(users)
      .orderBy(sql`${users.createdAt} desc`)
      .limit(10)

    return c.json({
      userCount: userCount.count,
      cvCount: cvCount.count,
      activeSessionCount: activeSessionCount.count,
      feedbackCount: feedbackCount.count,
      recentUsers,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Falha ao buscar estatísticas'
    return c.json({ error: message }, 500)
  }
})

// GET /users — list users with pagination
app.get('/users', async (c) => {
  try {
    const page = Math.max(1, parseInt(c.req.query('page') ?? '1', 10))
    const limit = Math.min(100, Math.max(1, parseInt(c.req.query('limit') ?? '20', 10)))
    const offset = (page - 1) * limit

    const [totalRow] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(users)

    const rows = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        emailVerified: users.emailVerified,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
        cvCount: sql<number>`(
          select count(*)::int from cvs where cvs.user_id = "users"."id"
        )`,
      })
      .from(users)
      .orderBy(desc(users.createdAt))
      .limit(limit)
      .offset(offset)

    return c.json({
      users: rows,
      meta: {
        total: totalRow.count,
        page,
        limit,
        totalPages: Math.ceil(totalRow.count / limit),
      },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Falha ao buscar usuários'
    return c.json({ error: message }, 500)
  }
})

// GET /users/:userId — user detail
app.get('/users/:userId', async (c) => {
  const userId = c.req.param('userId')

  try {
    const [user] = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        emailVerified: users.emailVerified,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1)

    if (!user) {
      return c.json({ error: 'Usuário não encontrado' }, 404)
    }

    const userCvs = await db
      .select({
        id: cvs.id,
        locale: cvs.locale,
        name: cvs.name,
        email: cvs.email,
        createdAt: cvs.createdAt,
        updatedAt: cvs.updatedAt,
      })
      .from(cvs)
      .where(eq(cvs.userId, userId))

    const activeSessions = await db
      .select({
        id: sessions.id,
        ipAddress: sessions.ipAddress,
        userAgent: sessions.userAgent,
        createdAt: sessions.createdAt,
        expiresAt: sessions.expiresAt,
      })
      .from(sessions)
      .where(eq(sessions.userId, userId))

    return c.json({ user, cvs: userCvs, sessions: activeSessions })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Falha ao buscar usuário'
    return c.json({ error: message }, 500)
  }
})

const updateUserSchema = z.object({
  role: z.enum(['user', 'admin']).optional(),
  name: z.string().min(1).optional(),
})

// PATCH /users/:userId — update user
app.patch('/users/:userId', async (c) => {
  const userId = c.req.param('userId')
  const currentUserId = c.get('user').id

  if (userId === currentUserId) {
    return c.json({ error: 'Não é possível alterar seu próprio papel de admin' }, 400)
  }

  let body: unknown
  try {
    body = await c.req.json()
  } catch {
    return c.json({ error: 'JSON inválido' }, 400)
  }

  const parsed = updateUserSchema.safeParse(body)
  if (!parsed.success) {
    return c.json({ error: 'Validação falhou', details: parsed.error.issues }, 400)
  }

  try {
    const [existing] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1)

    if (!existing) {
      return c.json({ error: 'Usuário não encontrado' }, 404)
    }

    const updates: Record<string, unknown> = { updatedAt: new Date() }
    if (parsed.data.role !== undefined) {
      updates.role = parsed.data.role
    }
    if (parsed.data.name !== undefined) {
      updates.name = parsed.data.name
    }

    await db.update(users).set(updates).where(eq(users.id, userId))

    return c.json({ success: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Falha ao atualizar usuário'
    return c.json({ error: message }, 500)
  }
})

// DELETE /users/:userId — delete user
app.delete('/users/:userId', async (c) => {
  const userId = c.req.param('userId')
  const currentUserId = c.get('user').id

  if (userId === currentUserId) {
    return c.json({ error: 'Não é possível excluir sua própria conta' }, 400)
  }

  try {
    const [existing] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1)

    if (!existing) {
      return c.json({ error: 'Usuário não encontrado' }, 404)
    }

    await db.delete(users).where(eq(users.id, userId))

    return c.json({ success: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Falha ao excluir usuário'
    return c.json({ error: message }, 500)
  }
})

// GET /feedback — list feedback with pagination and type filter
app.get('/feedback', async (c) => {
  try {
    const page = Math.max(1, parseInt(c.req.query('page') ?? '1', 10))
    const limit = Math.min(100, Math.max(1, parseInt(c.req.query('limit') ?? '20', 10)))
    const offset = (page - 1) * limit
    const typeFilter = c.req.query('type')

    const whereClause = typeFilter && (typeFilter === 'user' || typeFilter === 'recruiter')
      ? eq(feedback.type, typeFilter)
      : undefined

    const [totalRow] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(feedback)
      .where(whereClause)

    const rows = await db
      .select({
        id: feedback.id,
        type: feedback.type,
        rating: feedback.rating,
        message: feedback.message,
        contactEmail: feedback.contactEmail,
        createdAt: feedback.createdAt,
      })
      .from(feedback)
      .where(whereClause)
      .orderBy(desc(feedback.createdAt))
      .limit(limit)
      .offset(offset)

    const [avgRow] = await db
      .select({ avg: sql<number>`round(avg(${feedback.rating}), 1)` })
      .from(feedback)
      .where(whereClause)

    return c.json({
      feedback: rows,
      averageRating: avgRow.avg ?? 0,
      meta: {
        total: totalRow.count,
        page,
        limit,
        totalPages: Math.ceil(totalRow.count / limit),
      },
    })
  } catch (error) {
    console.error('[admin] Failed to list feedback:', error)
    return c.json({ error: 'Falha ao buscar feedbacks' }, 500)
  }
})

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

// DELETE /feedback/:id — delete feedback
app.delete('/feedback/:id', async (c) => {
  const id = c.req.param('id')

  if (!UUID_RE.test(id)) {
    return c.json({ error: 'ID invalido' }, 400)
  }

  try {
    const [existing] = await db
      .select({ id: feedback.id })
      .from(feedback)
      .where(eq(feedback.id, id))
      .limit(1)

    if (!existing) {
      return c.json({ error: 'Feedback nao encontrado' }, 404)
    }

    await db.delete(feedback).where(eq(feedback.id, id))

    return c.json({ success: true })
  } catch (error) {
    console.error('[admin] Failed to delete feedback:', error)
    return c.json({ error: 'Falha ao excluir feedback' }, 500)
  }
})

export default app
