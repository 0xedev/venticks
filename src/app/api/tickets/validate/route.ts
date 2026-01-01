import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import prisma from '@/lib/db/prisma'
import { authOptions } from '@/lib/auth'

const validateTicketSchema = z.object({
  qrCode: z.string(),
})

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userRole = (session.user as any).role

    // Only organizers and admins can validate tickets
    if (userRole !== 'ORGANIZER' && userRole !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Only organizers and admins can validate tickets' },
        { status: 403 }
      )
    }

    const body = await req.json()
    const data = validateTicketSchema.parse(body)

    const ticket = await prisma.ticket.findUnique({
      where: { qrCode: data.qrCode },
      include: {
        ticketType: {
          include: {
            event: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    if (!ticket) {
      return NextResponse.json(
        {
          valid: false,
          message: 'Invalid ticket',
        },
        { status: 404 }
      )
    }

    if (ticket.status === 'USED') {
      return NextResponse.json({
        valid: false,
        message: 'Ticket already used',
        ticket,
      })
    }

    if (ticket.status === 'CANCELLED') {
      return NextResponse.json({
        valid: false,
        message: 'Ticket cancelled',
        ticket,
      })
    }

    // Mark ticket as used
    await prisma.ticket.update({
      where: { id: ticket.id },
      data: { status: 'USED' },
    })

    return NextResponse.json({
      valid: true,
      message: 'Ticket valid and marked as used',
      ticket,
    })
  } catch (error: any) {
    console.error('Validate ticket error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }

    return NextResponse.json(
      { error: 'Failed to validate ticket' },
      { status: 500 }
    )
  }
}
