# NEFRU Frontend â€” Change Plan

Source: `.agent/analysis/frontend-analysis.md`. Execute phases in order.
Do not start a phase without user approval.

## Phase 1 â€” Critical fixes  âœ… COMPLETE (2026-08-26) â€” pending user smoke test
Goal: nothing crashes, all portals gated, onboarding reachable, no hardcoded
localhost. Dockerfile explicitly EXCLUDED by user decision.
- [x] 1.1 Wire `ProtectedRoute` + `RequireApprovedGuide` into `routes.jsx`
- [x] 1.2 Register missing `/auth/check-email`, `/auth/choose-role`,
      `/auth/link-google` (+ verify VerifyEmail route) so Google onboarding works
- [x] 1.3 Fix MasterLayout: `useNavigate()` inside `Header()`, effect deps
      `[pathname]`, dedupe activeTab logic (single helper/hook)
- [x] 1.4 Replace 6 hardcoded localhost URLs with `services/api.js` wrapper;
      fix NearbyMap uploads-origin hardcode via shared media resolver

## Phase 2 â€” Bundle & deps diet (pending approval)
2.1 Delete `"nefru-root": "file:.."` from frontend+backend; strip root pkg to
    concurrently-only; reconcile stripe versions
2.2 Remove dead deps: bootstrap, react-bootstrap, stripe, formik, yup,
    @fontsource/inter; move shadcn â†’ devDeps
2.3 React.lazy + Suspense for all routes; verify chunk split of chart.js/leaflet
2.4 Move bootstrap JS + leaflet.css imports out of main.jsx into consumers
2.5 One font strategy (recommend Geist; drop Poppins link)
2.6 vite.config: /api proxy, env-gated polling, manualChunks

## Phase 3 â€” Consistency (pending approval)
3.1 Consolidate duplicates: 1 Footer, 1 DesktopNavbar, 1 Button system,
    1 getImgSrc â†’ utils/media.js
3.2 Unify API error contract across User/api.js + Admin/api.js onto wrapper
3.3 Remove fabricated ratings/spotsLeft/mock merges (render real or nothing)
3.4 AbortController in all fetching effects; abort OSRM on change
3.5 Delete dead files/code/console.logs

## Phase 4 â€” Refactor monoliths (pending approval)
4.1 Split NearbyMap.jsx (1605 lines) â†’ useGeolocation, useOsrmRoute, MapPin
    module, BottomSheet, TourListPanel
4.2 Extract shared tour-grid + fetch hook from Home/AvailableToday/
    RecommendedTrips

## Phase 5 â€” Optional later (needs user decision)
i18n (react-i18next) Â· icon lib consolidation Â· OG meta Â· Dockerfile
multi-stage rebuild (user deferred)

## Phase 6 â€” Admin BACKEND fixes (analyzed 2026-08-26, pending approval)
Source: `.agent/analysis/admin-analysis.md`
- [ ] 6.1 Fix updateUserById mass assignment: field whitelist + runValidators
      + password hashing on update; block role/status/tokenVersion escalation
- [ ] 6.2 Fix ban/unban to write `status` ("deactivated"/"active") not
      nonexistent isActive; map suspend â†’ enum-valid value
- [ ] 6.3 Dashboard service: drop discarded unbounded Booking.find, fix
      paidBookings[0] crash (`?? {}`), keep response shape stable, swap
      doughnut values/labels, add select+lean on topTours, remove fake
      rates/console.log
- [ ] 6.4 Wire a real tour moderation endpoint (fix tourAction: precedence
      bug, verificationStatusâ†’status, enum mapping) or delete it â€” decide
- [ ] 6.5 deleteUserById: forbid self/admin deletion, cascade or soft-delete,
      stop returning deleted doc
- [ ] 6.6 Hygiene: NaN page guard, empty-page meta fix, error-leak cleanup,
      dead code removal (authAdmin legacy files), rate limiter on /api/admin

## Phase 7 â€” Admin FRONTEND fixes (analyzed 2026-08-26, pending approval)
- [ ] 7.1 Fix CMS.jsx setAccountTypes no-undef + page dep; decide tabs source
      (backend must send types in tours meta) 
- [ ] 7.2 Fix AccountItem crash: backend getAllUsers populate profile fields
      (fullName/avatar/email) OR defensive optional rendering + ErrorBoundary
- [ ] 7.3 Wire LineChart to real API data (pass item.data); delete fabricated
      datasets in Status.jsx
- [ ] 7.4 Surface loading/error/empty states in all pages; richer error
      contract from api.js ({error,status,code})
- [ ] 7.5 Pagination plumbing: CMS page dep, honor pageNum, tours endpoint
      pagingView/types meta
- [ ] 7.6 Add mutation API client (ban/unban/delete/guide-review/update) and
      wire Approve/Suspend/detail actions; replace persona/KPI hardcodes
- [ ] 7.7 Real Booking page vs repurpose nav item (needs product decision:
      booking endpoints exist? check backend booking routes first)
- [ ] 7.8 Responsive sidebar (@media collapse), Sidebar useLocation sync,
      keyboard-accessible rows, aria-labels/alt, colSpan empty state
- [ ] 7.9 Lint/dead-code pass on the folder (~58 errors)

## Phase 8 — Stripe payments via TEST MODE (analyzed 2026-08-26, pending approval)
Source: `.agent/analysis/stripe-analysis.md`. Existing integration is ~85%
complete; work = unblock flow + test config + gap fixes.
- [ ] 8.1 Fix B1: register `/user/bookings/:bookingId/payment` route →
      CheckoutWizard/Status mount (decide single canonical checkout path)
- [ ] 8.2 Fix B2: param mismatch — Status must read the real param name
      (or route renamed) so `GET /bookings/:id` stops receiving "undefined"
- [ ] 8.3 Fix B3: Book.jsx captures POST /bookings response (id +
      holdExpiresAt) and navigates straight into checkout
- [ ] 8.4 Test-mode config: backend/.env + frontend/.env with sk_test/pk_test
      + whsec from stripe CLI listen; document commands in PAYMENT_GUIDE
- [ ] 8.5 Handle payment_intent.payment_failed webhook (mark failed,
      notify); loud dev warning when webhook unsigned
- [ ] 8.6 Shared stripe module: one client factory, pinned apiVersion,
      shared CANCELLABLE statuses; rate-limit payment endpoints
- [ ] 8.7 Hold-expiry UX: freeze steps 2-3 at 0:00 with expired state +
      retry link; surface decline_code in CardDetailsStep errors
- [ ] 8.8 Small trust fixes: save-card default OFF, no forced default on
      add-card, role=alert on payment errors
- Deferred (needs product decision): refunds implementation, seed data
  with real test PIs

## Decisions log
- 2026-08-26: Phase 1 approved WITHOUT item 5 (Dockerfile) â€” user request
- 2026-08-26: Stripe analysis complete - integration already exists (~85%), plan = unblock + test config (Phase 8)
- 2026-08-26: Admin analysis requested covering backend + frontend routes;
  Phases 6â€“7 drafted, NOT started without approval
