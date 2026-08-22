import { env } from "../config/env.js";
import { AUTH_COOKIE_NAME, getCookieValue } from "../utils/authSession.js";

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

export function csrfOriginGuard(req, res, next) {
  if (SAFE_METHODS.has(req.method)) return next();

  // Bearer-token API clients are not authenticated by browser cookies and are
  // therefore not subject to cookie-based CSRF in this middleware.
  const sessionCookie = getCookieValue(req, AUTH_COOKIE_NAME);
  if (!sessionCookie) return next();

  const origin = req.get("origin");
  if (!origin || origin === env.frontendUrl) return next();

  return res.status(403).json({
    success: false,
    message: "Request origin is not allowed",
  });
}
