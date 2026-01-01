export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">🎫 Venticks</h3>
            <p className="text-gray-400 text-sm">
              Nigeria's premier event ticketing platform
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-4">Platform</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="/events" className="hover:text-white">Browse Events</a></li>
              <li><a href="/my-tickets" className="hover:text-white">My Tickets</a></li>
              <li><a href="/dashboard" className="hover:text-white">Organizer Dashboard</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white">Help Center</a></li>
              <li><a href="#" className="hover:text-white">Contact Us</a></li>
              <li><a href="#" className="hover:text-white">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-4">Payments</h4>
            <p className="text-gray-400 text-sm mb-2">We accept:</p>
            <div className="flex flex-wrap gap-2">
              <span className="bg-gray-800 px-3 py-1 rounded text-xs">Paystack</span>
              <span className="bg-gray-800 px-3 py-1 rounded text-xs">OPay</span>
              <span className="bg-gray-800 px-3 py-1 rounded text-xs">Bank Transfer</span>
              <span className="bg-gray-800 px-3 py-1 rounded text-xs">USSD</span>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} Venticks. All rights reserved. 🇳🇬</p>
        </div>
      </div>
    </footer>
  )
}
