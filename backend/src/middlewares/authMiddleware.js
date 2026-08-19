import jwt from "jsonwebtoken";

import { env } from "../config/env.js";
import { User } from "../models/user.model.js";
import { GuideProfile } from "../models/guide.model.js";

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401);
      throw new Error("Not authorized");
    }

    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ msg: "No token, authorization denied" });
    }

    const decoded = jwt.verify(token, env.jwtSecret);

    const user = await User.findById(decoded.id);

    if (!user || user.status !== "active") {
      return res
        .status(401)
        .json({ msg: "User not found or inactive, authorization denied" });
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401);
    next(new Error("Not authorized"));
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
