import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import prisma from '@/lib/db/prisma'
import { authOptions } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = (session.user as any).id
    const userRole = (session.user as any).role

    if (userRole !== 'ORGANIZER' && userRole !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Only organizers can view their events' },
        { status: 403 }
      )
    }

    const events = await prisma.event.findMany({
      where: {
        organizerId: userId,
      },
      include: {
        category: true,
        venue: true,
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
        createdAt: 'desc',
      },
    })

    return NextResponse.json({ events })
  } catch (error: any) {
    console.error('Fetch user events error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    )
  }
}
