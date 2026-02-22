import { Hono } from 'hono'
import { db } from '../../db/index.js'
import { sql } from 'drizzle-orm'

const app = new Hono()

app.get('/health', async (c) => {
  try {
    await db.execute(sql`SELECT 1`)
    return c.json({ status: 'ok' })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Database connection failed'
    return c.json({ status: 'error', error: message }, 503)
  }
})

export default app
