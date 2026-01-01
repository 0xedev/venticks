import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import prisma from '@/lib/db/prisma'
import { authOptions } from '@/lib/auth'
import { OpayService } from '@/lib/payment/opay'
import { rateLimit } from '@/lib/rateLimit'

const initializePaymentSchema = z.object({
  orderId: z.string(),
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
    const userEmail = session.user.email!
    const userName = session.user.name!
    const body = await req.json()
    const data = initializePaymentSchema.parse(body)

    // Get order
    const order = await prisma.order.findUnique({
      where: { id: data.orderId },
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    if (order.userId !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    if (order.status !== 'PENDING') {
      return NextResponse.json(
        { error: 'Order already processed' },
        { status: 400 }
      )
    }

    // Initialize OPay payment
    const amount = Number(order.totalAmount)
    const callbackUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/opay`
    const returnUrl = `${process.env.NEXT_PUBLIC_APP_URL}/checkout/verify?reference=${order.transactionRef}`

    const response = await OpayService.initializePayment({
      reference: order.transactionRef!,
      amount,
      currency: 'NGN',
      country: 'NG',
      customerEmail: userEmail,
      customerName: userName,
      customerPhone: '',
      callbackUrl,
      returnUrl,
    })

    // Create transaction record
    await prisma.transaction.create({
      data: {
        orderId: order.id,
        amount: order.totalAmount,
        provider: 'OPAY',
        reference: order.transactionRef!,
        status: 'PENDING',
        metadata: {
          orderNo: response.data.orderNo,
        },
      },
    })

    return NextResponse.json({
      message: 'Payment initialized successfully',
      data: {
        cashierUrl: response.data.cashierUrl,
        reference: response.data.reference,
      },
    })
  } catch (error: any) {
    console.error('Initialize OPay payment error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }

    return NextResponse.json(
      { error: error.message || 'Failed to initialize OPay payment' },
      { status: 500 }
    )
  }
}
