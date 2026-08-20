import crypto from "crypto";

import { env } from "../config/env.js";

const GOOGLE_JWKS_URL = "https://www.googleapis.com/oauth2/v3/certs";
const VALID_ISSUERS = new Set(["accounts.google.com", "https://accounts.google.com"]);

let cachedKeys = null;
let keysExpireAt = 0;

function decodeBase64Url(value) {
  return Buffer.from(value, "base64url");
}

function parseJwtPart(value) {
  return JSON.parse(decodeBase64Url(value).toString("utf8"));
}

function getMaxAge(cacheControl) {
  const match = String(cacheControl || "").match(/max-age=(\d+)/i);
  return match ? Number(match[1]) : 3600;
}

async function getGoogleKeys() {
  if (cachedKeys && Date.now() < keysExpireAt) return cachedKeys;

  const response = await fetch(GOOGLE_JWKS_URL);
  if (!response.ok) {
    throw new Error("Unable to retrieve Google signing keys");
  }

  const data = await response.json();
  cachedKeys = data.keys || [];
  const maxAge = getMaxAge(response.headers.get("cache-control"));
  keysExpireAt = Date.now() + maxAge * 1000;

  return cachedKeys;
}

export async function verifyGoogleIdToken(idToken) {
  if (!env.googleClientId) {
    throw new Error("Google sign-in is not configured on the server");
  }

  if (!idToken || typeof idToken !== "string") {
    throw new Error("Google credential is required");
  }

  const parts = idToken.split(".");
  if (parts.length !== 3) {
    throw new Error("Invalid Google credential");
  }

  const [encodedHeader, encodedPayload, encodedSignature] = parts;
  const header = parseJwtPart(encodedHeader);
  const payload = parseJwtPart(encodedPayload);

  if (header.alg !== "RS256" || !header.kid) {
    throw new Error("Invalid Google credential");
  }

  let keys = await getGoogleKeys();
  let jwk = keys.find((key) => key.kid === header.kid);

  // Google rotates keys. Force one refresh if this kid is new.
  if (!jwk) {
    keysExpireAt = 0;
    keys = await getGoogleKeys();
    jwk = keys.find((key) => key.kid === header.kid);
  }

  if (!jwk) {
    throw new Error("Unable to verify Google credential");
  }

  const publicKey = crypto.createPublicKey({ key: jwk, format: "jwk" });
  const signingInput = Buffer.from(`${encodedHeader}.${encodedPayload}`);
  const signature = decodeBase64Url(encodedSignature);
  const validSignature = crypto.verify(
    "RSA-SHA256",
    signingInput,
    publicKey,
    signature,
  );

  if (!validSignature) {
    throw new Error("Invalid Google credential signature");
  }

  const now = Math.floor(Date.now() / 1000);
  const audienceMatches = Array.isArray(payload.aud)
    ? payload.aud.includes(env.googleClientId)
    : payload.aud === env.googleClientId;

  if (!audienceMatches) throw new Error("Google credential audience mismatch");
  if (!VALID_ISSUERS.has(payload.iss)) throw new Error("Invalid Google credential issuer");
  if (!payload.exp || Number(payload.exp) <= now) throw new Error("Google credential has expired");
  if (!payload.sub || !payload.email) throw new Error("Google account information is incomplete");
  if (payload.email_verified !== true) throw new Error("Google email is not verified");

  return payload;
}
