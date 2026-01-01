import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db/prisma'
import { OpayService } from '@/lib/payment/opay'

export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const signature = req.headers.get('signature')

    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
    }

    // Verify webhook signature
    const isValid = OpayService.verifyWebhookSignature(body, signature)

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    const event = JSON.parse(body)
    const { reference, status, orderNo } = event

    // Find order by transaction reference
    const order = await prisma.order.findUnique({
      where: { transactionRef: reference },
      include: { transactions: true },
    })

    if (!order) {
      console.error('Order not found for reference:', reference)
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    const transaction = order.transactions.find((t) => t.reference === reference)

    if (!transaction) {
      console.error('Transaction not found for reference:', reference)
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      )
    }

    // Update transaction and order based on status
    if (status === 'SUCCESS') {
      await prisma.$transaction([
        prisma.transaction.update({
          where: { id: transaction.id },
          data: {
            status: 'SUCCESS',
            metadata: event,
          },
        }),
        prisma.order.update({
          where: { id: order.id },
          data: {
            status: 'PAID',
            paymentMethod: 'OPAY',
          },
        }),
      ])
    } else if (status === 'FAIL') {
      await prisma.$transaction([
        prisma.transaction.update({
          where: { id: transaction.id },
          data: {
            status: 'FAILED',
            metadata: event,
          },
        }),
        prisma.order.update({
          where: { id: order.id },
          data: { status: 'FAILED' },
        }),
      ])
    }

    return NextResponse.json({ message: 'Webhook processed' })
  } catch (error: any) {
    console.error('OPay webhook error:', error)
    return NextResponse.json(
      { error: 'Failed to process webhook' },
      { status: 500 }
    )
  }
}
