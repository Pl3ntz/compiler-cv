/**
 * Extract the real client IP from the request.
 * Prefers X-Real-IP (set by nginx, cannot be spoofed) then falls back
 * to the first entry in X-Forwarded-For (original client).
 */
export function getClientIp(request: Request): string {
  const realIp = request.headers.get('x-real-ip')
  if (realIp) return realIp.trim()

  const xff = request.headers.get('x-forwarded-for')
  if (xff) {
    return xff.split(',')[0].trim()
  }

  return 'unknown'
}
