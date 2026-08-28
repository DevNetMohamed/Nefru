# Stripe Payment Integration Analysis — 2026-08-26

Headline: **A full Stripe integration already exists (~85% complete) but is
unreachable end-to-end due to three plumbing bugs, and is not yet configured
for test mode.** No mock fallbacks exist by design (PAYMENT_GUIDE.md:9) —
correct approach. Work = fix plumbing + configure test keys + close gaps.

## What already exists (do NOT rebuild)

### Backend (`backend/src/controllers/payment.controller.js`, `Booking.service.js`)
- POST /api/payments/create-intent — server-priced (Math.round(total*100),
  usd), idempotency keys, PI reuse/cancel-stale logic, metadata bookingId/
  touristId/saveCard, setup_future_usage when saving card
- POST /api/payments/pay-with-saved-card — ownership check vs customer,
  confirm:true off-session, idempotent
- POST /api/payments/verify — server-side succeeded arbitration (rescues
  webhook lag/3DS), owner-scoped
- Saved cards: list / setup-intent (off_session) / set-default / detach
- Webhook: signature-verified raw body (mounted BEFORE express.json),
  handles payment_intent.succeeded → finalizeSuccessfulPayment
- State machine: pending_payment→confirmed, unpaid→paid, clears hold,
  notifications; paid-during-cancel race handled; idempotent re-entry
- Hold system: 15-min hold, lazy expiry sweep on every touchpoint w/
  Stripe PI re-check + 5-min grace for webhook lag, TTL seat index,
  E11000 retry seat allocation (capacity races covered)
- Customers: lazy ensureCustomer → User.stripeCustomerId (select:false)
- Graceful degradation without keys: 503 STRIPE_NOT_CONFIGURED (no crash)

### Frontend
- CheckoutWizard (Summary→Method→Card→Success) with Elements provider +
  loadStripe(env key), graceful "not configured" states
- CardDetailsStep: legacy CardElement; confirmCardPayment incl. 3DS path;
  saved-card path via pay-with-saved-card + verify
- PaymentMethods page: add card (confirmCardSetup) / delete / set-default
- 15-min hold countdown in checkout header

## 🔴 Blocking bugs (checkout currently UNREACHABLE)

| # | Bug | Location |
|---|---|---|
| B1 | MyBookings navigates to `/user/bookings/:id/payment` — route does not exist; wildcard dumps user at /user | `MyBookings.jsx:94` vs `routes.jsx` |
| B2 | Only real wizard mount is `/user/trips/:id/book/status` but Status reads `useParams().bookingId` → calls `GET /bookings/undefined`; param name mismatch | `Status.jsx:8,14` vs `routes.jsx:114` |
| B3 | Book page discards POST /bookings response → never navigates to checkout, holdExpiresAt unknown | `Book.jsx:58-62` |

## 🟠 Gaps for solid test-mode operation

- G1 Only `payment_intent.succeeded` handled; no `payment_intent.payment_failed`
  write-back (paymentStatus stuck unpaid until hold lapses)
- G2 Unsigned webhook accepted in dev (secret unset) — silent; should log loudly
- G3 Two separate `new Stripe(...)` clients + duplicated CANCELLABLE list;
  apiVersion not pinned (floats on SDK default 2026-07-29.dahlia)
- G4 No refunds (cancel of PAID booking forfeits money; enum/UI pretend support)
- G5 No rate limiting on payment endpoints (limiters exist elsewhere)
- G6 Decline details (decline_code) dropped by errorHandler pass-through
- G7 Seed bookings have fake refs only — fine for UI, useless for verify paths
- G8 frontend `stripe` Node SDK dep unused (dead weight, Phase 2 item)

## 🟡 UX/polish notes

- Hold expiry mid-checkout unhandled past step 1 (form stays interactive at 0:00)
- Save-card checkbox defaults ON; adding card silently forces default
- window.confirm dialogs in payment UIs; verify-fail-after-charge has no
  recovery messaging; amount display client-derived (backend recomputes ✓)
- A11y: error div lacks role=alert; label association gap; progress bar
  decorative

## Test-mode configuration (the actual "implementation" ask)

1. backend/.env += STRIPE_SECRET_KEY=sk_test_… , STRIPE_WEBHOOK_SECRET=whsec_…
   (.env.example already documents names)
2. frontend/.env += VITE_STRIPE_PUBLISHABLE_KEY=pk_test_…
   (create frontend/.env from .env.example)
3. stripe CLI: `stripe login` + `stripe listen --forward-to
   localhost:5000/api/payments/webhook` → copy printed whsec_ into backend env
4. Test cards: 4242 4242 4242 4242 (success), 4000000000000002 (declined),
   4000002500003155 (3DS required); future expiry any CVC
