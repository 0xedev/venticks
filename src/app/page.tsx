import Link from 'next/link'
import EventCard from '@/components/ui/EventCard'

// Mock data for featured events to showcase the design
const FEATURED_EVENTS = [
  {
    id: '1',
    title: 'Lagos Jazz Festival 2026',
    slug: 'lagos-jazz-festival-2026',
    date: new Date('2026-04-15'),
    time: '18:00',
    images: ['https://images.unsplash.com/photo-1514525253440-b393452e8d26?auto=format&fit=crop&q=80'],
    category: { name: 'Music' },
    venue: { name: 'Eko Hotels & Suites', city: 'Lagos' },
    ticketTypes: [{ price: 15000, quantity: 1000, sold: 450 }]
  },
  {
    id: '2',
    title: 'TechConnect Nigeria Summit',
    slug: 'techconnect-nigeria-2026',
    date: new Date('2026-05-20'),
    time: '09:00',
    images: ['https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80'],
    category: { name: 'Conference' },
    venue: { name: 'Landmark Centre', city: 'Lagos' },
    ticketTypes: [{ price: 5000, quantity: 2000, sold: 1200 }]
  },
  {
    id: '3',
    title: 'Naija Comedy Night Live',
    slug: 'naija-comedy-night',
    date: new Date('2026-03-10'),
    time: '19:30',
    images: ['https://images.unsplash.com/photo-1585699324551-f6c309eedeca?auto=format&fit=crop&q=80'],
    category: { name: 'Comedy' },
    venue: { name: 'Muson Centre', city: 'Lagos' },
    ticketTypes: [{ price: 8000, quantity: 500, sold: 480 }]
  }
]

export default function Home() {
  return (
    <div className="min-h-screen bg-background-light">
      {/* Hero Section - Navy Background for Trust & Depth */}
      <section className="relative bg-navy-900 text-white overflow-hidden">
        {/* Abstract Background Pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0 100 C 20 0 50 0 100 100 Z" fill="currentColor" />
          </svg>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 md:pt-40 md:pb-28">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight mb-6">
              The Pulse of <br />
              <span className="text-primary-400">Nigeria's Events</span>
            </h1>
            <p className="text-xl md:text-2xl text-navy-100 mb-10 leading-relaxed max-w-2xl">
              Secure your spot at the biggest concerts, conferences, and festivals. 
              Experience the vibrant culture of Nigeria with <span className="font-semibold text-white">Venticks</span>.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/events"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold rounded-lg text-white bg-accent-orange-500 hover:bg-accent-orange-600 transition-all transform hover:-translate-y-1 shadow-lg hover:shadow-orange-500/25"
              >
                Explore Events
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold rounded-lg text-white border-2 border-navy-600 hover:bg-navy-800 hover:border-navy-500 transition-all"
              >
                List Your Event
              </Link>
            </div>
          </div>
        </div>
        
        {/* Trust Indicators Strip */}
        <div className="border-t border-navy-800 bg-navy-950/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-wrap justify-start gap-8 md:gap-16 text-navy-200 text-sm font-medium uppercase tracking-wider">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Verified Events
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Secure Payments
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Instant Delivery
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Events Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-navy-900 mb-2">Trending Now</h2>
              <p className="text-text-secondary text-lg">Don't miss out on these hot tickets.</p>
            </div>
            <Link href="/events" className="hidden md:flex items-center text-primary-600 font-semibold hover:text-primary-700">
              View all events <span className="ml-1">→</span>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {FEATURED_EVENTS.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
          
          <div className="mt-10 text-center md:hidden">
            <Link href="/events" className="inline-block text-primary-600 font-semibold hover:text-primary-700">
              View all events →
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section - Clean & Modern */}
      <section className="py-20 bg-background-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-navy-900 text-center mb-16">Find Your Vibe</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { name: 'Music', icon: '🎵', slug: 'concerts', color: 'bg-purple-100 text-purple-600' },
              { name: 'Business', icon: '💼', slug: 'conferences', color: 'bg-blue-100 text-blue-600' },
              { name: 'Sports', icon: '⚽', slug: 'sports', color: 'bg-green-100 text-green-600' },
              { name: 'Arts', icon: '🎭', slug: 'theatre', color: 'bg-pink-100 text-pink-600' },
              { name: 'Comedy', icon: '😂', slug: 'comedy-shows', color: 'bg-yellow-100 text-yellow-600' },
              { name: 'More', icon: '✨', slug: 'all', color: 'bg-gray-100 text-gray-600' },
            ].map((category) => (
              <Link
                key={category.slug}
                href={`/events?category=${category.slug}`}
                className="group flex flex-col items-center justify-center p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all hover:-translate-y-1 border border-gray-100"
              >
                <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl mb-4 ${category.color} group-hover:scale-110 transition-transform`}>
                  {category.icon}
                </div>
                <span className="font-semibold text-navy-800 group-hover:text-primary-600 transition-colors">{category.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Value Proposition - Professional Layout */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
            <div className="mb-12 lg:mb-0">
              <h2 className="text-3xl md:text-4xl font-bold text-navy-900 mb-6">
                Why Nigeria chooses <span className="text-primary-600">Venticks</span>
              </h2>
              <p className="text-lg text-text-secondary mb-8 leading-relaxed">
                We've built a platform that understands the unique needs of the Nigerian event space. 
                From local payment methods to reliable ticket validation, we've got you covered.
              </p>
              
              <div className="space-y-6">
                {[
                  { title: 'Local Payments', desc: 'Pay with Paystack, OPay, USSD, or Bank Transfer.' },
                  { title: 'Instant QR Tickets', desc: 'Receive your secure ticket immediately via email.' },
                  { title: '24/7 Support', desc: 'Our local team is always ready to help you.' }
                ].map((item, i) => (
                  <div key={i} className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary-100 flex items-center justify-center mt-1">
                      <svg className="h-4 w-4 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-navy-900">{item.title}</h3>
                      <p className="text-text-secondary">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary-100 to-accent-orange-100 rounded-2xl transform rotate-2 opacity-50"></div>
              <div className="relative bg-navy-900 rounded-2xl p-8 md:p-12 text-white shadow-2xl">
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-4">Organizing an Event?</h3>
                  <p className="text-navy-100 mb-8">
                    Join thousands of organizers who trust Venticks to sell out their events.
                  </p>
                  <Link
                    href="/register"
                    className="inline-block w-full bg-white text-navy-900 font-bold py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    Create Organizer Account
                  </Link>
                  <p className="mt-4 text-sm text-navy-300">No credit card required for signup</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Vibrant & Action Oriented */}
      <section className="py-20 bg-primary-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-navy-800"></div>
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Ready to experience the magic?
          </h2>
          <p className="text-xl text-primary-100 mb-10">
            Join the fastest growing event community in Nigeria.
          </p>
          <Link
            href="/register"
            className="inline-block bg-accent-yellow-400 text-navy-900 px-10 py-4 rounded-full text-lg font-bold hover:bg-accent-yellow-300 transition-transform hover:scale-105 shadow-lg"
          >
            Get Started Now
          </Link>
        </div>
      </section>
    </div>
  )
}
