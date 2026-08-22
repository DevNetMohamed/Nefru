import dotenv from "dotenv";

dotenv.config();

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 5000,

<<<<<<< HEAD
<<<<<<< HEAD
  mongoUri:
    process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/nefru",

=======
>>>>>>> parent of 00a7b75 (Auth Refactor with Nodemailer)
=======
>>>>>>> parent of 00a7b75 (Auth Refactor with Nodemailer)
  jwtSecret: process.env.JWT_SECRET || "L6-210+1",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",


  // Email Configurations
  mailerHost: process.env.MAILER_HOST || "smtp.gmail.com",
  mailerPort: Number(process.env.MAILER_PORT) || 465,
  mailerEmail: process.env.MAILER_EMAIL || "yousefismail51@gmail.com",
  mailerPassword: process.env.MAILER_PASSWORD || "ncat nzbt zmug gksb",

  //Example Users
  emailAdmin: process.env.EMAIL_ADMIN || "superadmin@nefru.com",
  passwordAdmin: process.env.PASSWORD_ADMIN || "superpassword",

  emailTourist: process.env.EMAIL_TOURIST || "tourist@test.com",
  passwordTourist: process.env.PASSWORD_TOURIST || "Tourist123456",

  emailGuide: process.env.EMAIL_GUIDE || "guide@test.com",
  passwordGuide: process.env.PASSWORD_GUIDE || "Guide123456",
};

// EMAIL_TOURIST=tourist@test.com
// PASSWORD_TOURIST=Tourist123456

// EMAIL_GUIDE=guide@test.com
// PASSWORD_GUIDE=Guide123456
