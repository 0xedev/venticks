import Link from 'next/link'
import { formatCurrency, formatDate } from '@/lib/utils'

interface EventCardProps {
  event: {
    id: string
    title: string
    slug: string
    date: Date | string
    time: string
    images: string[]
    category?: {
      name: string
    }
    venue?: {
      name: string
      city: string
    }
    ticketTypes?: Array<{
      price: number
      quantity: number
      sold: number
    }>
  }
}

export default function EventCard({ event }: EventCardProps) {
  const lowestPrice = event.ticketTypes?.length
    ? Math.min(...event.ticketTypes.map(t => Number(t.price)))
    : 0
  
  const availableTickets = event.ticketTypes?.reduce(
    (sum, t) => sum + (t.quantity - t.sold),
    0
  ) || 0

  const isSoldOut = availableTickets === 0

  return (
    <Link href={`/events/${event.slug}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group">
        <div className="relative h-48 bg-gradient-to-r from-primary-500 to-primary-700">
          {event.images && event.images[0] ? (
            <img
              src={event.images[0]}
              alt={event.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-white text-4xl">
              🎉
            </div>
          )}
          {isSoldOut && (
            <div className="absolute top-2 right-2 bg-accent-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-sm">
              Sold Out
            </div>
          )}
          {event.category && (
            <div className="absolute top-2 left-2 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-navy-900 shadow-sm">
              {event.category.name}
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-lg font-bold text-navy-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
            {event.title}
          </h3>
          <div className="space-y-2 text-sm text-gray-600 mb-4">
            <div className="flex items-center">
              <span className="mr-2">📅</span>
              <span>{formatDate(event.date)}</span>
            </div>
            <div className="flex items-center">
              <span className="mr-2">🕐</span>
              <span>{event.time}</span>
            </div>
            {event.venue && (
              <div className="flex items-center">
                <span className="mr-2">📍</span>
                <span>{event.venue.name}, {event.venue.city}</span>
              </div>
            )}
          </div>
          <div className="flex items-center justify-between border-t border-gray-100 pt-3">
            <div>
              <p className="text-xs text-gray-500">From</p>
              <p className="text-lg font-bold text-navy-700">
                {formatCurrency(lowestPrice)}
              </p>
            </div>
            <button className={`px-4 py-2 rounded-md text-sm font-bold transition-colors ${
              isSoldOut 
                ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
                : 'bg-accent-orange-500 text-white hover:bg-accent-orange-600 shadow-sm'
            }`}>
              {isSoldOut ? 'View Details' : 'Get Tickets'}
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}
