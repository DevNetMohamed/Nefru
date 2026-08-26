# Phase 1 Checklist — Critical Fixes

Status: IN PROGRESS → mark items [x] as completed immediately after each edit.

## 1.1 Route protection
- [ ] Read `routes/routes.jsx`, `ProtectedRoute.jsx`, `RequireApprovedGuide.jsx`,
      `store/slices/authSlice.js` — confirm guard props & auth state shape
- [ ] Wrap `/user/*` tree with ProtectedRoute (roles: tourist; check whether
      guides also access /user)
- [ ] Wrap `/guide/*` with RequireApprovedGuide (role guide + approved status)
- [ ] Wrap `/admin/*` with ProtectedRoute (role admin)
- [ ] Decide redirect targets: unauth → `/auth/login`; wrong-role → own portal
      home or `/` (keep existing component behavior if already implemented)
- [ ] Ensure AuthRefresh bootstrap completes before guard decides (avoid
      flashing login for logged-in users on hard refresh) — check how
      ProtectedRoute handles "loading" state

## 1.2 Missing auth routes
- [ ] Read Onboarding pages: CheckEmail, ChooseRole, LinkGoogleAccount
- [ ] Register routes matching the exact paths used by navigations:
      GoogleAuthButton.jsx:104 `/auth/choose-role`, :119 `/auth/link-google`;
      RegisterForm.jsx:94 `/auth/check-email`
- [ ] Verify VerifyEmail page has a route; register if missing

## 1.3 MasterLayout fixes
- [ ] `Header()`: add `const navigate = useNavigate()`
- [ ] Fix effect deps `[location.pathname]` → `[pathname]` (2 places)
- [ ] Remove console.log leftovers (lines ~61, ~108)
- [ ] Dedupe activeTab computation between MasterLayout and Navbar (single
      source; derive from pathname directly, drop duplicated state)
- [ ] Do not refactor beyond scope (resize listener cleanup stays as-is;
      useIsMobile adoption is Phase 3)

## 1.4 Hardcoded URLs
- [ ] Read `services/api.js` to learn exported helpers/signature
- [ ] MobileHome.jsx:~282 axios call → api wrapper
- [ ] DesktopHome.jsx:~29 axios call → api wrapper
- [ ] AvailableTodayPage.jsx:~323 axios call → api wrapper
- [ ] RecommendedTrips.jsx:~300 axios call → api wrapper
- [ ] NearbyMap.jsx:~459 axios call → api wrapper
- [ ] NearbyMap.jsx:~95 hardcoded uploads origin → shared resolver
      (check DesktopNavbar resolveMediaUrl implementation first)
- [ ] Keep response-shape handling identical so UI logic is untouched

## Verification
- [ ] `npm run build --prefix frontend` passes
- [ ] `npm run lint --prefix frontend` no new errors
- [ ] Manual smoke: routes render logged-out (redirect works), MasterLayout
      header clicks navigate without crash
- [ ] CHANGELOG.md updated with all touched files

## Out of scope (explicitly deferred)
- Dockerfile multi-stage rebuild (user decision 2026-08-26)
