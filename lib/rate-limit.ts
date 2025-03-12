/**
 * Rate limiting utility for API routes
 * Prevents abuse by limiting the number of requests from a single IP
 */
import { type NextRequest, NextResponse } from "next/server"

// Configuration for rate limiting
const RATE_LIMIT_MAX = 100 // Maximum number of requests
const RATE_LIMIT_WINDOW = 60 * 1000 // Time window in milliseconds (1 minute)
const BLOCK_DURATION = 5 * 60 * 1000 // Block duration in milliseconds (5 minutes)
const BLOCK_THRESHOLD = 3 // Number of times to exceed rate limit before blocking

// Interface for rate limit information
interface RateLimitInfo {
  count: number
  resetTime: number
  blocked: boolean
  blockExpires?: number
  violations: number
}

// Store rate limit information in memory
// In production, consider using Redis or another distributed cache
const rateLimit = new Map<string, RateLimitInfo>()

/**
 * Get the client IP address from request headers
 * @param req The incoming request
 * @returns The client IP address or "unknown"
 */
function getClientIp(req: NextRequest): string {
  // Try to get IP from various headers
  const forwardedFor = req.headers.get("x-forwarded-for")
  if (forwardedFor) {
    // x-forwarded-for can contain multiple IPs, take the first one
    return forwardedFor.split(",")[0].trim()
  }

  const realIp = req.headers.get("x-real-ip")
  if (realIp) {
    return realIp
  }

  // If no IP found in headers, return unknown
  return "unknown"
}

/**
 * Rate limiting middleware for API routes
 * @param req The incoming request
 * @returns NextResponse if rate limit is exceeded, null otherwise
 */
export function rateLimiter(req: NextRequest): NextResponse | null {
  // Get client IP
  const ip = getClientIp(req)
  const now = Date.now()

  // Get or initialize rate limit info for this IP
  let info = rateLimit.get(ip)

  if (!info) {
    info = {
      count: 0,
      resetTime: now + RATE_LIMIT_WINDOW,
      blocked: false,
      violations: 0,
    }
    rateLimit.set(ip, info)
  }

  // Check if IP is blocked
  if (info.blocked) {
    if (info.blockExpires && now > info.blockExpires) {
      // Block has expired, reset
      info.blocked = false
      info.violations = 0
      info.count = 1
      info.resetTime = now + RATE_LIMIT_WINDOW
      rateLimit.set(ip, info)
      return null
    }

    // IP is blocked
    return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429, headers: { "Retry-After": "300" } },
    )
  }

  // Reset count if window has passed
  if (now > info.resetTime) {
    info.count = 0
    info.resetTime = now + RATE_LIMIT_WINDOW
  }

  // Increment request count
  info.count++

  // Check if rate limit is exceeded
  if (info.count > RATE_LIMIT_MAX) {
    info.violations++

    // Block IP if violations exceed threshold
    if (info.violations >= BLOCK_THRESHOLD) {
      info.blocked = true
      info.blockExpires = now + BLOCK_DURATION
      rateLimit.set(ip, info)

      return NextResponse.json(
          { error: "Too many requests. Please try again later." },
          { status: 429, headers: { "Retry-After": "300" } },
      )
    }

    // Reset for next window
    info.count = 1
    info.resetTime = now + RATE_LIMIT_WINDOW
    rateLimit.set(ip, info)

    return NextResponse.json(
        { error: "Rate limit exceeded. Please try again later." },
        { status: 429, headers: { "Retry-After": "60" } },
    )
  }

  // Update rate limit info
  rateLimit.set(ip, info)
  return null
}

// Clean up expired rate limits every minute
setInterval(() => {
  const now = Date.now()

  // Use forEach instead of for...of with entries()
  rateLimit.forEach((info, ip) => {
    if (now > info.resetTime && (!info.blocked || (info.blockExpires && now > info.blockExpires))) {
      rateLimit.delete(ip)
    }
  })
}, 60 * 1000)

