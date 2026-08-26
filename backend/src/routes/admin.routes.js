import express from "express";

import {
  banUserById,
  deleteUserById,
  getBookings,
  getAllTours,
  getAllUsers,
  getDashboard,
  getTourById,
  getUserById,
  guideActivation,
  unbanUserById,
  updateUserById,
  updateTripStatus,
} from "../controllers/Admin/Admin.controller.js";
import { authorizeRoles, protect } from "../middlewares/authMiddleware.js";
import { createRateLimiter } from "../utils/rateLimiter.js";

const router = express.Router();

router.use(protect, authorizeRoles("admin"));

// Generous abuse guard: admin APIs are sensitive even for authenticated admins.
const adminLimiter = createRateLimiter({
  name: "admin-api",
  windowMs: 60 * 1000,
  max: 120,
});

router.use(adminLimiter);

// Dashboard
router.get("/dashboard", getDashboard);

// User Management
router.get("/user", getAllUsers);
router.get("/user/:id", getUserById);
router.patch("/user/:id", updateUserById);
router.patch("/user/:id/ban", banUserById);
router.patch("/user/:id/unban", unbanUserById);
router.delete("/user/:id", deleteUserById);

// Guide verification review
router.patch("/guide/:id/approve", guideActivation("approve"));
router.patch("/guide/:id/reject", guideActivation("reject"));
router.patch("/guide/:id/suspend", guideActivation("suspend"));

// Tours created by guides
router.get("/tours/:page", getAllTours);
router.get("/trip/:id", getTourById);
router.patch("/trip/:id/status", updateTripStatus);

// Bookings (read-only)
router.get("/bookings/:page", getBookings);

export default router;
