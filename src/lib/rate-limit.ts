import { NextApiRequest, NextApiResponse } from 'next'
import { ApiError } from './errors'

const REQUESTS_PER_MINUTE = 60

interface RateLimitStore {
  [key: string]: {
    count: number
    resetAt: number
  }
}

// In-memory store for rate limiting
// In production, use Redis or similar for distributed rate limiting
const store: RateLimitStore = {}

export function withRateLimit(handler: Function) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown'
    const now = Date.now()
    const windowMs = 60 * 1000 // 1 minute

    // Get or create rate limit data for this IP
    const rateLimitData = store[ip as string] || {
      count: 0,
      resetAt: now + windowMs,
    }

    // Reset count if the window has expired
    if (now > rateLimitData.resetAt) {
      rateLimitData.count = 0
      rateLimitData.resetAt = now + windowMs
    }

    // Check rate limit
    if (rateLimitData.count >= REQUESTS_PER_MINUTE) {
      const secondsToReset = Math.ceil((rateLimitData.resetAt - now) / 1000)
      
      res.setHeader('X-RateLimit-Limit', REQUESTS_PER_MINUTE)
      res.setHeader('X-RateLimit-Remaining', 0)
      res.setHeader('X-RateLimit-Reset', secondsToReset)
      
      throw new ApiError(429, `Too many requests. Please try again in ${secondsToReset} seconds.`)
    }

    // Increment request count
    rateLimitData.count++
    store[ip as string] = rateLimitData

    // Set rate limit headers
    res.setHeader('X-RateLimit-Limit', REQUESTS_PER_MINUTE)
    res.setHeader('X-RateLimit-Remaining', REQUESTS_PER_MINUTE - rateLimitData.count)
    res.setHeader('X-RateLimit-Reset', Math.ceil((rateLimitData.resetAt - now) / 1000))

    return handler(req, res)
  }
}