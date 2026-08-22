import { env } from "../config/env.js";

export const AUTH_COOKIE_NAME = "nefru_session";
const REMEMBER_ME_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

function cookieBaseOptions() {
  return {
    httpOnly: true,
    secure: env.nodeEnv === "production",
    sameSite: env.cookieSameSite,
    path: "/",
  };
}

export function setAuthCookie(res, token, rememberMe = false) {
  const options = cookieBaseOptions();

  if (rememberMe) {
    options.maxAge = REMEMBER_ME_MAX_AGE;
  }

  res.cookie(AUTH_COOKIE_NAME, token, options);
}

export function clearAuthCookie(res) {
  res.clearCookie(AUTH_COOKIE_NAME, cookieBaseOptions());
}

export function getCookieValue(req, name) {
  const header = req.headers.cookie;
  if (!header) return null;

  for (const part of header.split(";")) {
    const [rawKey, ...rawValue] = part.trim().split("=");
    if (rawKey === name) {
      return decodeURIComponent(rawValue.join("="));
    }
  }

  return null;
}
