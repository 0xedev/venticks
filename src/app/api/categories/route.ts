import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db/prisma'
import { redis } from '@/lib/db/redis'

export async function GET(req: NextRequest) {
  try {
    // Try to get from cache first
    const cacheKey = 'categories:all'
    const cached = await redis.get(cacheKey)

    if (cached) {
      return NextResponse.json({ categories: JSON.parse(cached) })
    }

    // Fetch from database
    const categories = await prisma.category.findMany({
      orderBy: {
        name: 'asc',
      },
    })

    // Cache for 1 hour
    await redis.setex(cacheKey, 3600, JSON.stringify(categories))

    return NextResponse.json({ categories })
  } catch (error: any) {
    console.error('Fetch categories error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}
