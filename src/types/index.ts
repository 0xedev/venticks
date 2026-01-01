export interface User {
  id: string
  email: string
  phone?: string
  name: string
  role: 'ATTENDEE' | 'ORGANIZER' | 'ADMIN'
}

export interface Event {
  id: string
  title: string
  description: string
  slug: string
  date: Date
  time: string
  capacity: number
  status: 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED'
  images: string[]
  organizerId: string
  categoryId: string
  venueId?: string
  createdAt: Date
  updatedAt: Date
}

export interface TicketType {
  id: string
  name: string
  description?: string
  price: number
  quantity: number
  sold: number
  maxPerOrder: number
  eventId: string
}

export interface Order {
  id: string
  totalAmount: number
  status: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED'
  paymentMethod?: string
  transactionRef?: string
  userId: string
  createdAt: Date
  updatedAt: Date
}

export interface Ticket {
  id: string
  qrCode: string
  status: 'VALID' | 'USED' | 'CANCELLED'
  ticketTypeId: string
  orderId: string
  userId: string
  createdAt: Date
  updatedAt: Date
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
}

export interface Venue {
  id: string
  name: string
  address: string
  city: string
  state: string
  capacity: number
  coordinates?: string
}
