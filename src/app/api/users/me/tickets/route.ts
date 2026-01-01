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

    const tickets = await prisma.ticket.findMany({
      where: {
        userId,
        order: {
          status: 'PAID',
        },
      },
      include: {
        ticketType: {
          include: {
            event: {
              include: {
                venue: true,
                category: true,
              },
            },
          },
        },
        order: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({ tickets })
  } catch (error: any) {
    console.error('Fetch user tickets error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tickets' },
      { status: 500 }
    )
  }
}
