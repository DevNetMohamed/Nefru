import { User } from "../models/user.model.js";
import { generateToken } from "../utils/generateToken.js";

export async function loginAdminService({ email, password }) {
  const admin = await User.findOne({
    email: email.toLowerCase(),
    role: "admin",
  }).select("+password +tokenVersion");

  if (!admin || !(await admin.comparePassword(password))) {
    const error = new Error("Invalid admin credentials");
    error.statusCode = 401;
    error.code = "UNAUTHORIZED";
    throw error;
  }

  return {
    admin: {
      id: admin._id,
      email: admin.email,
      role: admin.role,
    },
    token: generateToken(admin),
  };
}
