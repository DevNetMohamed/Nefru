# Phase 8 Checklist — Stripe Test-Mode Payments

Status: NOT STARTED — awaiting approval. Analysis: analysis/stripe-analysis.md

## 8.1–8.3 Unblock the flow (critical)
- [ ] Decide canonical checkout route (recommend: keep wizard at
      /user/trips/:id/book/status, fix MyBookings link to it) OR register
      /user/bookings/:bookingId/payment as alias
- [ ] Fix Status.jsx param name ↔ route param mismatch
- [ ] Book.jsx: capture { _id, holdExpiresAt } from POST /bookings and
      navigate to checkout with initialData
- [ ] Smoke: Book → slot → continue → wizard opens with countdown >14:00

## 8.4 Test-mode configuration
- [ ] backend/.env: STRIPE_SECRET_KEY=sk_test_…, STRIPE_WEBHOOK_SECRET=whsec_…
- [ ] frontend/.env: VITE_STRIPE_PUBLISHABLE_KEY=pk_test_…
- [ ] stripe listen --forward-to localhost:5000/api/payments/webhook; paste whsec
- [ ] PAYMENT_GUIDE.md: add stripe CLI section + test card table
      (4242… success / 4000000000000002 decline / 4000002500003155 3DS)
- [ ] E2E smoke: pay new card success → booking confirmed in MyBookings;
      declined card shows inline error; webhook line confirms succeeded event

## 8.5 Webhook gaps
- [ ] Handle payment_intent.payment_failed → paymentStatus failed + notify
- [ ] console.warn loudly when processing unsigned webhook in dev

## 8.6 Shared client + limits
- [ ] services/stripe.js (backend): single factory, pinned apiVersion,
      shared CANCELLABLE_PAYMENT_STATUSES; refactor both consumers
- [ ] createRateLimiter on payment mutation endpoints

## 8.7 UX hardening
- [ ] Steps 2–3 freeze at hold expiry: expired banner + "pick a new slot"
- [ ] Surface decline_code/message from verify/confirm errors (role=alert)

## 8.8 Trust fixes
- [ ] Save-card checkbox default OFF
- [ ] Add-card no longer silently sets default (explicit choice)
- [ ] Replace window.confirm in PaymentMethods with styled confirm (or defer)

## Out of scope / deferred
- Refunds (needs product decision), seed data with real test PIs,
  PaymentElement migration (legacy CardElement works in test mode)

## Verification plan
- [ ] npm run build (frontend), node import check (backend routes)
- [ ] Manual E2E matrix above recorded in CHANGELOG
