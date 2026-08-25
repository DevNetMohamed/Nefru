import dotenv from "dotenv";

dotenv.config();

const nodeEnv = process.env.NODE_ENV || "development";
const jwtSecret =
  process.env.JWT_SECRET ||
  (nodeEnv === "production" ? "" : "dev-only-change-me");
const frontendUrl = (process.env.FRONTEND_URL || "http://localhost:5173").replace(
  /\/+$/,
  "",
);
const requestedSameSite = String(
  process.env.COOKIE_SAME_SITE || (nodeEnv === "production" ? "none" : "lax"),
).toLowerCase();
const cookieSameSite = ["lax", "strict", "none"].includes(requestedSameSite)
  ? requestedSameSite
  : "lax";
const devAuthBypass =
  nodeEnv === "development" &&
  String(process.env.DEV_AUTH_BYPASS || "false").toLowerCase() !== "false";

if (nodeEnv === "production" && !jwtSecret) {
  throw new Error("JWT_SECRET must be configured in production");
}

export const env = {
  nodeEnv,
  port: Number(process.env.PORT) || 5000,
  mongoUri: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/nefru",

  jwtSecret,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  frontendUrl,
  cookieSameSite,
  googleClientId: process.env.GOOGLE_CLIENT_ID || "91221898814-uemk7pdvf01si76c33f6ksvrui17eitf.apps.googleusercontent.com",
  devAuthBypass,
  stripeSecretKey: process.env.STRIPE_SECRET_KEY || "",
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET || "",

  // Email Configurations
  mailerHost: process.env.MAILER_HOST || "smtp.gmail.com",
  mailerPort: Number(process.env.MAILER_PORT) || 465,
  mailerEmail: process.env.MAILER_EMAIL || "nefru.team@gmail.com",
  mailerPassword: process.env.MAILER_PASSWORD || "hlph mbwj nwdo fojd",

  // Example Users
  emailAdmin: process.env.EMAIL_ADMIN || "superadmin@nefru.com",
  passwordAdmin: process.env.PASSWORD_ADMIN || "superpassword",
  emailTourist: process.env.EMAIL_TOURIST || "tourist@test.com",
  passwordTourist: process.env.PASSWORD_TOURIST || "Tourist123456",
  emailGuide: process.env.EMAIL_GUIDE || "guide@test.com",
  passwordGuide: process.env.PASSWORD_GUIDE || "Guide123456",
};
