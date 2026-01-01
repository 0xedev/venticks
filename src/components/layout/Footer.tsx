export default function Footer() {
  return (
    <footer className="bg-navy-950 text-white mt-auto border-t border-navy-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4 text-white">🎫 Venticks</h3>
            <p className="text-navy-200 text-sm leading-relaxed">
              Nigeria's premier event ticketing platform. Secure, fast, and
              reliable.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-bold mb-4 text-white uppercase tracking-wider">
              Platform
            </h4>
            <ul className="space-y-2 text-sm text-navy-200">
              <li>
                <a
                  href="/events"
                  className="hover:text-accent-orange-400 transition-colors"
                >
                  Browse Events
                </a>
              </li>
              <li>
                <a
                  href="/my-tickets"
                  className="hover:text-accent-orange-400 transition-colors"
                >
                  My Tickets
                </a>
              </li>
              <li>
                <a
                  href="/dashboard"
                  className="hover:text-accent-orange-400 transition-colors"
                >
                  Organizer Dashboard
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-bold mb-4 text-white uppercase tracking-wider">
              Support
            </h4>
            <ul className="space-y-2 text-sm text-navy-200">
              <li>
                <a
                  href="#"
                  className="hover:text-accent-orange-400 transition-colors"
                >
                  Help Center
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-accent-orange-400 transition-colors"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-accent-orange-400 transition-colors"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-accent-orange-400 transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-bold mb-4 text-white uppercase tracking-wider">
              Payments
            </h4>
            <p className="text-navy-200 text-sm mb-3">We accept:</p>
            <div className="flex flex-wrap gap-2">
              <span className="bg-navy-800 text-navy-100 px-3 py-1 rounded text-xs font-medium border border-navy-700">
                Paystack
              </span>
              <span className="bg-navy-800 text-navy-100 px-3 py-1 rounded text-xs font-medium border border-navy-700">
                OPay
              </span>
              <span className="bg-navy-800 text-navy-100 px-3 py-1 rounded text-xs font-medium border border-navy-700">
                Bank Transfer
              </span>
              <span className="bg-navy-800 text-navy-100 px-3 py-1 rounded text-xs font-medium border border-navy-700">
                USSD
              </span>
            </div>
          </div>
        </div>
        <div className="border-t border-navy-800 mt-12 pt-8 text-center text-sm text-navy-400">
          <p>
            &copy; {new Date().getFullYear()} Venticks. All rights reserved. 🇳🇬
          </p>
        </div>
      </div>
    </footer>
  );
}
