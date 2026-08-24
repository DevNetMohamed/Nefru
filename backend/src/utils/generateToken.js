import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export const generateToken = (user) => {
  const userId = user?._id || user?.id || user;
  const tokenVersion = Number(user?.tokenVersion ?? 0);

  return jwt.sign({ id: userId, tokenVersion }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });
};
