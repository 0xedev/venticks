# Venticks 🎫

Nigerian Event Ticketing Platform

## Overview

Venticks is a high-traffic event ticketing platform designed specifically for the Nigerian market, supporting local payment methods like Paystack, OPay, bank transfers, and USSD. Built to handle 10+ million users with Redis caching, BullMQ job queues, and optimistic locking for concurrent ticket purchases.

## Features

- 🎉 **Event Management System**
  - Event creation and submission by organizers
  - Event categories (concerts, conferences, parties, sports, religious events)
  - Admin approval workflow
  - Venue management with capacity limits
  - Event images and media upload
  - Event scheduling with date/time

- 🎟️ **Ticketing System**
  - Multiple ticket types per event (Regular, VIP, VVIP, etc.)
  - Ticket quantity management and inventory control
  - QR code generation for tickets
  - Ticket validation system (works offline)
  - Queue/locking mechanism to prevent overselling

- 💳 **Payment Integration (Nigerian Methods)**
  - **Paystack** (Primary) - Cards, Bank Transfer, USSD, Mobile Money
  - **OPay** integration - OPay wallet, Bank Transfer
  - Naira (₦) currency support
  - Payment verification via webhooks
  - Transaction history and receipts
  - Refund handling

- 🌍 **Localization & Timezone**
  - Auto-detect user timezone with WAT (West Africa Time) default
  - Multi-language support:
    - English (primary)
    - Nigerian Pidgin
    - Yoruba
    - Hausa
    - Igbo
  - Proper Naira currency formatting (₦)

- 🚀 **Scalability (10M+ Traffic)**
  - Redis caching layer for hot data
  - Database optimization with indexing
  - BullMQ job queues for ticket purchases
  - Rate limiting to prevent abuse
  - Connection pooling
  - Optimistic locking for concurrent purchases

- 📱 **Nigerian Market Optimizations**
  - SMS notifications (Termii integration ready)
  - Mobile-first responsive design
  - Progressive Web App (PWA) ready
  - Low bandwidth mode support
  - Graceful handling of poor network connectivity

## Tech Stack

### Frontend
- **Next.js 14+** with App Router
- **TypeScript**
- **Tailwind CSS** for styling
- **React Query** for data fetching
- **i18next** for internationalization

### Backend
- **Next.js API Routes**
- **TypeScript**
- **Prisma ORM** for database
- **PostgreSQL** database
- **Redis** for caching and sessions
- **BullMQ** for job queues

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Docker and Docker Compose (for PostgreSQL and Redis)
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/0xedev/venticks.git
cd venticks
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```

Edit `.env` file with your configuration:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/venticks
REDIS_URL=redis://localhost:6379

# Paystack
PAYSTACK_SECRET_KEY=sk_test_xxx
PAYSTACK_PUBLIC_KEY=pk_test_xxx

# OPay
OPAY_MERCHANT_ID=xxx
OPAY_SECRET_KEY=xxx
OPAY_PUBLIC_KEY=xxx

# Auth
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# SMS (Termii)
TERMII_API_KEY=xxx
TERMII_SENDER_ID=Venticks

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. **Start PostgreSQL and Redis with Docker**
```bash
docker-compose up -d
```

5. **Run database migrations**
```bash
npx prisma db push
npx prisma generate
```

6. **Start the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

### Building for Production

```bash
npm run build
npm start
```

## Project Structure

```
venticks/
├── src/
│   ├── app/                    # Next.js app router pages
│   │   ├── api/               # API routes
│   │   │   ├── auth/          # Authentication endpoints
│   │   │   ├── events/        # Event management
│   │   │   ├── orders/        # Order creation
│   │   │   ├── tickets/       # Ticket management
│   │   │   ├── payments/      # Payment integrations
│   │   │   ├── webhooks/      # Payment webhooks
│   │   │   └── users/         # User endpoints
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Home page
│   ├── components/            # Reusable React components
│   ├── lib/                   # Utility functions
│   │   ├── payment/           # Payment integrations
│   │   │   ├── paystack.ts
│   │   │   └── opay.ts
│   │   ├── db/               # Database utilities
│   │   │   ├── prisma.ts
│   │   │   └── redis.ts
│   │   ├── queue/            # Queue configurations
│   │   │   └── workers.ts
│   │   ├── i18n/             # Internationalization
│   │   │   └── config.ts
│   │   ├── auth.ts           # NextAuth config
│   │   ├── utils.ts          # Helper functions
│   │   └── rateLimit.ts      # Rate limiting
│   ├── hooks/                # Custom React hooks
│   ├── types/                # TypeScript types
│   │   └── index.ts
│   └── locales/              # Translation files
│       ├── en.json           # English
│       ├── pcm.json          # Nigerian Pidgin
│       ├── yo.json           # Yoruba
│       ├── ha.json           # Hausa
│       └── ig.json           # Igbo
├── prisma/
│   └── schema.prisma         # Database schema
├── public/
├── docker-compose.yml        # Local dev environment
├── .env.example
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/[...nextauth]` - NextAuth endpoints (login, logout)

### Events
- `GET /api/events` - List events with pagination & filtering
- `POST /api/events` - Create event (organizer only)
- `GET /api/events/[id]` - Get event details
- `POST /api/events/[id]/approve` - Approve event (admin only)

### Tickets & Orders
- `POST /api/orders` - Create order/purchase tickets
- `GET /api/tickets/[id]` - Get ticket with QR code
- `POST /api/tickets/validate` - Validate ticket QR

### Payments
- `POST /api/payments/paystack/initialize` - Start Paystack payment
- `POST /api/payments/paystack/verify` - Verify Paystack payment
- `POST /api/payments/opay/initialize` - Start OPay payment
- `POST /api/webhooks/paystack` - Paystack webhook handler
- `POST /api/webhooks/opay` - OPay webhook handler

### Users
- `GET /api/users/me/tickets` - User's purchased tickets
- `GET /api/users/me/events` - Organizer's events

## Database Schema

The platform uses Prisma ORM with PostgreSQL. Key models include:

- **User** - User accounts (Attendees, Organizers, Admins)
- **Event** - Event information
- **Category** - Event categories
- **Venue** - Event venues
- **TicketType** - Ticket types for events
- **Ticket** - Individual tickets with QR codes
- **Order** - Purchase orders
- **Transaction** - Payment transactions

See `prisma/schema.prisma` for complete schema definition.

## Development

### Running Database Studio
```bash
npm run db:studio
```

### Database Migrations
```bash
npm run db:migrate
```

### Type Generation
```bash
npm run db:generate
```

## Payment Integration

### Paystack
1. Sign up at [Paystack](https://paystack.com/)
2. Get your API keys from the dashboard
3. Add keys to `.env` file
4. Webhook URL: `https://yourdomain.com/api/webhooks/paystack`

### OPay
1. Register as OPay merchant
2. Get merchant credentials
3. Add to `.env` file
4. Webhook URL: `https://yourdomain.com/api/webhooks/opay`

## Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Import project on Vercel
3. Add environment variables
4. Deploy

### Other Platforms
- Supports any Node.js hosting platform
- Requires PostgreSQL and Redis
- Set all environment variables

## Security

- Rate limiting on all API endpoints
- NextAuth.js for secure authentication
- Webhook signature verification
- CSRF protection
- SQL injection prevention via Prisma
- Input validation with Zod

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

MIT

## Support

For support, email support@venticks.com or create an issue in the repository.

## Acknowledgments

- Built for the Nigerian market with love 🇳🇬
- Optimized for African internet conditions
- Supports local payment methods