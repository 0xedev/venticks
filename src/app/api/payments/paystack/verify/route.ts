import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import prisma from '@/lib/db/prisma'
import { authOptions } from '@/lib/auth'
import { PaystackService } from '@/lib/payment/paystack'
import { paymentVerificationQueue } from '@/lib/queue/workers'

const verifyPaymentSchema = z.object({
  reference: z.string(),
})

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const data = verifyPaymentSchema.parse(body)

    // Verify payment with Paystack
    const verification = await PaystackService.verifyPayment(data.reference)

    if (!verification.status) {
      return NextResponse.json(
        { error: 'Payment verification failed' },
        { status: 400 }
      )
    }

    // Get order and transaction
    const order = await prisma.order.findUnique({
      where: { transactionRef: data.reference },
      include: {
        transactions: true,
      },
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    const transaction = order.transactions[0]

    if (verification.data.status === 'success') {
      // Update transaction and order
      await prisma.$transaction([
        prisma.transaction.update({
          where: { id: transaction.id },
          data: {
            status: 'SUCCESS',
            metadata: verification.data,
          },
        }),
        prisma.order.update({
          where: { id: order.id },
          data: {
            status: 'PAID',
            paymentMethod: 'PAYSTACK',
          },
        }),
      ])

      return NextResponse.json({
        message: 'Payment verified successfully',
        status: 'success',
        order: {
          id: order.id,
          status: 'PAID',
        },
      })
    } else {
      // Payment failed
      await prisma.$transaction([
        prisma.transaction.update({
          where: { id: transaction.id },
          data: {
            status: 'FAILED',
            metadata: verification.data,
          },
        }),
        prisma.order.update({
          where: { id: order.id },
          data: { status: 'FAILED' },
        }),
      ])

      return NextResponse.json(
        {
          message: 'Payment failed',
          status: 'failed',
        },
        { status: 400 }
      )
    }
  } catch (error: any) {
    console.error('Verify Paystack payment error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }

    return NextResponse.json(
      { error: error.message || 'Failed to verify payment' },
      { status: 500 }
    )
  }
}
