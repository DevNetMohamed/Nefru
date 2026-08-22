# Authentication and profile integration

## Account identity rules

- Email matching is case-insensitive and trims surrounding whitespace.
- A local-password account and a Google identity with the same email are treated as one person, not two independent accounts.
- Google sign-in for an existing local email asks the user to confirm the existing password before the identities are merged.
- A signed-in user can connect Google from **Sign-in & Security**. The Google email must match the Nefru account email.
- Google can only be disconnected after the account has a local password, so the user cannot lock themselves out.
- If legacy duplicates have the same role, the merge keeps the local account as the canonical account, copies missing profile data, moves guide verification data, connects Google, and deactivates the duplicate.
- If duplicate accounts have different roles, the automatic merge stops with `ACCOUNT_ROLE_CONFLICT` instead of silently losing role-specific data.

## Guide onboarding

After role selection and document upload, the guide stays authenticated and is sent to:

`/guide/application-received`

The page is inside `GuidePortalLayout`, so the normal guide header, sidebar, mobile navigation, profile access, and session remain available while the application is pending.

## Profile data

Tourist and guide pages now read their values from the authenticated backend profile and persist edits back to it. Both roles support profile-photo upload through `POST /api/users/profile/avatar`.

Google supplies only the fields present in its ID token, normally name, email, picture, and locale. Phone number, date of birth, gender, nationality, guide experience, languages, specialties, headline, location, and biography are not supplied by basic Google Sign-In; users complete those fields in the profile editor and they are stored in MongoDB.

## Security endpoints

- `POST /api/auth/google` — sign in, start onboarding, or request confirmation before linking an existing account.
- `POST /api/auth/google/link` — confirm an existing password and merge/link the Google identity.
- `POST /api/auth/google/connect` — connect Google while already signed in.
- `DELETE /api/auth/google/connect` — disconnect Google when a local password exists.
- `PATCH /api/auth/change-password` — change a password or create the first local password for a Google-only account.
- `GET/PATCH /api/users/profile/me` — load or update the authenticated role profile.

## Required local configuration

Copy `backend/.env.example` to `backend/.env` and `frontend/.env.example` to `frontend/.env`, then set the same Google Web Client ID in `GOOGLE_CLIENT_ID` and `VITE_GOOGLE_CLIENT_ID`. Never commit the real mail app password, JWT secret, or production `.env` files.

For Google Cloud, add the actual frontend origins, such as `http://localhost:5173`, under **Authorized JavaScript origins**.
