import Link from 'next/link'

export default function Home() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Discover Amazing Events in Nigeria
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100">
              Book tickets for concerts, conferences, sports, and more
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/events"
                className="bg-white text-primary-600 px-8 py-3 rounded-md text-lg font-semibold hover:bg-primary-50 transition-colors"
              >
                Browse Events
              </Link>
              <Link
                href="/register"
                className="bg-primary-800 text-white px-8 py-3 rounded-md text-lg font-semibold hover:bg-primary-900 transition-colors"
              >
                Create Event
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Venticks?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">🎉</div>
              <h3 className="text-xl font-semibold mb-2">Wide Event Selection</h3>
              <p className="text-gray-600">
                From concerts to conferences, find events that match your interests
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">💳</div>
              <h3 className="text-xl font-semibold mb-2">Local Payment Methods</h3>
              <p className="text-gray-600">
                Pay with Paystack, OPay, Bank Transfer, or USSD
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">🎟️</div>
              <h3 className="text-xl font-semibold mb-2">QR Code Tickets</h3>
              <p className="text-gray-600">
                Get instant digital tickets with secure QR codes
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">🌍</div>
              <h3 className="text-xl font-semibold mb-2">Multi-Language</h3>
              <p className="text-gray-600">
                Available in English, Pidgin, Yoruba, Hausa, and Igbo
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">⏰</div>
              <h3 className="text-xl font-semibold mb-2">WAT Timezone</h3>
              <p className="text-gray-600">
                All times in West Africa Time for your convenience
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-xl font-semibold mb-2">Fast & Reliable</h3>
              <p className="text-gray-600">
                Built to handle millions of users with ease
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Event Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { name: 'Concerts', icon: '🎵', slug: 'concerts' },
              { name: 'Conferences', icon: '💼', slug: 'conferences' },
              { name: 'Parties', icon: '🎊', slug: 'parties' },
              { name: 'Sports', icon: '⚽', slug: 'sports' },
              { name: 'Religious', icon: '⛪', slug: 'religious-events' },
              { name: 'Comedy', icon: '😂', slug: 'comedy-shows' },
              { name: 'Theatre', icon: '🎭', slug: 'theatre' },
              { name: 'Festivals', icon: '🎪', slug: 'festivals' },
              { name: 'Workshops', icon: '📚', slug: 'workshops' },
              { name: 'Exhibitions', icon: '🖼️', slug: 'exhibitions' },
            ].map((category) => (
              <Link
                key={category.slug}
                href={`/events?category=${category.slug}`}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center"
              >
                <div className="text-4xl mb-2">{category.icon}</div>
                <div className="font-semibold text-gray-800">{category.name}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 text-primary-100">
            Create your account and start booking tickets today
          </p>
          <Link
            href="/register"
            className="inline-block bg-white text-primary-600 px-8 py-3 rounded-md text-lg font-semibold hover:bg-primary-50 transition-colors"
          >
            Sign Up Now
          </Link>
        </div>
      </section>
    </div>
  )
}
