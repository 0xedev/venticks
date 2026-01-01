import { NextRequest, NextResponse } from 'next/server'
import { redis } from '@/lib/db/redis'

const RATE_LIMIT_WINDOW = 60 // 1 minute
const MAX_REQUESTS = 60 // 60 requests per minute

export async function rateLimit(req: NextRequest): Promise<NextResponse | null> {
  const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
  const key = `rate-limit:${ip}`

  try {
    const current = await redis.incr(key)
    
    if (current === 1) {
      await redis.expire(key, RATE_LIMIT_WINDOW)
    }

    if (current > MAX_REQUESTS) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    return null
  } catch (error) {
    console.error('Rate limit error:', error)
    return null // Allow request if Redis is down
  }
}
