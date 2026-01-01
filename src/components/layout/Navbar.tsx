'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'

export default function Navbar() {
  const { data: session } = useSession()

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-navy-900">🎫 Venticks</span>
            </Link>
            <div className="hidden md:ml-10 md:flex md:space-x-8">
              <Link
                href="/events"
                className="text-navy-700 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                Events
              </Link>
              {session && (
                <Link
                  href="/my-tickets"
                  className="text-navy-700 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors"
                >
                  My Tickets
                </Link>
              )}
              {session && ['ORGANIZER', 'ADMIN'].includes((session.user as any)?.role) && (
                <Link
                  href="/dashboard"
                  className="text-navy-700 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors"
                >
                  Dashboard
                </Link>
              )}
            </div>
          </div>
          <div className="flex items-center">
            {session ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-navy-700 font-medium">{session.user?.name}</span>
                <button
                  onClick={() => signOut()}
                  className="bg-navy-100 text-navy-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-navy-200 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/login"
                  className="text-navy-700 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-accent-orange-500 text-white px-4 py-2 rounded-md text-sm font-bold hover:bg-accent-orange-600 transition-colors shadow-sm"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
