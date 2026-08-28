# Phase 1 Checklist — Critical Fixes

Status: IN PROGRESS → mark items [x] as completed immediately after each edit.

## 1.1 Route protection
- [x] Read `routes/routes.jsx`, `ProtectedRoute.jsx`, `RequireApprovedGuide.jsx`,
      `store/slices/authSlice.js` — confirm guard props & auth state shape
- [x] Wrap `/user/*` tree with ProtectedRoute (roles: tourist + guide)
- [x] Wrap `/guide/*`: ProtectedRoute(guide) at top, RequireApprovedGuide one
      level deeper so /guide/verification stays reachable (avoids redirect loop)
- [x] Wrap `/admin/*` with ProtectedRoute (role admin), Admin kept as layout
- [x] Redirect targets: guards already redirect unauth → /auth/login?returnTo=,
      wrong-role → role home (existing behavior kept)
- [x] Loading state: guards return null until auth.initialized (no login flash)

## 1.2 Missing auth routes
- [x] Read Onboarding pages: CheckEmail, ChooseRole, LinkGoogleAccount
- [x] Registered /auth/check-email, /auth/choose-role, /auth/link-google
      (paths verified against RegisterForm.jsx:94, GoogleAuthButton.jsx:104,119)
- [x] Registered /auth/verify-email (VerifyEmail page existed unrouted;
      reads ?token= from search params, likely linked from emails)

## 1.3 MasterLayout fixes
- [x] `Header()`: added `const navigate = useNavigate()`
- [x] Deduped activeTab into single module helper `getActiveTab(pathname)`;
      removed duplicated useState/useEffect from MasterLayout + Navbar
- [x] Removed console.log leftovers and unused profile selector
- [x] Scope kept: resize listener untouched (useIsMobile adoption = Phase 3)

## 1.4 Hardcoded URLs
- [x] Read `services/api.js`; added shared `resolveUploadsUrl()` (old helpers
      prefixed `/uploads/` for relative names — resolveMediaUrl alone would
      have broken those; new helper handles all stored shapes, verified
      against backend: trip.model.js, seed.js "trips/x.webp",
      profile.controller.js "/uploads/filename")
- [x] MobileHome.jsx axios → apiRequest("/home")
- [x] DesktopHome.jsx axios → apiRequest("/home")
- [x] AvailableTodayPage.jsx axios → apiRequest("/home" + "/trips"),
      `.data.data` → `.data` (allSettled values are parsed bodies now)
- [x] RecommendedTrips.jsx axios → apiRequest("/trips" + "/home"), same unwrap
- [x] NearbyMap.jsx axios → apiRequest("/home")
- [x] Uploads-origin hardcodes fixed in ALL copies (audit said 9 getImgSrc,
      grep found 12 total incl. ToursManagement API_ORIGIN + ui card):
      MobileHome, AvailableTodayPage, RecommendedTrips, NearbyMap,
      RecommendedTourCard (ui), ToursNearYou, TrustedGuides,
      AvailableToday (desktop), ToursManagement
- [x] axios imports removed everywhere in User pages

## Verification
- [x] `npm run build --prefix frontend` passes (1.35 MB single chunk — Phase 2)
- [x] `npm run lint --prefix frontend`: 181 errors, ALL pre-existing debt;
      none introduced (documented in CHANGELOG.md; CMS.jsx has a latent
      setAccountTypes undefined bug worth a separate fix)
- [ ] Manual smoke test per CHANGELOG checklist (needs running backend)

## Out of scope (explicitly deferred)
- Dockerfile multi-stage rebuild (user decision 2026-08-26)
