# Auth / UX Implementation Summary

## Implemented

- Restored Traveler / Tour Guide role selection inside Register.
- Welcome role choice is preserved and preselects the Register role.
- Removed silent default-to-Traveler behavior when Register is opened without a role.
- Fixed Mobile Welcome role selection/navigation behavior.
- Added Google Identity Services button to Login and Register.
- Added Google sign-in for existing Google-linked users.
- Added Google sign-up with role-aware account creation.
- Added one-time Choose Role onboarding when Google sign-up starts without a role.
- Added secure Google-to-existing-local-account linking requiring the existing Nefru password.
- Google accounts use the verified Google `sub` identifier; local password is optional for Google-only accounts.
- Split Guide account creation from Guide verification document upload.
- Guide verification now continues on the dedicated `/guide/verification` page.
- Guide application submission routes to Application Received.
- Application Received no longer tells an already signed-in Guide to log in.
- Guide tour creation flow is gated until verification is approved.
- Admin routes now require authenticated admin role.
- Fixed Admin guide approve/reject logic to update GuideProfile verification state and review history.
- Added guide status notification + email on approve/reject/suspend.
- Added email verification for local signup.
- Added verification resend flow.
- Forgot Password now emails a real reset URL, not a raw token in the UI.
- Reset Password verifies the reset token on the backend before showing it as valid.
- Added password reset/change security emails.
- Password reset/change invalidates prior sessions using `tokenVersion`.
- Added real Remember Me behavior.
- Browser auth moved from persistent localStorage JWT to HttpOnly cookie sessions.
- Backend still accepts Bearer tokens for backward-compatible API clients.
- Added credentialed CORS, cookie-origin CSRF protection, and basic auth/recovery rate limiting.
- Production startup now requires a configured JWT secret.
- Removed frontend localStorage token/Authorization-header usage.
- Added auth session refresh on app startup.
- Added frontend protected routes for user/guide/admin areas.
- Added `RequireApprovedGuide` for guide creation flow.
- Fixed several case-sensitive imports that could fail on Linux deployments.
- Added environment examples and Google/Auth setup documentation.

## New frontend routes

- `/auth/check-email`
- `/auth/verify-email`
- `/auth/choose-role`
- `/auth/link-google`

## New/updated backend auth endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `POST /api/auth/google`
- `POST /api/auth/google/complete-signup`
- `POST /api/auth/google/link`
- `POST /api/auth/verify-email`
- `POST /api/auth/resend-verification`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password/verify`
- `POST /api/auth/reset-password`
- `PATCH /api/auth/change-password`

## Required configuration

See `docs/AUTH_GOOGLE_SETUP.md` and copy:

- `backend/.env.example` -> `backend/.env`
- `frontend/.env.example` -> `frontend/.env`

You must provide the same Google OAuth Web Client ID in:

- `GOOGLE_CLIENT_ID`
- `VITE_GOOGLE_CLIENT_ID`

## Validation performed in this workspace

- All backend JavaScript files passed `node --check`.
- 169 frontend JS/JSX files passed syntax parsing.
- All static relative JS/JSX imports resolve with exact casing.
- No frontend persistent JWT/localStorage Authorization usage remains.
- Secret-pattern audit found no real environment credentials in the modified project.

A full dependency-backed Vite/runtime build could not be executed in this workspace because the project dependencies were not installed and the local npm offline cache is incomplete. Run the normal install/build/integration checks after configuring your local environment, MongoDB, SMTP credentials, and Google OAuth client.
