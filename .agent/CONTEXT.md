# NEFRU — Project Context

Tourism platform for Egypt: tourists book guided trips. Three portals
(tourist / guide / admin) + auth/onboarding flows.

## Monorepo layout

```
NEFRU/
├── backend/        Node + Express + MongoDB (session-cookie auth)
├── frontend/       React 19 + Vite 8 SPA  ← current focus
├── docker-compose.yaml
└── package.json    root scripts only (concurrently dev runner)
```

## Frontend stack facts

- **React 19.2**, `createBrowserRouter` (react-router-dom v7), rendered via
  `<RouterProvider>` in `src/main.jsx`
- **Redux Toolkit**: `src/store/` — slices: `authSlice` (profile + logoutUser
  thunk), `notificationSlice`. Auth state shape used by guards:
  `state.auth = { profile, status?, isAuthenticated?... }` — VERIFY exact fields
  in `src/store/slices/authSlice.js` before writing guard logic
- **Auth model**: httpOnly session cookie (`credentials: "include"`).
  `AuthRefresh.jsx` bootstraps session from `/users/profile/me` on mount.
  No bearer tokens. Dev-only role spoofing via `X-Dev-Auth-Role` header,
  gated behind `import.meta.env.DEV` (`src/config/devAccess.js`)
- **API layer**: `src/services/api.js` is the canonical fetch wrapper
  (env base URL via `VITE_API_BASE_URL`, cookie creds, enriched errors:
  `{ message, status, code, data }`). Rogue axios calls exist in 5 page files
  (Phase 1 removes them)
- **Styling**: mixed Tailwind v4 + CSS Modules (dominant, ~111 files) +
  legacy Bootstrap loaded globally in main.jsx (to be removed in Phase 2) +
  shadcn-style primitives in `src/components/ui/` built on `@base-ui/react`
  (NOT Radix). Path alias `@/` → `src/`
- **Fonts**: Poppins via Google Fonts link (body font today) vs Geist
  fontsource (Tailwind token). Decision pending Phase 2; don't add new fonts
- **Portals/route groups** (~45 routes): `/auth/*`, `/user/*`
  (nested under `shared/MasterLayout`), `/guide/*`, `/admin/*`

## Conventions to follow when editing

- Folder-per-component with co-located `.module.css`
- Existing code comments are partially Arabic — keep them, do not translate
- ESLint flat config w/ react-hooks rules: `npm run lint --prefix frontend`
- Build check: `npm run build --prefix frontend`
- Do NOT touch `dist/`, `node_modules/`, or backend unless the task requires it

## Known landmines

1. `"nefru-root": "file:.."` in frontend/backend package.json causes npm to
   copy the whole repo into node_modules (removal planned Phase 2)
2. Two route-guard components exist but were unwired until Phase 1
3. Mock/fabricated data merged into live API responses in several User pages
   (cleanup planned Phase 3) — when touching those pages, do not "fix" the
   fabricated data silently; it's tracked separately
4. `getImgSrc` duplicated 9x with divergent behavior — one variant hardcodes
   localhost (`NearbyMap.jsx`) — consolidation planned Phase 3
