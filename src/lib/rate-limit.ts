interface RateLimitEntry {
  readonly count: number
  readonly resetAt: number
}

interface RateLimitConfig {
  readonly windowMs: number
  readonly maxRequests: number
}

const store = new Map<string, RateLimitEntry>()

let cleanupTimer: ReturnType<typeof setInterval> | null = null

function startCleanup(): void {
  if (cleanupTimer) return
  cleanupTimer = setInterval(() => {
    const now = Date.now()
    for (const [key, entry] of store) {
      if (now > entry.resetAt) {
        store.delete(key)
      }
    }
  }, 60_000)
}

export function checkRateLimit(
  key: string,
  config: RateLimitConfig,
): { allowed: boolean; retryAfterMs: number } {
  startCleanup()

  const now = Date.now()
  const existing = store.get(key)

  if (!existing || now > existing.resetAt) {
    store.set(key, { count: 1, resetAt: now + config.windowMs })
    return { allowed: true, retryAfterMs: 0 }
  }

  if (existing.count >= config.maxRequests) {
    return { allowed: false, retryAfterMs: existing.resetAt - now }
  }

  store.set(key, { count: existing.count + 1, resetAt: existing.resetAt })
  return { allowed: true, retryAfterMs: 0 }
}

export function rateLimitResponse(retryAfterMs: number): Response {
  return new Response(
    JSON.stringify({ error: 'Muitas requisições' }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': String(Math.ceil(retryAfterMs / 1000)),
      },
    },
  )
}
