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

export const protect = async (req, res, next) => {
  try {
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
