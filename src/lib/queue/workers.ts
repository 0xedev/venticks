import { Queue, Worker, Job } from 'bullmq'
import Redis from 'ioredis'
import prisma from '@/lib/db/prisma'
import QRCode from 'qrcode'
import { PaystackService } from '@/lib/payment/paystack'
import { OpayService } from '@/lib/payment/opay'

const connection = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: null,
})

// Queue for processing ticket purchases
export const ticketPurchaseQueue = new Queue('ticket-purchase', {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
  },
})

interface TicketPurchaseJobData {
  orderId: string
  userId: string
  tickets: Array<{
    ticketTypeId: string
    quantity: number
  }>
}

interface PaymentVerificationJobData {
  orderId: string
  transactionId: string
  provider: 'PAYSTACK' | 'OPAY'
  reference: string
}

// Queue for payment verification
export const paymentVerificationQueue = new Queue('payment-verification', {
  connection,
  defaultJobOptions: {
    attempts: 5,
    backoff: {
      type: 'exponential',
      delay: 3000,
    },
  },
})

// Worker for processing ticket purchases
export const ticketPurchaseWorker = new Worker<TicketPurchaseJobData>(
  'ticket-purchase',
  async (job: Job<TicketPurchaseJobData>) => {
    const { orderId, userId, tickets } = job.data

    try {
      // Check ticket availability and create tickets
      const createdTickets = []

      for (const ticketRequest of tickets) {
        const ticketType = await prisma.ticketType.findUnique({
          where: { id: ticketRequest.ticketTypeId },
          include: { event: true },
        })

        if (!ticketType) {
          throw new Error(`Ticket type ${ticketRequest.ticketTypeId} not found`)
        }

        // Check availability with optimistic locking
        const available = ticketType.quantity - ticketType.sold
        if (available < ticketRequest.quantity) {
          throw new Error(`Insufficient tickets available for ${ticketType.name}`)
        }

        // Update sold count
        await prisma.ticketType.update({
          where: { id: ticketType.id },
          data: { sold: { increment: ticketRequest.quantity } },
        })

        // Create tickets with QR codes
        for (let i = 0; i < ticketRequest.quantity; i++) {
          const ticketId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
          const qrCode = await QRCode.toDataURL(ticketId)

          const ticket = await prisma.ticket.create({
            data: {
              qrCode: ticketId,
              userId,
              orderId,
              ticketTypeId: ticketType.id,
            },
          })

          createdTickets.push(ticket)
        }
      }

      return { success: true, ticketCount: createdTickets.length }
    } catch (error: any) {
      console.error('Ticket purchase job failed:', error)
      throw error
    }
  },
  { connection }
)

// Worker for payment verification
export const paymentVerificationWorker = new Worker<PaymentVerificationJobData>(
  'payment-verification',
  async (job: Job<PaymentVerificationJobData>) => {
    const { orderId, transactionId, provider, reference } = job.data

    try {
      let paymentStatus: 'SUCCESS' | 'PENDING' | 'FAILED' = 'PENDING'
      let amount = 0

      if (provider === 'PAYSTACK') {
        const verification = await PaystackService.verifyPayment(reference)
        paymentStatus = verification.data.status === 'success' ? 'SUCCESS' : 'FAILED'
        amount = verification.data.amount / 100 // Convert from kobo
      } else if (provider === 'OPAY') {
        const verification = await OpayService.verifyPayment({
          reference,
          orderNo: orderId,
        })
        paymentStatus = verification.data.status === 'SUCCESS' ? 'SUCCESS' : verification.data.status === 'FAIL' ? 'FAILED' : 'PENDING'
      }

      // Update transaction and order status
      await prisma.transaction.update({
        where: { id: transactionId },
        data: {
          status: paymentStatus,
        },
      })

      if (paymentStatus === 'SUCCESS') {
        await prisma.order.update({
          where: { id: orderId },
          data: { status: 'PAID' },
        })
      } else if (paymentStatus === 'FAILED') {
        await prisma.order.update({
          where: { id: orderId },
          data: { status: 'FAILED' },
        })
      }

      return { success: true, status: paymentStatus }
    } catch (error: any) {
      console.error('Payment verification job failed:', error)
      throw error
    }
  },
  { connection }
)

// Graceful shutdown
process.on('SIGTERM', async () => {
  await ticketPurchaseWorker.close()
  await paymentVerificationWorker.close()
})
