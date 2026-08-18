import dotenv from "dotenv";

dotenv.config();

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 5000,

  mongoUri:
    process.env.MONGO_URI || "mongodb://127.0.0.1:27017/nefru",

  jwtSecret: process.env.JWT_SECRET || "L6-210+1",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",

  emailAdmin: process.env.EMAIL_ADMIN || "superadmin@nefru.com",
  passwordAdmin: process.env.PASSWORD_ADMIN || "superpassword",

  emailTourist: process.env.EMAIL_TOURIST || "tourist@test.com",
  passwordTourist: process.env.PASSWORD_TOURIST || "Tourist123456",

  emailGuide: process.env.EMAIL_GUIDE || "guide@test.com",
  passwordGuide: process.env.PASSWORD_GUIDE || "Guide123456",
};