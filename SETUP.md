# Project Setup Guide

## 1. Database Setup (Local)

This project uses **PostgreSQL** and **Redis**. The easiest way to run them is using Docker.

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.

### Start Database

Run the following command in your terminal:

```bash
docker-compose up -d
```

This will start:

- Postgres on port `5432` (User: `user`, Password: `password`, DB: `venticks`)
- Redis on port `6379`

## 2. Environment Variables (.env)

A `.env` file has been created for you. Here's how to fill the remaining values:

### Database (Already Configured)

```env
DATABASE_URL=postgresql://user:password@localhost:5432/venticks
REDIS_URL=redis://localhost:6379
```

### Authentication (Already Configured)

```env
NEXTAUTH_SECRET="" #
NEXTAUTH_URL=http://localhost:3000
```

### Payment Gateways (Required for Payments)

You need to sign up for these services to get test keys:

1. **Paystack**: [Sign up here](https://dashboard.paystack.com/#/signup)

   - Copy `Secret Key` and `Public Key` from Settings > API Keys & Webhooks.

   ```env
   PAYSTACK_SECRET_KEY=sk_test_...
   PAYSTACK_PUBLIC_KEY=pk_test_...
   ```

2. **OPay**: [Sign up here](https://merchants.opayweb.com/)
   - You need a Merchant ID, Secret Key, and Public Key.
   ```env
   OPAY_MERCHANT_ID=...
   OPAY_SECRET_KEY=...
   OPAY_PUBLIC_KEY=...
   ```

### SMS Notifications (Optional)

1. **Termii**: [Sign up here](https://termii.com/)
   - Get your API Key from the dashboard.
   ```env
   TERMII_API_KEY=...
   TERMII_SENDER_ID=Venticks
   ```

## 3. Initialize Database

Once Docker is running and your `.env` is ready:

1. **Push Schema to Database**:

   ```bash
   npm run db:push
   ```

2. **Seed Initial Data** (Categories, Venues):

   ```bash
   npm run db:seed
   ```

3. **Start Development Server**:
   ```bash
   npm run dev
   ```
