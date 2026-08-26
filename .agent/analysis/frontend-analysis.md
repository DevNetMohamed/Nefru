# Frontend Analysis — 2026-08-26

Audit of `frontend/` (React 19 + Vite 8, ~180 files, ~17.5K LOC, ~45 routes).
Line numbers refer to state at audit time and may drift as phases execute.

## Critical

| # | Issue | Location |
|---|---|---|
| C1 | No route protection: guards written but only referenced in commented code | `routes/routes.jsx:7,138,212` |
| C2 | Google onboarding unreachable: navigates to unregistered routes `/auth/choose-role`, `/auth/link-google`, `/auth/check-email` → catch-all dumps user at `/user` | `GoogleAuthButton.jsx:104,119`, `RegisterForm.jsx:94`; onboarding pages exist in `pages/Auth/Onboarding/` |
| C3 | Runtime crash: `Header()` uses `navigate()` without `useNavigate()` → ReferenceError on logo/bell click (mobile header) | `shared/MasterLayout/MasterLayout.jsx:78,88` |
| C4 | Hardcoded `http://localhost:5000/api` bypassing `services/api.js` in 6 spots; uploads origin hardcoded in NearbyMap | `MobileHome.jsx:282`, `DesktopHome.jsx:29`, `NearbyMap.jsx:95,459`, `AvailableTodayPage.jsx:323-324`, `RecommendedTrips.jsx:300-301` |
| C5 | Production Docker image runs Vite dev server (no build/nginx) | `frontend/Dockerfile` |

## Major

- M1 Zero code splitting — single 1.35 MB minified chunk; chart.js + leaflet +
  Admin portal shipped to every visitor (`routes/routes.jsx:9-63` eager imports)
- M2 `"nefru-root": "file:.."` circular dep in frontend+backend package.json →
  npm copies entire repo incl. nested node_modules into node_modules
- M3 Root package.json duplicates app deps (react, stripe, mongodb, multer);
  version drift stripe ^22.3.2 vs ^22.5.0
- M4 Four styling systems: Bootstrap CSS+JS global (main.jsx:3-4, used by ~3
  files), Tailwind v4, 111 CSS-module files, inline styles (~60 spots); two
  token systems + font conflict Poppins vs Geist vs unused @fontsource/inter
- M5 Dead deps: react-bootstrap (0 imports), stripe Node SDK in frontend,
  formik+yup (0 imports), shadcn CLI as runtime dep
- M6 Dual API layers with inconsistent error contracts (`User/api.js`,
  `Admin/api.js` swallow errors into `{error}` strings)
- M7 Fabricated data shown as real: hardcoded rating 4.9 / reviewsCount 150,
  fake spotsLeft idx%4+2, mock arrays merged into live API results
  (`RecommendedTrips.jsx:322-323`, `AvailableTodayPage.jsx:346-354`)
- M8 Monolith pages >500 lines: NearbyMap 1605, MobileHome 810,
  AvailableTodayPage 745, RecommendedTrips 736, DiscoverEgyptPage ~650
- M9 Fetching without AbortController/cleanup in 5 files; unthrottled OSRM
  calls with silent fabricated fallback (`NearbyMap.jsx:500-556`)
- M10 `getImgSrc` duplicated 9x, divergent behavior (NearbyMap variant
  hardcodes localhost)

## Minor

- console.logs left (MasterLayout.jsx:61,108; MobileHome.jsx:329;
  ToursManagement.jsx:52; NearbyMap.jsx:492,1233-onClick)
- Duplicate components: 3x Footer, 2x DesktopNavbar, 2x Button systems
- Dead files: empty Search components, Trips placeholder, Tracking stubs,
  Table.module-old.css, ~145 commented lines NearbyMap.jsx:235-380
- A11y: clickable non-focusable divs (search bar MobileHome.jsx:360,
  guide cards :414, logo MasterLayout.jsx:78); href="#" in Footer
- No i18n; useIsMobile hook exists but reimplemented inline (MasterLayout)
- Vite: no /api proxy, always-on 100ms polling, no manualChunks
- Missing OG/Twitter meta in index.html

## Positives (preserve)

- Clean RTK slices; optimistic-update SavedTrips context w/ rollback
- httpOnly-cookie session bootstrap w/ cleanup flag (AuthRefresh.jsx)
- Good aria coverage in newer components (DesktopNavbar menus, tabs,
  radiogroups); folder-per-component convention is consistent
