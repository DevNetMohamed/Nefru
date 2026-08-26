# Phases 6–7 Checklist — Admin Backend + Frontend

Status: COMPLETE (2026-08-26) — pending user smoke test.

## Phase 6 — Backend (`backend/src/controllers/Admin/*`, `routes/admin.routes.js`)
- [x] 6.1 updateUserById: field whitelist (status only), enum validation,
      self-change + admin-target guards, save() so validators run; rejects
      unknown fields with explicit message (mass assignment closed)
- [x] 6.2 ban/unban now write real `status` ("deactivated"/"active");
      suspend maps to "deactivated" (enum-valid); self/admin targets blocked
- [x] 6.3 Dashboard service rewritten: removed discarded unbounded
      Booking.find, revenue via `paidBookings[0]?.totalPrice || 0`, stable
      response shape always, doughnut labels/values aligned (Active/Pending/
      Rejected), topTours select+lean, NEW real 30-day LineChart series
      (bookings+revenue per day, zero-filled), fake rates/durations and
      console.log removed
- [x] 6.4 Tour moderation: PATCH /admin/trip/:id/status {action:
      approve|reject|suspend} → active|rejected|draft; idempotent same-status;
      old broken tourAction deleted
- [x] 6.5 deleteUserById: blocks self-delete + admin targets; cascades
      trips/bookings/GuideVerification/profiles/notifications; returns {id}
      not the doc
- [x] 6.6 Hygiene: NaN page guards on tours+bookings, pagingView unified
      helper ([1,...mid...,last]), empty pages return 200+meta (no fake 404),
      internal error leakage removed (data:error / details:[error]),
      role query validated against enum, guideActivation converted to factory
      `guideActivation(action)` (no more req.route.path parsing),
      rate limiter (120 req/min/IP) on all /api/admin routes,
      legacy CommonJS files moved out (authAdmin.controller.js,
      authAdminValidation.js, adminDasboardValidation.js → temp backup)
- [x] 6.6b GET /admin/bookings/:page read-only endpoint (populates trip title/
      image, tourist/guide emails; flattened rows; full meta)

## Phase 7 — Frontend (`frontend/src/pages/Admin/**`)
- [x] 7.1 CMS.jsx: setAccountTypes no-undef fixed; tabs render from real
      meta.types (["All",History,Adventure,Culture,Food]) with category
      filtering via ?category=; pagination deps correct ([selectedCategory,
      page, refreshKey]); tab badge shows real totalRecords
- [x] 7.2 AccountItem crash fixed both sides: backend populates profileId
      (fullName/avatar) into user rows + meta.roleCounts; AccountItem
      defensive (initials fallback from name/email, safe createdAt);
      AdminErrorBoundary wraps the portal Outlet
- [x] 7.3 LineChart consumes API data ({labels, datasets:[{label,values}]});
      fabricated May datasets deleted; empty-data state added; DoughnutChart
      guarded against missing values, legend shows label:value pairs
- [x] 7.4 loading/error/empty states in Table component (+Status skeleton);
      api.js returns {error,status,code} instead of discarding failures;
      error rows have role="alert"
- [x] 7.5 Pagination plumbing: tours endpoint sends pagingView/types/meta;
      Table hides footer while loading/error; dashboard top-tours pagination
      removed (fixed top-10)
- [x] 7.6 Mutation client complete (banUser/unbanUser/deleteUser/reviewGuide/
      setTripStatus); Accounts detail panel = real selected row w/ Ban|Unban +
      Delete + Approve/Reject/Suspend for guides; CMS detail panel = real trip
      data w/ Approve/Unpublish/Reject; persona card + fake KPI cards removed;
      decorative Form component deleted (was fully unused after rewiring)
- [x] 7.7 Booking page rebuilt READ-ONLY per product decision: real bookings
      table (TOUR/TOURIST/GUIDE/DATE/GUESTS/TOTAL/STATUS), total count line,
      no actions/forms/charts
- [x] 7.8 Responsive: sidebar collapses to horizontal @ ≤900px; Sidebar syncs
      active state via useLocation (deep links work; "cMS" value bug fixed to
      "cms"); table rows keyboard-operable (tabIndex + Enter/Space +
      aria-selected); aria-labels on icon buttons; alt="" decorative images;
      colSpan on empty/loading/error rows; Navbar title derived from URL
      (dead getPageTitle switch + fake date/export buttons removed)
- [x] 7.9 Lint pass: admin folder 58 errors → 0; routes.jsx dead imports
      removed; whole-frontend lint 181 → 120 (remainder pre-existing outside
      admin scope)

## Verification
- [x] backend: node --check + ESM import of admin.routes.js OK
- [x] frontend: npm run build passes
- [x] frontend lint scoped to Admin + routes: 0 problems

## Deferred / noted
- Default JWT secret + seeded superadmin creds are ops tasks (env config)
- Doughnut semantics changed: "Approved"→"Active" count (status:"active" =
  publicly visible); flag if old intent needed
- Booking KPIs would need an aggregate endpoint if ever wanted (read-only
  scope kept minimal by decision)
