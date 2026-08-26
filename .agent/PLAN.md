# NEFRU Frontend — Change Plan

Source: `.agent/analysis/frontend-analysis.md`. Execute phases in order.
Do not start a phase without user approval.

## Phase 1 — Critical fixes  ← CURRENT
Goal: nothing crashes, all portals gated, onboarding reachable, no hardcoded
localhost. Dockerfile explicitly EXCLUDED by user decision.
- [x] 1.1 Wire `ProtectedRoute` + `RequireApprovedGuide` into `routes.jsx`
- [x] 1.2 Register missing `/auth/check-email`, `/auth/choose-role`,
      `/auth/link-google` (+ verify VerifyEmail route) so Google onboarding works
- [x] 1.3 Fix MasterLayout: `useNavigate()` inside `Header()`, effect deps
      `[pathname]`, dedupe activeTab logic (single helper/hook)
- [x] 1.4 Replace 6 hardcoded localhost URLs with `services/api.js` wrapper;
      fix NearbyMap uploads-origin hardcode via shared media resolver

## Phase 2 — Bundle & deps diet (pending approval)
2.1 Delete `"nefru-root": "file:.."` from frontend+backend; strip root pkg to
    concurrently-only; reconcile stripe versions
2.2 Remove dead deps: bootstrap, react-bootstrap, stripe, formik, yup,
    @fontsource/inter; move shadcn → devDeps
2.3 React.lazy + Suspense for all routes; verify chunk split of chart.js/leaflet
2.4 Move bootstrap JS + leaflet.css imports out of main.jsx into consumers
2.5 One font strategy (recommend Geist; drop Poppins link)
2.6 vite.config: /api proxy, env-gated polling, manualChunks

## Phase 3 — Consistency (pending approval)
3.1 Consolidate duplicates: 1 Footer, 1 DesktopNavbar, 1 Button system,
    1 getImgSrc → utils/media.js
3.2 Unify API error contract across User/api.js + Admin/api.js onto wrapper
3.3 Remove fabricated ratings/spotsLeft/mock merges (render real or nothing)
3.4 AbortController in all fetching effects; abort OSRM on change
3.5 Delete dead files/code/console.logs

## Phase 4 — Refactor monoliths (pending approval)
4.1 Split NearbyMap.jsx (1605 lines) → useGeolocation, useOsrmRoute, MapPin
    module, BottomSheet, TourListPanel
4.2 Extract shared tour-grid + fetch hook from Home/AvailableToday/
    RecommendedTrips

## Phase 5 — Optional later (needs user decision)
i18n (react-i18next) · icon lib consolidation · OG meta · Dockerfile
multi-stage rebuild (user deferred)

## Decisions log
- 2026-08-26: Phase 1 approved WITHOUT item 5 (Dockerfile) — user request
