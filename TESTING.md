# Venticks Testing Guide

This document provides comprehensive testing instructions for the Venticks platform.

## Prerequisites

Before testing, ensure you have:

1. Docker and Docker Compose installed
2. Node.js 18+ installed
3. All environment variables configured in `.env`

## Setup for Testing

### 1. Start Required Services

Start PostgreSQL and Redis:

```bash
docker-compose up -d
```

Verify services are running:

```bash
docker-compose ps
```

### 2. Setup Database

Initialize the database schema:

```bash
npx prisma db push
```

Generate Prisma Client:

```bash
npx prisma generate
```

Seed the database with initial data:

```bash
npm run db:seed
```

### 3. Start Development Server

```bash
npm run dev
```

The application should be available at http://localhost:3000

## API Testing

### Authentication Endpoints

#### 1. Register User

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User",
    "phone": "+2348012345678",
    "role": "ATTENDEE"
  }'
```

Expected Response:
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "...",
    "email": "test@example.com",
    "name": "Test User",
    "role": "ATTENDEE"
  }
}
```

#### 2. Register Organizer

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "organizer@example.com",
    "password": "password123",
    "name": "Event Organizer",
    "role": "ORGANIZER"
  }'
```

### Category Endpoints

#### 1. List Categories

```bash
curl http://localhost:3000/api/categories
```

Expected Response:
```json
{
  "categories": [
    {
      "id": "...",
      "name": "Concerts",
      "slug": "concerts",
      "description": "Live music performances and concerts"
    },
    ...
  ]
}
```

### Event Endpoints

#### 1. List Events

```bash
curl "http://localhost:3000/api/events?page=1&limit=10&status=APPROVED"
```

#### 2. Create Event (Requires Authentication)

First, login to get session cookie, then:

```bash
curl -X POST http://localhost:3000/api/events \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN" \
  -d '{
    "title": "Lagos Music Festival 2024",
    "description": "Annual music festival featuring top Nigerian artists",
    "date": "2024-12-15T18:00:00Z",
    "time": "18:00",
    "capacity": 5000,
    "categoryId": "CATEGORY_ID_FROM_LIST",
    "images": ["https://example.com/image.jpg"],
    "ticketTypes": [
      {
        "name": "Regular",
        "description": "General admission",
        "price": 5000,
        "quantity": 3000,
        "maxPerOrder": 10
      },
      {
        "name": "VIP",
        "description": "VIP access with exclusive perks",
        "price": 15000,
        "quantity": 1000,
        "maxPerOrder": 5
      }
    ]
  }'
```

#### 3. Get Event Details

```bash
curl http://localhost:3000/api/events/EVENT_ID
```

### Order & Ticket Endpoints

#### 1. Create Order (Requires Authentication)

```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN" \
  -d '{
    "tickets": [
      {
        "ticketTypeId": "TICKET_TYPE_ID",
        "quantity": 2
      }
    ]
  }'
```

Expected Response:
```json
{
  "message": "Order created successfully",
  "order": {
    "id": "...",
    "totalAmount": 10000,
    "transactionRef": "VNT-...",
    "status": "PENDING"
  }
}
```

#### 2. Initialize Paystack Payment

```bash
curl -X POST http://localhost:3000/api/payments/paystack/initialize \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN" \
  -d '{
    "orderId": "ORDER_ID_FROM_CREATE_ORDER"
  }'
```

#### 3. Verify Payment

```bash
curl -X POST http://localhost:3000/api/payments/paystack/verify \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN" \
  -d '{
    "reference": "VNT-..."
  }'
```

#### 4. Get User Tickets

```bash
curl http://localhost:3000/api/users/me/tickets \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN"
```

#### 5. Validate Ticket (Organizer/Admin only)

```bash
curl -X POST http://localhost:3000/api/tickets/validate \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN" \
  -d '{
    "qrCode": "TICKET_QR_CODE"
  }'
```

## Frontend Testing

### 1. Home Page
- Visit http://localhost:3000
- Verify hero section displays
- Check all feature cards render
- Verify category cards are clickable
- Test responsive design on mobile

### 2. Authentication Flow
- Navigate to `/register`
- Fill registration form
- Submit and verify account creation
- Navigate to `/login`
- Login with created credentials
- Verify navbar shows user name and logout button

### 3. Event Browsing
- Navigate to `/events`
- Verify events list loads
- Test filtering by category
- Test search functionality
- Test pagination

### 4. Event Creation (Organizer)
- Login as organizer
- Navigate to `/dashboard`
- Click "Create Event"
- Fill event form with all details
- Add multiple ticket types
- Submit and verify event is created

### 5. Ticket Purchase Flow
- Navigate to event details page
- Select ticket type and quantity
- Click "Buy Tickets"
- Verify order summary
- Select payment method (Paystack/OPay)
- Complete mock payment
- Verify ticket is generated with QR code

### 6. My Tickets
- Navigate to `/my-tickets`
- Verify all purchased tickets display
- Click on ticket to view QR code
- Test QR code download

### 7. Organizer Dashboard
- Login as organizer
- Navigate to `/dashboard`
- Verify list of created events
- Check ticket sales statistics
- Test event editing

## Performance Testing

### 1. Load Testing
Use tools like Apache JMeter or Artillery to test:
- Concurrent user registrations
- Simultaneous ticket purchases
- API endpoint response times

### 2. Stress Testing
Test the queue system:
- Create high demand event
- Simulate 100+ simultaneous ticket purchases
- Verify no overselling occurs
- Check queue processing

### 3. Caching Verification
- Test Redis caching for categories
- Verify cache invalidation
- Check cache hit rates

## Security Testing

### 1. Rate Limiting
```bash
# Send 100 requests rapidly
for i in {1..100}; do
  curl http://localhost:3000/api/events &
done
```

Verify 429 responses after 60 requests per minute.

### 2. Authentication
- Test protected endpoints without authentication
- Verify 401 Unauthorized responses
- Test role-based access (Organizer, Admin)

### 3. Webhook Signature Verification
- Send webhook requests with invalid signatures
- Verify requests are rejected

### 4. SQL Injection Protection
- Test inputs with SQL injection patterns
- Verify Prisma ORM sanitizes inputs

## Integration Testing

### 1. Payment Integration

#### Paystack Test Cards
```
Successful: 4084084084084081
Failed: 5060666666666666666
```

#### Test Flow
1. Create order
2. Initialize Paystack payment
3. Use test card on payment page
4. Verify webhook is received
5. Check order status updates to PAID
6. Verify tickets are generated

### 2. Queue System
- Monitor BullMQ dashboard
- Verify jobs are processed
- Check failed job handling
- Test retry mechanism

## Database Testing

### 1. Verify Schema
```bash
npx prisma studio
```

Browse tables and verify:
- All models are created
- Indexes are present
- Relations work correctly

### 2. Test Transactions
- Create order with multiple ticket types
- Verify atomic transactions
- Test rollback on failure

### 3. Optimistic Locking
- Simulate concurrent ticket purchases
- Verify sold count accuracy
- Check no overselling occurs

## Mobile Testing

### 1. Responsive Design
Test on various screen sizes:
- iPhone SE (375x667)
- iPhone 12 Pro (390x844)
- iPad (768x1024)
- Galaxy S20 (360x800)

### 2. PWA Features
- Install app on mobile device
- Test offline functionality
- Verify service worker caching
- Test push notifications (if implemented)

### 3. Network Conditions
Test with throttled network:
- 3G speed
- Offline mode
- Intermittent connectivity

## Accessibility Testing

### 1. Screen Reader
- Test navigation with screen reader
- Verify ARIA labels
- Check semantic HTML

### 2. Keyboard Navigation
- Navigate site using only keyboard
- Verify all interactive elements are accessible
- Test tab order

### 3. Color Contrast
- Verify WCAG AA compliance
- Test with colorblind simulators

## Monitoring & Logging

### 1. Check Logs
```bash
# Application logs
npm run dev

# Redis logs
docker logs venticks-redis

# PostgreSQL logs
docker logs venticks-postgres
```

### 2. Queue Monitoring
- Monitor BullMQ job processing
- Check failed jobs
- Verify retry mechanisms

## Common Issues & Solutions

### Issue: Redis Connection Failed
**Solution**: Ensure Redis is running
```bash
docker-compose up -d redis
```

### Issue: Database Connection Failed
**Solution**: Check PostgreSQL is running and credentials are correct
```bash
docker-compose up -d postgres
```

### Issue: Prisma Client Not Generated
**Solution**: Regenerate Prisma Client
```bash
npx prisma generate
```

### Issue: Port Already in Use
**Solution**: Kill process or use different port
```bash
lsof -ti:3000 | xargs kill -9
```

## Continuous Testing

### Pre-commit Checklist
- [ ] All tests pass
- [ ] Code builds successfully
- [ ] No TypeScript errors
- [ ] Prisma schema is valid
- [ ] Environment variables documented

### Pre-deployment Checklist
- [ ] Production environment variables set
- [ ] Database migrations run
- [ ] Redis connected
- [ ] Webhook URLs configured
- [ ] Payment credentials verified
- [ ] Rate limiting configured

## Automated Testing (Future)

Recommendations for adding automated tests:

1. **Unit Tests** (Jest)
   - Test utility functions
   - Test payment service methods
   - Test queue workers

2. **Integration Tests** (Playwright/Cypress)
   - Test complete user flows
   - Test API endpoints
   - Test payment integration

3. **E2E Tests**
   - Test critical user journeys
   - Test across multiple browsers
   - Test mobile responsiveness

## Support

For issues during testing:
- Check logs in console
- Review error messages
- Consult API documentation in README
- Check GitHub issues

## Test Data Cleanup

After testing, clean up test data:

```bash
# Reset database
npx prisma db push --force-reset

# Re-seed
npm run db:seed
```

## Performance Benchmarks

Expected performance:
- API response time: < 200ms
- Page load time: < 2s
- Time to interactive: < 3s
- Concurrent users: 10,000+
- Tickets per second: 100+

Monitor and optimize to meet these targets.
