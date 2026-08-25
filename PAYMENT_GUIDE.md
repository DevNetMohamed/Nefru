# Nefru booking and payment guide

## Current product rules

- A signed-in tourist books one place for the account holder.
- The guide publishes date/time slots and sets capacity for every slot.
- A booking holds one place for 15 minutes while payment is pending.
- The price shown and charged is the trip price in USD. There are no added fees.
- Card payments and saved cards use Stripe. There is no mock-success fallback.
- PayPal, Apple Pay, Google Pay, EGP, and EUR are displayed as `Soon`.
- A tourist can cancel before the start time. Automatic refunds are not implemented yet.
- The guide can cancel a future occurrence with a reason or mark an ended occurrence completed.

## Configure Stripe

Copy the example environment files and provide Stripe test credentials:

`backend/.env`

```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
DEV_AUTH_BYPASS=false
```

`frontend/.env`

```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
VITE_DEV_AUTH_BYPASS=false
```

For local webhook testing, forward Stripe events to:

```text
http://localhost:5000/api/payments/webhook
```

Never commit real Stripe keys or webhook secrets.

## Tourist flow

1. Open an active trip at `/user/trips/info/:tripId`.
2. Select `Book`. If logged out, log in and Nefru returns to the same trip.
3. Select a future date/time with an available place.
4. Continue to `/user/bookings/:bookingId/payment` before the 15-minute hold expires.
5. Pay with a new or saved Stripe card.
6. The confirmed booking appears under Profile > My Bookings > Upcoming.

Pending holds also appear in Upcoming with `Continue payment`. Expired holds are hidden and their places become available again.

## Guide flow

- Set capacity per slot in the tour schedule editor.
- Open `/guide/bookings` for occurrence-level booking management.
- The guest list shows traveler, payment state, request, and USD price.
- Canceling an occurrence removes it from availability and cancels its active bookings.
- Completing an occurrence is allowed only after its end time.

## Booking states

- `pending_payment`: place is temporarily held.
- `confirmed`: paid and shown as Upcoming.
- `completed`: marked completed by the guide.
- `cancelled`: cancelled before the trip started.
- `expired`: 15-minute payment window elapsed; hidden from the tourist list.

## Main API routes

```text
GET    /api/bookings/trips/:tripId/availability
POST   /api/bookings
GET    /api/bookings/:bookingId
GET    /api/bookings/me
PATCH  /api/bookings/:bookingId/cancel
GET    /api/bookings/guide/me
PATCH  /api/bookings/guide/occurrences/cancel
PATCH  /api/bookings/guide/occurrences/complete

POST   /api/payments/create-intent
POST   /api/payments/pay-with-saved-card
POST   /api/payments/verify
GET    /api/payments/methods
POST   /api/payments/methods/setup-intent
PATCH  /api/payments/methods/:paymentMethodId/default
DELETE /api/payments/methods/:paymentMethodId

GET    /api/users/saved-trips
POST   /api/users/saved-trips/:tripId
DELETE /api/users/saved-trips/:tripId
```

## Verification

```bash
cd frontend
npm run build
```

Then run both apps, sign in as a tourist, and use a Stripe test card. A successful payment must only be accepted after Stripe reports a succeeded PaymentIntent.
