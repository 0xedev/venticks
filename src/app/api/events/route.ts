import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import prisma from '@/lib/db/prisma'
import { authOptions } from '@/lib/auth'
import { generateSlug } from '@/lib/utils'
import { rateLimit } from '@/lib/rateLimit'

const createEventSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  date: z.string(),
  time: z.string(),
  capacity: z.number().min(1),
  categoryId: z.string(),
  venueId: z.string().optional(),
  images: z.array(z.string()).default([]),
  ticketTypes: z.array(
    z.object({
      name: z.string(),
      description: z.string().optional(),
      price: z.number().min(0),
      quantity: z.number().min(1),
      maxPerOrder: z.number().min(1).default(10),
    })
  ),
})

// GET /api/events - List events
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const status = searchParams.get('status') || 'APPROVED'
    const categoryId = searchParams.get('categoryId')
    const search = searchParams.get('search')

    const where: any = {}

    if (status) {
      where.status = status
    }

    if (categoryId) {
      where.categoryId = categoryId
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }

    // Only show future events by default
    where.date = { gte: new Date() }

    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where,
        include: {
          category: true,
          venue: true,
          organizer: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          ticketTypes: {
            select: {
              id: true,
              name: true,
              price: true,
              quantity: true,
              sold: true,
            },
          },
        },
        orderBy: {
          date: 'asc',
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.event.count({ where }),
    ])

    return NextResponse.json({
      events,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error: any) {
    console.error('Fetch events error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    )
  }
}

// POST /api/events - Create event
export async function POST(req: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitResponse = await rateLimit(req)
    if (rateLimitResponse) return rateLimitResponse

    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = (session.user as any).id
    const userRole = (session.user as any).role

    if (userRole !== 'ORGANIZER' && userRole !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Only organizers can create events' },
        { status: 403 }
      )
    }

    const body = await req.json()
    const data = createEventSchema.parse(body)

    // Generate slug from title
    const baseSlug = generateSlug(data.title)
    let slug = baseSlug
    let counter = 1

    // Ensure slug is unique
    while (await prisma.event.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`
      counter++
    }

    // Create event with ticket types
    const event = await prisma.event.create({
      data: {
        title: data.title,
        description: data.description,
        slug,
        date: new Date(data.date),
        time: data.time,
        capacity: data.capacity,
        images: data.images,
        organizerId: userId,
        categoryId: data.categoryId,
        venueId: data.venueId,
        status: userRole === 'ADMIN' ? 'APPROVED' : 'PENDING',
        ticketTypes: {
          create: data.ticketTypes,
        },
      },
      include: {
        category: true,
        venue: true,
        ticketTypes: true,
      },
    })

    return NextResponse.json({
      message: 'Event created successfully',
      event,
    })
  } catch (error: any) {
    console.error('Create event error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }

    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    )
  }
}
