export function formatCurrency(amount: number): string {
  return `₦${amount.toLocaleString('en-NG', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

export function formatDate(date: Date | string): string {
  const d = new Date(date)
  return d.toLocaleDateString('en-NG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function formatTime(time: string): string {
  return time
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function generateReference(): string {
  return `VNT-${Date.now()}-${Math.random().toString(36).substring(2, 11).toUpperCase()}`
}

export function getWATTime(): Date {
  // West Africa Time is UTC+1
  const now = new Date()
  const utcTime = now.getTime() + now.getTimezoneOffset() * 60000
  return new Date(utcTime + 3600000) // Add 1 hour for WAT
}

export function parseError(error: any): string {
  if (typeof error === 'string') return error
  if (error?.message) return error.message
  if (error?.error) return error.error
  return 'An unexpected error occurred'
}
