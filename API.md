# Venticks API Documentation

Base URL: `http://localhost:3000/api` (development) or `https://yourdomain.com/api` (production)

All API endpoints return JSON responses.

## Authentication

Most endpoints require authentication using NextAuth.js session cookies. Include the session cookie in requests:

```
Cookie: next-auth.session-token=YOUR_SESSION_TOKEN
```

### User Roles

- **ATTENDEE**: Regular users who can purchase tickets
- **ORGANIZER**: Users who can create and manage events
- **ADMIN**: Full access including event approval

## Rate Limiting

All endpoints are rate-limited to **60 requests per minute** per IP address.

Exceeding the limit returns:
```json
{
  "error": "Too many requests. Please try again later."
}
```
**Status Code**: 429

## Error Responses

All errors follow this format:
```json
{
  "error": "Error message description"
}
```

Common status codes:
- `400` - Bad Request (validation error)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `429` - Too Many Requests (rate limit exceeded)
- `500` - Internal Server Error

## Endpoints

### Authentication

#### Register User

```http
POST /api/auth/register
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "phone": "+2348012345678",
  "role": "ATTENDEE"
}
```

**Response:** `200 OK`
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "clx123...",
    "email": "user@example.com",
    "name": "John Doe",
    "phone": "+2348012345678",
    "role": "ATTENDEE",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Validation:**
- `email`: Valid email address
- `password`: Minimum 8 characters
- `name`: Minimum 2 characters
- `phone`: Optional, must be unique
- `role`: Either "ATTENDEE" or "ORGANIZER"

---

#### Login

```http
POST /api/auth/signin
GET /api/auth/signout
```

Handled by NextAuth.js. See NextAuth documentation for details.

---

### Categories

#### List All Categories

```http
GET /api/categories
```

**Response:** `200 OK`
```json
{
  "categories": [
    {
      "id": "clx123...",
      "name": "Concerts",
      "slug": "concerts",
      "description": "Live music performances and concerts",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

**Notes:**
- Results are cached in Redis for 1 hour
- No authentication required

---

### Events

#### List Events

```http
GET /api/events
```

**Query Parameters:**
- `page` (number, default: 1) - Page number
- `limit` (number, default: 12) - Results per page
- `status` (string, default: "APPROVED") - Event status filter
- `categoryId` (string, optional) - Filter by category
- `search` (string, optional) - Search in title and description

**Response:** `200 OK`
```json
{
  "events": [
    {
      "id": "clx123...",
      "title": "Lagos Music Festival 2024",
      "description": "Annual music festival...",
      "slug": "lagos-music-festival-2024",
      "date": "2024-12-15T18:00:00.000Z",
      "time": "18:00",
      "capacity": 5000,
      "status": "APPROVED",
      "images": ["https://example.com/image.jpg"],
      "category": {
        "id": "clx123...",
        "name": "Concerts",
        "slug": "concerts"
      },
      "venue": {
        "id": "clx123...",
        "name": "Eko Convention Centre",
        "city": "Lagos"
      },
      "organizer": {
        "id": "clx123...",
        "name": "Event Organizer",
        "email": "organizer@example.com"
      },
      "ticketTypes": [
        {
          "id": "clx123...",
          "name": "Regular",
          "price": 5000,
          "quantity": 3000,
          "sold": 150
        }
      ]
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 25,
    "pages": 3
  }
}
```

---

#### Create Event

```http
POST /api/events
```

**Authentication Required:** Yes (ORGANIZER or ADMIN)

**Request Body:**
```json
{
  "title": "Lagos Music Festival 2024",
  "description": "Annual music festival featuring top Nigerian artists",
  "date": "2024-12-15T18:00:00Z",
  "time": "18:00",
  "capacity": 5000,
  "categoryId": "clx123...",
  "venueId": "clx123...",
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
      "description": "VIP access",
      "price": 15000,
      "quantity": 1000,
      "maxPerOrder": 5
    }
  ]
}
```

**Response:** `200 OK`
```json
{
  "message": "Event created successfully",
  "event": {
    "id": "clx123...",
    "title": "Lagos Music Festival 2024",
    "slug": "lagos-music-festival-2024",
    "status": "PENDING",
    ...
  }
}
```

**Notes:**
- Events created by ORGANIZERS start with status "PENDING" (require admin approval)
- Events created by ADMINS start with status "APPROVED"
- Slug is auto-generated from title

---

#### Get Event by ID

```http
GET /api/events/{id}
```

**Response:** `200 OK`
```json
{
  "event": {
    "id": "clx123...",
    "title": "Lagos Music Festival 2024",
    ...
  }
}
```

---

#### Approve/Reject Event

```http
POST /api/events/{id}/approve
```

**Authentication Required:** Yes (ADMIN only)

**Request Body:**
```json
{
  "status": "APPROVED"
}
```

**Valid statuses:**
- `APPROVED` - Approve the event
- `REJECTED` - Reject the event

**Response:** `200 OK`
```json
{
  "message": "Event approved successfully",
  "event": {
    "id": "clx123...",
    "status": "APPROVED",
    ...
  }
}
```

---

### Orders

#### Create Order

```http
POST /api/orders
```

**Authentication Required:** Yes

**Request Body:**
```json
{
  "tickets": [
    {
      "ticketTypeId": "clx123...",
      "quantity": 2
    },
    {
      "ticketTypeId": "clx456...",
      "quantity": 1
    }
  ]
}
```

**Response:** `200 OK`
```json
{
  "message": "Order created successfully",
  "order": {
    "id": "clx123...",
    "totalAmount": 25000,
    "transactionRef": "VNT-1234567890-ABC123",
    "status": "PENDING"
  }
}
```

**Notes:**
- Validates ticket availability
- Checks maxPerOrder limit
- Calculates total amount automatically
- Adds order to queue for processing
- Transaction reference is auto-generated

---

### Payments

#### Initialize Paystack Payment

```http
POST /api/payments/paystack/initialize
```

**Authentication Required:** Yes

**Request Body:**
```json
{
  "orderId": "clx123..."
}
```

**Response:** `200 OK`
```json
{
  "message": "Payment initialized successfully",
  "data": {
    "authorization_url": "https://checkout.paystack.com/abc123",
    "reference": "VNT-1234567890-ABC123"
  }
}
```

**Notes:**
- Redirect user to `authorization_url` for payment
- Amount is automatically converted to kobo (multiply by 100)

---

#### Verify Paystack Payment

```http
POST /api/payments/paystack/verify
```

**Authentication Required:** Yes

**Request Body:**
```json
{
  "reference": "VNT-1234567890-ABC123"
}
```

**Response:** `200 OK`
```json
{
  "message": "Payment verified successfully",
  "status": "success",
  "order": {
    "id": "clx123...",
    "status": "PAID"
  }
}
```

---

#### Initialize OPay Payment

```http
POST /api/payments/opay/initialize
```

**Authentication Required:** Yes

**Request Body:**
```json
{
  "orderId": "clx123..."
}
```

**Response:** `200 OK`
```json
{
  "message": "Payment initialized successfully",
  "data": {
    "cashierUrl": "https://cashier.opayweb.com/abc123",
    "reference": "VNT-1234567890-ABC123"
  }
}
```

---

### Webhooks

#### Paystack Webhook

```http
POST /api/webhooks/paystack
```

**Headers Required:**
- `x-paystack-signature` - Webhook signature for verification

**Request Body:**
Automatically sent by Paystack. See Paystack documentation.

**Notes:**
- Signature is verified using secret key
- Updates order and transaction status
- Generates tickets on successful payment

---

#### OPay Webhook

```http
POST /api/webhooks/opay
```

**Headers Required:**
- `signature` - Webhook signature for verification

**Request Body:**
Automatically sent by OPay. See OPay documentation.

---

### Tickets

#### Get Ticket by ID

```http
GET /api/tickets/{id}
```

**Authentication Required:** Yes (must be ticket owner)

**Response:** `200 OK`
```json
{
  "ticket": {
    "id": "clx123...",
    "qrCode": "1234567890-abc123",
    "status": "VALID",
    "ticketType": {
      "name": "VIP",
      "price": 15000,
      "event": {
        "title": "Lagos Music Festival 2024",
        "date": "2024-12-15T18:00:00.000Z",
        "venue": {
          "name": "Eko Convention Centre",
          "address": "Victoria Island"
        }
      }
    },
    "order": {
      "id": "clx123...",
      "totalAmount": 15000
    }
  }
}
```

---

#### Validate Ticket

```http
POST /api/tickets/validate
```

**Authentication Required:** Yes (ORGANIZER or ADMIN only)

**Request Body:**
```json
{
  "qrCode": "1234567890-abc123"
}
```

**Response:** `200 OK`
```json
{
  "valid": true,
  "message": "Ticket valid and marked as used",
  "ticket": {
    "id": "clx123...",
    "status": "USED",
    "ticketType": {
      "name": "VIP",
      "event": {
        "title": "Lagos Music Festival 2024"
      }
    },
    "user": {
      "name": "John Doe",
      "email": "user@example.com"
    }
  }
}
```

**Possible Responses:**
- `valid: true` - Ticket is valid (status changed to USED)
- `valid: false, message: "Ticket already used"` - Ticket was already validated
- `valid: false, message: "Ticket cancelled"` - Ticket was cancelled
- `valid: false, message: "Invalid ticket"` - Ticket not found

---

### Users

#### Get Current User's Tickets

```http
GET /api/users/me/tickets
```

**Authentication Required:** Yes

**Response:** `200 OK`
```json
{
  "tickets": [
    {
      "id": "clx123...",
      "qrCode": "1234567890-abc123",
      "status": "VALID",
      "ticketType": {
        "name": "VIP",
        "price": 15000,
        "event": {
          "title": "Lagos Music Festival 2024",
          "date": "2024-12-15T18:00:00.000Z"
        }
      }
    }
  ]
}
```

**Notes:**
- Only returns tickets for PAID orders
- Sorted by creation date (newest first)

---

#### Get Current User's Events

```http
GET /api/users/me/events
```

**Authentication Required:** Yes (ORGANIZER or ADMIN only)

**Response:** `200 OK`
```json
{
  "events": [
    {
      "id": "clx123...",
      "title": "Lagos Music Festival 2024",
      "status": "APPROVED",
      "ticketTypes": [
        {
          "name": "Regular",
          "quantity": 3000,
          "sold": 150
        }
      ]
    }
  ]
}
```

---

## Data Types

### Event Status
- `DRAFT` - Event is being edited
- `PENDING` - Waiting for admin approval
- `APPROVED` - Event is live and accepting bookings
- `REJECTED` - Event was rejected by admin

### Ticket Status
- `VALID` - Ticket is valid and unused
- `USED` - Ticket has been validated and used
- `CANCELLED` - Ticket was cancelled (refunded)

### Order Status
- `PENDING` - Order created, awaiting payment
- `PAID` - Payment successful, tickets generated
- `FAILED` - Payment failed
- `REFUNDED` - Order was refunded

### Transaction Status
- `PENDING` - Transaction in progress
- `SUCCESS` - Transaction completed successfully
- `FAILED` - Transaction failed

### Payment Providers
- `PAYSTACK` - Paystack payment
- `OPAY` - OPay payment

---

## Currency

All amounts are in Nigerian Naira (₦). Prices are stored as Decimal with 2 decimal places.

When integrating with Paystack, amounts must be converted to kobo (multiply by 100).

---

## Pagination

Endpoints that return lists support pagination:

**Query Parameters:**
- `page` (default: 1)
- `limit` or `perPage` (default: varies by endpoint)

**Response includes:**
```json
{
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 100,
    "pages": 9
  }
}
```

---

## Caching

Some endpoints use Redis caching:
- `/api/categories` - Cached for 1 hour

Cache keys follow the pattern: `{resource}:{identifier}`

---

## Webhooks

### Webhook Security

All webhooks verify signatures to ensure authenticity:

**Paystack:**
- Header: `x-paystack-signature`
- Algorithm: HMAC SHA512

**OPay:**
- Header: `signature`
- Algorithm: HMAC SHA512

---

## Testing

### Test Credentials

**Paystack Test Cards:**
```
Successful: 4084084084084081
Failed: 5060666666666666666
```

### Test Environment

Set these in `.env` for testing:
```
PAYSTACK_SECRET_KEY=sk_test_xxx
PAYSTACK_PUBLIC_KEY=pk_test_xxx
```

---

## SDKs and Libraries

### JavaScript/TypeScript
```typescript
// Example: Create order
const response = await fetch('/api/orders', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    tickets: [
      { ticketTypeId: 'abc123', quantity: 2 }
    ]
  }),
  credentials: 'include', // Include session cookie
})

const data = await response.json()
```

---

## Support

For API issues:
- Check status codes and error messages
- Review request/response in browser DevTools
- Consult this documentation
- Check server logs

---

## Changelog

### Version 1.0.0 (2024-01-01)
- Initial release
- All core endpoints implemented
- Paystack and OPay integration
- QR code ticket generation
- Queue system for ticket processing
