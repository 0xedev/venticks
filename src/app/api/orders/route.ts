import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import prisma from '@/lib/db/prisma'
import { authOptions } from '@/lib/auth'
import { generateReference } from '@/lib/utils'
import { ticketPurchaseQueue } from '@/lib/queue/workers'
import { rateLimit } from '@/lib/rateLimit'

const createOrderSchema = z.object({
  tickets: z.array(
    z.object({
      ticketTypeId: z.string(),
      quantity: z.number().min(1),
    })
  ),
})

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
    const body = await req.json()
    const data = createOrderSchema.parse(body)

    // Calculate total amount and validate tickets
    let totalAmount = 0
    const ticketDetails = []

    for (const ticketRequest of data.tickets) {
      const ticketType = await prisma.ticketType.findUnique({
        where: { id: ticketRequest.ticketTypeId },
      })

      if (!ticketType) {
        return NextResponse.json(
          { error: `Ticket type ${ticketRequest.ticketTypeId} not found` },
          { status: 404 }
        )
      }

      // Check availability
      const available = ticketType.quantity - ticketType.sold
      if (available < ticketRequest.quantity) {
        return NextResponse.json(
          { error: `Only ${available} tickets available for ${ticketType.name}` },
          { status: 400 }
        )
      }

      // Check max per order
      if (ticketRequest.quantity > ticketType.maxPerOrder) {
        return NextResponse.json(
          { error: `Maximum ${ticketType.maxPerOrder} tickets per order for ${ticketType.name}` },
          { status: 400 }
        )
      }

      totalAmount += Number(ticketType.price) * ticketRequest.quantity
      ticketDetails.push({
        ticketTypeId: ticketType.id,
        quantity: ticketRequest.quantity,
        price: ticketType.price,
      })
    }

    // Create order
    const transactionRef = generateReference()
    const order = await prisma.order.create({
      data: {
        userId,
        totalAmount,
        transactionRef,
        status: 'PENDING',
      },
    })

    // Add to queue for processing (will create tickets after payment)
    await ticketPurchaseQueue.add('process-ticket-purchase', {
      orderId: order.id,
      userId,
      tickets: data.tickets,
    })

    return NextResponse.json({
      message: 'Order created successfully',
      order: {
        id: order.id,
        totalAmount: order.totalAmount,
        transactionRef: order.transactionRef,
        status: order.status,
      },
    })
  } catch (error: any) {
    console.error('Create order error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }

    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}
