# Admin Backend + Frontend Analysis — 2026-08-26

Scope: `/api/admin` surface (backend/src/routes/admin.routes.js,
controllers/Admin/*, middlewares/authMiddleware.js) and the admin portal
(frontend/src/pages/Admin/**). Line numbers valid at audit time.

## Endpoint inventory (all behind `router.use(protect, authorizeRoles("admin"))`)

| Method | Path | Controller |
|---|---|---|
| GET | /api/admin/dashboard | getDashboard |
| GET | /api/admin/user | getAllUsers |
| GET | /api/admin/user/:id | getUserById |
| PATCH | /api/admin/user/:id | updateUserById |
| PATCH | /api/admin/user/:id/ban | banUserById |
| PATCH | /api/admin/user/:id/unban | unbanUserById |
| DELETE | /api/admin/user/:id | deleteUserById |
| PATCH | /api/admin/guide/:id/approve | guideActivation |
| PATCH | /api/admin/guide/:id/reject | guideActivation |
| PATCH | /api/admin/guide/:id/suspend | guideActivation |
| GET | /api/admin/tours/:page | getAllTours |
| GET | /api/admin/trip/:id | getTourById |

## 🔴 Backend critical

- B1 **Mass assignment** — `updateUserById` pipes raw `req.body` into
  findByIdAndUpdate (`Admin.controller.js:131,139`). No whitelist/validation →
  can set role:"admin", status:"active", tokenVersion, emailVerified; sending
  `password` stores it PLAINTEXT (pre-save bcrypt hook never fires on
  findByIdAndUpdate).
- B2 **Dev impersonation bypass** — backend honors client header
  `X-Dev-Auth-Role` (`authMiddleware.js:20-64`): when enabled, protect skips
  ALL credential checks and authorizeRoles passes everyone
  (`authMiddleware.js:110`). Gated by NODE_ENV=development AND DEV_AUTH_BYPASS
  (`env.js:19-21`); currently disabled. Fail-deadly on one env mistake; no
  startup warning. Recommend: remove or require dev secret header.

## 🟠 Backend major

- B3 **Ban/unban are silent no-ops** — write `{isActive:false}` but User schema
  has no isActive field (`Admin.controller.js:219,254`; enforcement field is
  `status`, checked authMiddleware.js:78). Strict mode strips it; returns 200.
- B4 **Suspend writes off-enum value** — user.status enum is
  active|pending|deactivated (`user.model.js:49-54`) but suspend sets
  "suspended" with validateBeforeSave:false (:351-352).
- B5 **Dashboard service broken** (`services.js`):
  - Promise.all runs 9 queries, destructures 8 — the discarded 9th is an
    UNBOUNDED `Booking.find({status:"completed"})` (line 43)
  - line 45 `const {totalPrice} = paidBookings[0]` throws on zero paid
    bookings → catch returns DIFFERENT SHAPE (flat totals, lines 69-79) →
    frontend renders empty silently
  - Doughnut values `[approved, rejected, pending]` vs labels
    ["Approved","Pending","Rejected"] — swapped (line 56)
  - topTours returns full Trip docs incl. embedded reviews, no select/lean
  - fake rates "0%" / "vs Apr 1 - Apr 31" (50-53)
- B6 **No working tour moderation endpoint** — tourAction exists
  (Admin.controller.js:531) but registered nowhere; triple-broken anyway:
  `if(!action in allowed)` precedence bug (:540), checks nonexistent
  verificationStatus on Trip (:553), maps draft→"drafted" violating Trip enum
  (trip.model.js:90-94). Admins cannot approve/reject tours today.
- B7 **deleteUserById destructive & unguarded** (:278-311) — can delete admins/
  self, hard-delete leaves orphaned profiles/trips/bookings despite careful
  cascade logic existing in auth layer (authUser.controller.js:184-295).
- B8 **Weak default secrets + seeded default admin creds** (env.js:6-8,48-53;
  public login accepts role admin, authUser.controller.js:534-543); no rate
  limiter on /api/admin.

## 🟡 Backend minor

NaN page crash on /tours/abc (:443-446); empty-page 404 with wrong meta math
(:87-99, currentPage:totalPages typo :94); internal error leakage
(data:error :230,:265,:300; details:[error] :493,:577; stack leak
errorHandler.js:13); getUserById no ObjectId pre-check + misleading log text;
guideActivation parses verb from req.route.path (:315) — brittle; dead code:
tourAction, commented getBooking (:581-601), unused mongoose import,
CommonJS legacy files authAdmin.controller.js + authAdminValidation.js +
commented-out adminDasboardValidation.js; copy-paste texts ("Invalid user ID"
for trips :519, "while updating user" in tour handlers).

## Frontend admin portal — structure

Admin.jsx shell (Sidebar+Navbar+Outlet, 27 lines) · api.js (3 fns via
services/api wrapper ✅) · components/{charts,Form,Navbar,Sidebar,Status,Table}
· pages/{DashboardStatus 142L, Accounts 110L, CMS 157L, Booking 123L,
Analytics placeholder}. No ErrorBoundary anywhere in src.

## 🔴 Frontend critical

- F1 **CMS.jsx broken by no-undef** — `setAccountTypes(data.meta.types)` at
  CMS.jsx:48 while declaration commented out (:23). ReferenceError swallowed
  by catch → error state holds junk, tabs permanently dead. Also pagination
  effect misses `page` dep (:63) so paging no-ops; `data.meta.types` would be
  undefined anyway (backend tours endpoint doesn't send types).
- F2 **Accounts + Booking crash on real data** — AccountItem does
  `data.fullName.split(" ")` (Table.jsx:224,226) but getAllUsers returns raw
  User docs WITHOUT fullName/avatar (no populate; those live on profile
  models). First row render throws TypeError; no ErrorBoundary → whole page
  dies.
- F3 **Fake LineChart presented as real** — DashboardStatus renders
  `<LineChart/>` with NO props (DashboardStatus.jsx:57); Status.jsx:69-91
  falls back to hardcoded May labels + fabricated Bookings/Revenue datasets.
  Backend sends data:{} which component ignores.
- F4 **No loading/error/empty UI anywhere** — loading/error state declared then
  ignored in all 4 pages; api.js collapses every failure (incl. backend
  404-on-empty-page) to generic string `{error:"error reading..."}`.

## 🟠 Frontend major

- F5 Pagination plumbing broken end-to-end: CMS missing page dep; Dashboard
  ignores pageNum; tours endpoint lacks pagingView/types meta so Table shows
  lone "[1]" button; Accounts works (pagingView exists there).
- F6 api.js default role "tourists" invalid (enum: tourist|guide|admin);
  latent until misused.
- F7 Booking page is a copy of Accounts managing USERS under a "Bookings" nav
  item (Booking.jsx:10,32-34,65); no booking API client exists.
- F8 Hardcoded KPIs everywhere: "12"/"+2 new" cards ×8 (Accounts 67-70,
  Booking 71-74), tab badge "123" (CMS:91, Booking:106), Sarah Mahmoud persona
  detail card (CMS:120-155), date range "May 1 - May 31,2024" (Navbar:33),
  "# of Votes" legend (charts.jsx:19), FormSelect prints literal "value"
  (Form.jsx:30).
- F9 Forms are decorative: uncontrolled inputs, no validation, duplicate
  "User Name" field (Accounts:107,110), Approve/Suspend buttons wired to
  nothing (NO mutation functions exist in admin api.js at all despite backend
  shipping ban/unban/delete/guide-review endpoints).
- F10 Zero responsive CSS in entire admin folder (no @media anywhere; fixed
  300px sidebar Admin.module.css:10-13).
- F11 Row selection keyboard-inaccessible (tr onClick, no tabindex/keydown,
  Table.jsx:151-153,201-233); icon buttons without aria-label (Navbar:35-36);
  images without alt.

## 🟡 Frontend minor

~58 lint errors in folder (unused imports/state/dead components List/
PendingItem/LogItem DashboardStatus:88-153); Navbar dead getPageTitle
referencing nonexistent /admin/orders|settings routes + hardcoded title
"Dashboard"; Sidebar active-tab init capitalized never matches, mount-effect
setState, no useLocation sync (deep-link highlight broken); AbortController
cargo-cult (created, aborted, signal never passed — CMS:60-62 pattern ×3);
Table.module-old.css leftover; chart.js registration duplicated per file;
DoughnutChart .map crash if values undefined (charts.jsx:52); empty-state td
missing colSpan (Table.jsx:74-79); formatNumber(undefined)→"NaN".

## ✅ What's good (keep)

- Single security choke point router.use(protect, authorizeRoles("admin"))
  covering all 12 endpoints; correct middleware order
- Real session security: JWT + tokenVersion revocation, httpOnly cookie,
  active-status recheck per request, CSRF origin guard
- Sensitive fields select:false (no hash/token leakage on reads)
- Server-side pagination protocol (meta.pagingView etc.) + generic Table is
  the right architecture; bounded LIMIT=10 lists
- guideActivation flow is thoughtful (whitelist, 3-model update, reviewedBy,
  graceful email/notification degradation)
- Frontend: all calls through services/api wrapper; ProtectedRoute solid;
  consistent CSS modules + shared component vocabulary
