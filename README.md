# EventBook — MERN Event Booking App

A full-stack event booking platform built with MongoDB, Express.js, React and Node.js.

## Features
- Browse and filter events by category with pagination
- Google OAuth 2.0 authentication with JWT
- Secure Stripe payment integration
- Admin dashboard to manage events and bookings
- Booking management — confirm and cancel bookings
- Responsive desktop UI

## Tech Stack
| Layer | Tech |
|---|---|
| Frontend | React, React Router, Plain CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| Auth | Google OAuth 2.0 + JWT |
| Payments | Stripe |

## Project Structure
```
/event-booking-app   React frontend
/server
  /config            DB, Passport, Config
  /controllers       Business logic (MVC)
  /middleware        Auth, isAdmin, validation, error handling
  /models            Mongoose schemas
  /routes            Express routes
  /utils             AppError class
  seed.js            DB seeder
```

## Setup Instructions

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (free tier works)
- Google Cloud Console project (for OAuth)
- Stripe account (test mode)

### 1. Clone and install
```bash
# Frontend
cd event-booking-app && npm install

# Backend
cd ../server && npm install
```

### 2. Environment variables
Create a `.env` file in the `server` folder:
```bash
PORT=5000
MONGO_URI=your_mongodb_uri
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:3000
STRIPE_SECRET_KEY=sk_test_...
```

### 3. Seed the database
```bash
cd server && npm run seed
```

### 4. Run the app
```bash
# Terminal 1 (Backend)
cd server && npm run dev

# Terminal 2 (Frontend)
cd event-booking-app && npm start
```

App runs at http://localhost:3000

## Architecture Decisions

**MVC Pattern** — Controllers handle business logic separately from routes for cleaner, testable code.

**Google OAuth over email/password** — Reduces security risk (no password storage) and improves UX.

**JWT over sessions** — Stateless auth works better for a React SPA calling a separate API server.

**Mock-first development** — Built frontend with mock data first to validate UI before backend integration.

## API Endpoints
| Method | Route | Auth | Description |
|---|---|---|---|
| GET | /api/auth/google | No | Initiate Google OAuth |
| GET | /api/auth/me | JWT | Get current user |
| GET | /api/events | No | List events (paginated) |
| GET | /api/events/:id | No | Single event |
| POST | /api/bookings/create-payment-intent | JWT | Stripe payment intent |
| POST | /api/bookings/confirm | JWT | Confirm booking |
| GET | /api/bookings/my | JWT | User's bookings |
| DELETE | /api/bookings/:id/cancel | JWT | Cancel booking |
| GET | /api/admin/events | Admin | All events |
| POST | /api/admin/events | Admin | Create event |
| PUT | /api/admin/events/:id | Admin | Update event |
| DELETE | /api/admin/events/:id | Admin | Deactivate event |
| GET | /api/admin/bookings | Admin | All bookings |
