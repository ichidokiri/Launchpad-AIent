interface RateLimitInfo {
  count: number
  resetTime: number
  blocked: boolean
  blockExpires?: number
}

const rateLimit = new Map<string, RateLimitInfo>()

export function getRateLimitResult(ip: string) {
  const now = Date.now()
  const windowMs = 60000 // 1 minute
  const max = 60 // 60 requests per minute
  const blockDuration = 300000 // 5 minutes

  const current = rateLimit.get(ip) || { count: 0, resetTime: now + windowMs, blocked: false }

  // Check if IP is blocked
  if (current.blocked && current.blockExpires && now < current.blockExpires) {
    return {
      success: false,
      limit: max,
      remaining: 0,
      reset: current.blockExpires,
      blocked: true,
    }
  }

  // Unblock if block has expired
  if (current.blocked && current.blockExpires && now >= current.blockExpires) {
    current.blocked = false
    current.count = 0
  }

  // Reset if window has expired
  if (now > current.resetTime) {
    current.count = 0
    current.resetTime = now + windowMs
  }

  const remaining = Math.max(0, max - current.count)
  const success = current.count < max

  if (success) {
    current.count++

    // Block IP if too many consecutive windows are maxed out
    if (current.count >= max) {
      current.blocked = true
      current.blockExpires = now + blockDuration
    }

    rateLimit.set(ip, current)
  }

  return {
    success,
    limit: max,
    remaining,
    reset: current.resetTime,
    blocked: current.blocked,
  }
}

// Cleanup old entries periodically
setInterval(() => {
  const now = Date.now()
  for (const [ip, info] of rateLimit.entries()) {
    if (now > info.resetTime && (!info.blocked || (info.blockExpires && now > info.blockExpires))) {
      rateLimit.delete(ip)
    }
  }
}, 300000) // Clean up every 5 minutes

