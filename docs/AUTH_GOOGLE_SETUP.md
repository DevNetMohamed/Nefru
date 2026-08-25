# Nefru Auth & Google Sign-In Setup

This project now supports:

- Email/password registration with email verification.
- Email/password login with a real **Remember me** session option.
- Password reset by email link, with server-side token validation.
- Google Sign-In / Sign-Up through Google Identity Services.
- Secure linking when a Google email already belongs to a password-based Nefru account.
- One-time role onboarding (`Traveler` or `Tour Guide`) for new Google users when no role was selected before Google authentication.
- Separate Guide account creation and Guide document verification.
- HttpOnly cookie sessions, while the backend still accepts Bearer tokens for non-browser/backward-compatible API clients.
- Session invalidation after password reset/change.
- Basic auth/recovery rate limiting and cookie-origin CSRF protection.

## 1. Install

From the repository root:

```bash
npm run install-all
```

Do not commit `.env` files or Gmail app passwords.

## 2. Backend environment

Copy `backend/.env.example` to `backend/.env` and configure at least:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/nefru
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
COOKIE_SAME_SITE=lax
GOOGLE_CLIENT_ID=YOUR_WEB_CLIENT_ID.apps.googleusercontent.com
MAILER_HOST=smtp.gmail.com
MAILER_PORT=465
MAILER_EMAIL=your-gmail@gmail.com
MAILER_PASSWORD=your-google-app-password
```

`JWT_SECRET` is mandatory when `NODE_ENV=production`.

## 3. Frontend environment

Copy `frontend/.env.example` to `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=YOUR_WEB_CLIENT_ID.apps.googleusercontent.com
```

The frontend and backend must use the **same Google OAuth Web Client ID**.

## 4. Google Cloud configuration

In Google Cloud Console:

1. Configure the OAuth consent screen for the project.
2. Create an **OAuth 2.0 Client ID** with application type **Web application**.
3. Add the frontend origins under **Authorized JavaScript origins**.
   - Development: `http://localhost:5173`
   - Production: your real frontend origin, for example `https://nefru.example.com`
4. Put the generated client ID in both `GOOGLE_CLIENT_ID` (backend) and `VITE_GOOGLE_CLIENT_ID` (frontend).

Nefru uses the Google Identity Services popup + credential callback, so the current implementation does not depend on a frontend OAuth redirect route.

The backend verifies the Google ID token signature with Google's published public keys and validates issuer, audience, expiry, verified email, and `sub`. The Google `sub` claim is stored as the stable Google account identifier; email is not used as the provider identifier.

## 5. Gmail / Nodemailer

For Gmail, use a Google **App Password** rather than the normal Gmail password.

Email flows now cover:

- Verify email.
- Welcome email.
- Forgot/reset password.
- Password changed security notification.
- Google account linked security notification.
- Guide application/status emails already used by the Guide verification/admin flow.

The reset and verification emails contain real frontend links based on `FRONTEND_URL`.

## 6. Auth flows

### Local Traveler

`Register -> Check Email -> Verify Email -> User Home`

### Local Guide

`Register -> Check Email -> Verify Email -> Guide Verification -> Upload Documents -> Submit -> Application Received`

Creating a Guide account no longer uploads verification documents inside the registration request. This avoids partially-created accounts when a later upload fails.

### Google from Register

If a role was selected in Register:

`Choose role -> Continue with Google -> Create account -> destination`

For a Guide, the destination is Guide Verification until approval.

### Google from Login / Register with no role

`Continue with Google -> Choose Role (one time) -> Create account -> destination`

### Google email matches an existing local Nefru account

`Continue with Google -> Confirm current Nefru password -> Link Google -> Sign in`

The project deliberately does **not** silently merge accounts based only on matching email.

## 7. Session/cookie deployment notes

The browser frontend uses an HttpOnly `nefru_session` cookie. All frontend API calls use `credentials: "include"`.

For same-site development, keep:

```env
COOKIE_SAME_SITE=lax
```

For a production setup where the frontend and API are truly cross-site, use HTTPS and:

```env
NODE_ENV=production
COOKIE_SAME_SITE=none
```

The server automatically marks the auth cookie `Secure` in production. `FRONTEND_URL` must exactly match the allowed browser origin because it is used for CORS and the cookie-origin CSRF guard.

If frontend and API are served under the same site/domain family, prefer a same-site deployment where possible.

## 8. Guide authorization

A Guide may sign in while verification is `draft`, `pending`, or `rejected`, but tour creation/edit flow is protected until:

```text
verificationStatus === "approved"
```

This is enforced on both frontend routing and protected backend trip routes.

## 9. Main auth endpoints

```text
POST  /api/auth/register
POST  /api/auth/login
POST  /api/auth/logout
POST  /api/auth/google
POST  /api/auth/google/complete-signup
POST  /api/auth/google/link
POST  /api/auth/verify-email
POST  /api/auth/resend-verification
POST  /api/auth/forgot-password
POST  /api/auth/reset-password/verify
POST  /api/auth/reset-password
PATCH /api/auth/change-password
```

## 10. Before production

- Use strong production values for `JWT_SECRET` and database credentials.
- Configure production Google JavaScript origins.
- Configure the real `FRONTEND_URL` and `VITE_API_BASE_URL`.
- Use HTTPS.
- Keep `.env` files out of Git.
- Consider replacing the in-memory rate limiter with Redis/shared storage if the backend runs on multiple instances.
- Run the normal application integration tests against your real MongoDB test database, SMTP account, and Google OAuth client before deployment.
