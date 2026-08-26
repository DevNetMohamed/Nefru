# Changelog — AI-Assisted Changes (for human review)

## Phase 1 — Critical fixes (2026-08-26)

Verification: `npm run build --prefix frontend` ✅ passes.
`npm run lint` reports 181 pre-existing errors (unused vars etc. across files
not touched here, incl. a latent `setAccountTypes is not defined` bug in
`Admin/pages/CMS/CMS.jsx`). No NEW lint errors introduced — every flag in the
files below predates this change and is queued for Phase 3.

### 1.1 + 1.2 Route protection & onboarding routes
**File: `frontend/src/routes/routes.jsx`**
- Wired `ProtectedRoute` into `/user` (`["tourist","guide"]`) and `/admin`
  (`["admin"]`, with `Admin` kept as nested layout). Unauthenticated →
  `/auth/login?returnTo=...`; wrong role → own portal home.
- Guide portal restructured to avoid an infinite redirect loop:
  - outer layer: `ProtectedRoute allowedRoles={["guide"]}`
  - middle: `RequireApprovedGuide` wraps dashboard/tours/createtour/schedule/
    tourmedia/tourapprove
  - `/guide/verification` moved OUT of the approval gate (still inside
    ProtectedRoute and the same `GuidePortalLayout` shell) because unapproved
    guides are redirected there by the guard itself
- Registered previously-missing routes so Google/email onboarding works:
  `/auth/check-email`, `/auth/choose-role`, `/auth/link-google`,
  `/auth/verify-email` (components already existed in `pages/Auth/Onboarding/`)
- Removed stale comment-import line for ProtectedRoute; kept all "DONT DELETE"
  comment blocks intact per team instruction

⚠️ Review notes:
- Guards return `null` until Redux auth `initialized` → brief blank screen on
  hard refresh of protected pages while `/users/profile/me` resolves
- `RequireApprovedGuide` treats `profile == null` as unapproved; backend does
  auto-create profiles in `getMyProfile`, so this should be safe, but if any
  guide login path returns no profile they'll land on /guide/verification
- Dev bypass unchanged: `VITE_DEV_AUTH_BYPASS=true` still skips guards in dev

### 1.3 MasterLayout crash fix
**File: `frontend/src/shared/MasterLayout/MasterLayout.jsx`**
- FIXED ReferenceError: `Header()` used `navigate` without `useNavigate()` —
  clicking logo or notification bell on mobile header crashed the app
- activeTab now derived directly from pathname via single module helper
  `getActiveTab()` (removed duplicated useState/useEffect in both MasterLayout
  and Navbar); fixes stale `[location.pathname]` effect deps relying on global
  window.location
- Removed 2 console.log leftovers; removed unused `profile` selector from Header

### 1.4 Hardcoded localhost removal (12 spots, audit found 6)
**File: `frontend/src/services/api.js`**
- Added exported `resolveUploadsUrl(value)` handling all stored media shapes:
  `"trips/x.webp"` → `${API_ORIGIN}/uploads/trips/x.webp`;
  `"/uploads/a.jpg"` → `${API_ORIGIN}/uploads/a.jpg`; absolute URLs unchanged.
  (Plain `resolveMediaUrl` was insufficient: it lacks the /uploads prefix.)

**Migrated raw axios calls to the canonical `apiRequest` wrapper** (adds env
base URL, cookie credentials, dev-role header, enriched thrown errors):
- `pages/User/Home/Mobile/MobileHome.jsx` (/home)
- `pages/User/Home/Desktop/DesktopHome.jsx` (/home)
- `pages/User/NearbyMap/NearbyMap.jsx` (/home)
- `pages/User/AvailableToday/AvailableTodayPage.jsx` (/home + /trips via
  Promise.allSettled — settled values now parsed bodies, `.data.data` → `.data`)
- `pages/User/RecommendedTrips/RecommendedTrips.jsx` (/trips + /home, same)
- axios imports removed from all five files

**Replaced local `http://localhost:5000/uploads/...` helpers with the shared
resolver (delegating wrappers kept per file):**
- MobileHome.jsx, AvailableTodayPage.jsx, RecommendedTrips.jsx,
  NearbyMap.jsx, components/ui/RecommendedTourCard/RecommendedTourCard.jsx,
  User/Home/Desktop/components/{ToursNearYou,ToursNearYou→done},
  TrustedGuides, AvailableToday (desktop), Guide/ToursManagement/ToursManagement

Behavior change (intentional fix): values like "/uploads/avatar.jpg" now resolve
against the API origin instead of being returned as frontend-origin paths
(previously broken images outside dev). Verified against backend storage:
`trip.model.js image`, seed data uses "trips/x.webp"; profile.controller stores
"/uploads/filename".

### Explicitly NOT done (per user decision)
- Dockerfile multi-stage rebuild (Phase 1 item 5) — deferred by user

### Suggested manual smoke test
1. Logged out: visit /user, /guide, /admin → redirected to /auth/login
2. Login as tourist → /admin redirects to /user/home
3. Mobile viewport: click logo + bell in header → navigates, no crash
4. Home pages load tours with images (dev needs VITE_API_BASE_URL set or
   default localhost:5000 fallback)

---

## Phases 6–7 — Admin backend + frontend (2026-08-26)

Verification: backend admin routes ESM-import OK; frontend build passes;
admin folder lint 58→0; whole frontend lint 181→120 (remainder pre-existing,
outside admin scope). Full detail in checklists/phase-6-7.md.

### Backend (3 files rewritten, 1 route file updated, 3 legacy files removed)
- REWRITTEN controllers/Admin/Admin.controller.js:
  * updateUserById mass assignment closed (whitelist: status only)
  * ban/unban/suspend write enum-valid user.status (was nonexistent isActive
    / off-enum "suspended"); self/admin protections on all mutations
  * deleteUserById cascades trips/bookings/profiles/notifications, guards
  * guideActivation(action) factory replaces req.route.path parsing
  * NEW updateTripStatus (PATCH /trip/:id/status) — real moderation endpoint
  * NEW getBookings read-only list (GET /bookings/:page)
  * getAllUsers populates profile fullName/avatar + meta.roleCounts, valid
    role whitelist, unified pagingView, empty pages return 200
  * getAllTours NaN page guard, ?category= filter, select+lean, types meta
  * error-leak cleanup everywhere (data:error / details:[error] removed)
- REWRITTEN controllers/Admin/services.js: dashboard crash fixed, stable
  response shape, doughnut labels aligned (Active/Pending/Rejected), real
  30-day bookings/revenue LineChart series, topTours lean+select
- UPDATED routes/admin.routes.js: new endpoints wired, guideActivation
  factory calls, adminLimiter (120/min/IP) via createRateLimiter
- REMOVED (moved to %TEMP% backup): Auth/authAdmin.controller.js,
  validation/authAdminValidation.js, validation/adminDasboardValidation.js

### Frontend (13 files touched in pages/Admin + assets/variables.jsx)
- api.js: full client (dashboard/accounts/trips/bookings + mutations), rich
  {error,status,code} contract
- components/Table/Table.jsx: defensive AccountItem (crash fix), keyboard
  rows, StatusPill w/ colors, BookingItem, loading/error/empty states,
  colSpan fixes, resolveUploadsUrl for images
- components/Status/Status.jsx: LineChart consumes real API data (fake May
  data deleted), Card hides missing rate, skeleton while loading
- components/charts/charts.jsx: Doughnut guarded, labeled legend values
- components/ErrorBoundary/ErrorBoundary.jsx: NEW, wraps portal Outlet
- Admin.jsx: shell cleaned, ErrorBoundary mounted
- Sidebar.jsx: useLocation sync (deep links), "cMS"→"cms" fix, aria-current
- Navbar.jsx: URL-derived title, dead switch + fake controls removed
- pages/DashboardStatus: real chart wiring, honest states, dead components
  (List/PendingItem/LogItem) removed
- pages/Accounts: real KPIs from roleCounts, working tabs, functional detail
  panel with Ban/Unban/Delete/guide-review actions
- pages/CMS: no-undef fixed, category tabs from API, trip moderation wired
- pages/Booking: rebuilt READ-ONLY (product decision) — real bookings table
- pages/Analytics: unused import removed (page itself still a placeholder)
- DELETED components/Form/* (decorative props-theater, zero consumers left)
- assets/variables.jsx: status color map extended (pending/reviewing/
  approved/rejected/deactivated/booking statuses)

### ⚠️ Review notes
- Doughnut now counts status:"active" as first slice (labeled "Active") —
  previously "approved". Both are distinct Trip statuses; active = public.
- Ban now sets status:"deactivated", which authMiddleware already enforces
  (login + protect reject non-active users) — bans take effect immediately.
- deleteUser cascade is a hard delete by design (matches existing hard-delete
  semantics); soft-delete would be a separate product decision.
- Admin rate limit 120 req/min per IP applies to reads too; raise if dashboards poll aggressively.

### Follow-up fix (2026-08-26)
- Table.jsx TopTourItem: image now renders inside a fixed 44x44 rounded
  thumbnail (.thumb/.thumbImg, object-fit:cover) instead of an unstyled
  full-size img; initials fallback shares the same frame. Became visible
  only after resolveUploadsUrl made images actually load.

### Follow-up fix (2026-08-26) — Accounts page polish
- Fixed regression: cards container div had className .pill (side effect of
  the earlier styles.status bulk rename) — restored to .status layout class
- KPI cards redesigned: real CSS classes (.statusCard/.kpiLabel/.kpiValue),
  uppercase muted label + large counter, left accent bar per card
  (green/gold/indigo), white bg + border + shadow, consistent height
- Detail card redesigned: header w/ avatar circle (photo or initials),
  name + role pill; divider; aligned key-value rows (Email/Joined/Status);
  status pill colored by state; actions pinned under a divider;
  Delete styled as danger outline; guide review buttons use proper
  Button Icon prop (old icon= prop was silently ignored)

### Follow-up fix (2026-08-26) — Accounts layout/responsiveness
- KPI cards: flex -> CSS grid repeat(auto-fit, minmax(190px,1fr)); 2 cols
  <=900px, 1 col <=480px; removed squeezed flex sizing
- Split the shared .layout column class into .tablePanel (fixed 640px height,
  internal row scrolling via .tableArea wrapper feeding Table's own
  flex/overflow chain) and .detailColumn (fixed 340px selection card)
- <=1200px detail card drops below table full-width; <=900px section stacks
  and panel becomes auto-height (min 420px)
- Removed dead legacy classes (.info/.table/.form/.section_1/.item/
  .containerAvatar/.avatar/.itemTag/.title/.chart); emptyHint now a dashed
  placeholder box
  - tablePanel now flex:1 1 auto — fills remaining parent width beside the 340px selection card

### Follow-up fix (2026-08-26) — Accounts selection persistence
- Selection now tracked by row id (selectedId) and resolved via useMemo
  against the latest fetched list, instead of holding a stale row snapshot.
  Ban/Unban/Delete/guide-review keep the account selected and the detail
  card re-renders with updated data after the refetch; deleted accounts
  resolve to null (panel returns to empty hint). Tab/page switches still
  clear the selection.

### Follow-up fix (2026-08-26) — stuck-disabled action buttons
- runAction (Accounts) and moderate (CMS) now wrap the action in
  try/catch/finally: busy always resets, so Approve/Reject/Suspend/Ban/
  Delete can never get permanently disabled after an unexpected throw.
  Unexpected errors surface in the detail panel instead of vanishing.
- Cancelling the reject-reason prompt now aborts the action instead of
  submitting an empty rejection reason.

### Follow-up fix (2026-08-26) — table fills parent height
- Accounts: .section now flex:1 + min-height:0 (stretch), removed the fixed
  640px on .tablePanel — the panel stretches to the remaining parent height
  and rows scroll internally; <=900px stacked mode keeps min-height:420px.

### Follow-up (2026-08-26) — split guide account vs verification actions
- Backend: getAllUsers/getUserById now populate + flatten verificationStatus
  for guide profiles (tourists simply have it undefined)
- Accounts detail panel: two divided groups
  * "Verification badge" (guides only): live verification pill
    (approved/pending/rejected/draft/not submitted) + Approve/Reject/Suspend;
    Approve disabled while already approved; hint text explains scope
  * "Account": status pill + Ban/Unban (+ Delete for non-admins, danger
    styled); hint text explains effect of ban vs delete
- Both groups update in place after actions via the id-derived selection.

### Follow-up (2026-08-26) — guide verification actions
- REMOVED Suspend from the verification badge group per product decision
  (its backend effect was banning the account, not revoking the badge;
  the /admin/guide/:id/suspend endpoint remains available via API).
- Approve no longer disables itself when already approved — it relabels to
  "Re-approve" instead (backend write is idempotent). This was the cause of
  the reported 'actions are disabled' impression on already-approved guides.

### Follow-up (2026-08-26) — Booking page cards + full-height table
- Backend getBookings: meta.stats added (total, confirmed, completed,
  cancelled, pendingPayment, revenuePaid via paid-payment aggregate)
- NEW shared components/KpiCard (label/value/accent-bar card); Accounts
  switched to it and its duplicate local Card + CSS removed
- Booking page: 4 KPI cards (Total Bookings / Confirmed / Completed /
  Revenue paid) from meta.stats; table wrapped in .tableArea filling all
  remaining parent height with internal scrolling; responsive card grid
  (2 cols <=900px, 1 col <=480px); legacy fixed .body height + dead CSS
  classes removed

### Follow-up (2026-08-26) — Accounts table pills
- Backend getAllUsers: headers now vary by role — guide tab gets an extra
  VERIFICATION column; rows already carry verificationStatus from the
  profile populate
- AccountItem: guides show a colored verification pill (approved/pending/
  rejected/draft/not submitted) and ALL rows show an account status pill
  (active green / deactivated red); column counts stay aligned with headers

### Follow-up (2026-08-26) — expressive status pills
- ROOT CAUSE: variables.jsx referenced nonexistent --color-error /
  --color-error-mute tokens, so deactivated/rejected/etc rendered as
  unstyled black text
- Rewrote the status color map against REAL index.css tokens: danger for
  rejected/cancelled/deactivated/no_show, success for completed/confirmed,
  secondary-dark on gold mute for pending/pending_payment, tertiary purple
  for reviewing/refunded, neutral grey literals for draft/expired;
  roles.guide switched to darker gold for readability
- StatusPill now always applies colors (hardcoded grey fallback) so a
  missing token can never produce black-on-transparent again
- Replaced remaining dead var(--color-error) usages in admin pages with
  the existing var(--color-danger)

### Follow-up (2026-08-26) — CMS publication tabs + Publish/Hide panel
- Backend getAllTours: ?category= replaced by ?state=all|published|
  unpublished (published = status active); meta now carries stats
  {total,published,unpublished} and types reflects the new tabs
- updateTripStatus action map: publish->active, hide->draft, reject->
  rejected (approve/suspend kept as legacy aliases)
- api.js getTrips(page, state)
- CMS.jsx rewritten: All/Published/Unpublished tabs with live count badges
  from meta.stats; selection tracked by id (panel updates in place after
  actions like Accounts); side panel shows trip details + Visibility pill
  (Published/Unpublished) with a contextual primary action: 'Publish tour'
  for unpublished rows / 'Hide tour' for published ones; try/finally busy
  guard included; trip thumbnail in panel header
- CMS.module.css: added .statusPublished/.statusHidden/.emptyHint (the
  emptyHint class was referenced but never defined before)
- Note: category-based filtering removed from admin CMS per this change;
  Trip categories still exist on the model/detail card.

### Follow-up (2026-08-26) — CMS status cards + full-height table
- Backend getAllTours: meta.stats extended with awaitingReview
  (status in reviewing|pending)
- CMS page: 4 KPI cards (Total Tours gold / Published green / Unpublished
  grey / Awaiting Review purple) via shared KpiCard; table wrapped in
  .tableArea filling all remaining parent height with internal scrolling;
  selection panel fixed at 340px, scrolls if tall; responsive breakpoints
  (stack <=1200px, 2-col cards <=900px, 1-col <=480px); removed dead .body
  wrapper/class
