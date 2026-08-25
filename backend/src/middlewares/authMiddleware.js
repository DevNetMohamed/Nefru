import jwt from "jsonwebtoken";

import { env } from "../config/env.js";
import { GuideProfile } from "../models/guide.model.js";
import { User } from "../models/user.model.js";
import { AUTH_COOKIE_NAME, getCookieValue } from "../utils/authSession.js";

function getRequestToken(req) {
  const authHeader = req.headers.authorization;

  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice(7).trim();
  }

  return getCookieValue(req, AUTH_COOKIE_NAME);
}

const DEV_ROLES = new Set(["admin", "guide", "tourist"]);

async function getDevelopmentUser(req) {
  const requestedRole = String(req.get("x-dev-auth-role") || "tourist")
    .trim()
    .toLowerCase();
  const role = DEV_ROLES.has(requestedRole) ? requestedRole : "tourist";
  const preferredEmail = {
    admin: env.emailAdmin,
    guide: env.emailGuide,
    tourist: env.emailTourist,
  }[role];

  const preferredUser = await User.findOne({
    email: preferredEmail.toLowerCase(),
    role,
    status: "active",
  }).select("+tokenVersion");

  return (
    preferredUser ||
    User.findOne({ role, status: "active" }).select("+tokenVersion")
  );
}

export const protect = async (req, res, next) => {
  try {
    // TEMPORARY DEVELOPMENT BYPASS:
    // Protected endpoints are accessible without a real login during development.
    // A seeded user is still attached to req.user so controllers keep working.
    // Set DEV_AUTH_BYPASS=false to restore normal authentication locally.
    // Production always ignores this bypass and enforces authentication.
    if (env.devAuthBypass) {
      const developmentUser = await getDevelopmentUser(req);

      if (!developmentUser) {
        return res.status(503).json({
          success: false,
          message:
            "Development auth bypass needs a seeded active user for the requested role.",
        });
      }

      req.user = developmentUser;
      req.authBypassed = true;
      return next();
    }

    const token = getRequestToken(req);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }

    const decoded = jwt.verify(token, env.jwtSecret);
    const user = await User.findById(decoded.id).select("+tokenVersion");

    if (!user || user.status !== "active") {
      return res.status(401).json({
        success: false,
        message: "User not found or inactive",
      });
    }

    const tokenVersion = Number(decoded.tokenVersion ?? 0);
    const currentVersion = Number(user.tokenVersion ?? 0);

    if (tokenVersion !== currentVersion) {
      return res.status(401).json({
        success: false,
        message: "Session expired. Please log in again.",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Not authorized",
    });
  }
};

export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    // TEMPORARY DEVELOPMENT BYPASS:
    // Role checks are skipped only while DEV_AUTH_BYPASS is enabled.
    // Production always enforces the allowed roles below.
    if (env.devAuthBypass) return next();

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to perform this action",
        error: { code: "FORBIDDEN" },
      });
    }

    next();
  };
};

export const requireApprovedGuide = async (req, res, next) => {
  try {
    // TEMPORARY DEVELOPMENT BYPASS:
    // Guides can use guide features before their verification is approved.
    // Set DEV_AUTH_BYPASS=false to restore the approval requirement locally.
    // Production always enforces the verification-status check below.
    if (env.devAuthBypass) {
      req.guideProfile = await GuideProfile.findOne({
        user: req.user._id,
      }).select("_id verificationStatus");
      return next();
    }

    if (req.user.role !== "guide") {
      return res.status(403).json({
        success: false,
        message: "Guide access only",
        error: { code: "GUIDE_ONLY" },
      });
    }

    const guideProfile = await GuideProfile.findOne({
      user: req.user._id,
    }).select("_id verificationStatus");

    if (!guideProfile) {
      return res.status(404).json({
        success: false,
        message: "Guide profile not found",
        error: { code: "GUIDE_PROFILE_NOT_FOUND" },
      });
    }

    if (guideProfile.verificationStatus !== "approved") {
      return res.status(403).json({
        success: false,
        message: "Guide account is not approved",
        error: {
          code: "GUIDE_NOT_APPROVED",
          verificationStatus: guideProfile.verificationStatus,
        },
      });
    }

    req.guideProfile = guideProfile;
    next();
  } catch (error) {
    next(error);
  }
};
