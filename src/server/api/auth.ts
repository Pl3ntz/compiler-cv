import { Hono } from 'hono'
import { auth } from '../../lib/auth.js'

const app = new Hono()

app.all('/*', (c) => auth.handler(c.req.raw))

export default app
