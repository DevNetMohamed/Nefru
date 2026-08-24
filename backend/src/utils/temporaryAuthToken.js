import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export function createTemporaryAuthToken(payload, expiresIn = "10m") {
  return jwt.sign(payload, env.jwtSecret, { expiresIn });
}

export function verifyTemporaryAuthToken(token, expectedPurpose) {
  const payload = jwt.verify(token, env.jwtSecret);

  if (!payload || payload.purpose !== expectedPurpose) {
    throw new Error("Invalid or expired authentication token");
  }

  return payload;
}
