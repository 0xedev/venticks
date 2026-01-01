import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Venticks - Nigerian Event Ticketing Platform',
  description: 'Book tickets for concerts, conferences, sports, and more in Nigeria',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
