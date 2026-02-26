import { Hono } from 'hono'
import { z } from 'zod'
import { db } from '../../db/index.js'
import { feedback } from '../../db/schema/feedback.js'
import { checkRateLimit, rateLimitResponse } from '../../lib/rate-limit.js'
import { getClientIp } from '../../lib/request-utils.js'

const app = new Hono()

const feedbackSchema = z.object({
  type: z.enum(['user', 'recruiter']),
  rating: z.number().int().min(1).max(5),
  message: z.string().max(2000).default(''),
  contactEmail: z.string().email().optional().or(z.literal('')),
})

// POST / — submit feedback (public, no auth)
app.post('/', async (c) => {
  const ip = getClientIp(c.req.raw)

  // Rate limit: 3 per hour per IP
  const rlResult = checkRateLimit(`feedback:${ip}`, {
    windowMs: 3_600_000,
    maxRequests: 3,
  })
  if (!rlResult.allowed) {
    return rateLimitResponse(rlResult.retryAfterMs)
  }

  let body: unknown
  try {
    body = await c.req.json()
  } catch {
    return c.json({ error: 'JSON invalido' }, 400)
  }

  const parsed = feedbackSchema.safeParse(body)
  if (!parsed.success) {
    return c.json({ error: 'Validacao falhou' }, 400)
  }

  try {
    const [row] = await db
      .insert(feedback)
      .values({
        type: parsed.data.type,
        rating: parsed.data.rating,
        message: parsed.data.message,
        contactEmail: parsed.data.contactEmail || null,
        ipAddress: ip,
      })
      .returning({ id: feedback.id })

    return c.json({ id: row.id }, 201)
  } catch (error) {
    console.error('[feedback] Insert failed:', error)
    return c.json({ error: 'Falha ao salvar feedback' }, 500)
  }
})

export default app
