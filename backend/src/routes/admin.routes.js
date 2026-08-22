import express from "express";

import {
  banUserById,
  deleteUserById,
  getAllTours,
  getAllUsers,
  getDashboard,
  getTourById,
  getUserById,
  guideActivation,
  unbanUserById,
  updateUserById,
} from "../controllers/Admin/Admin.controller.js";
import { authorizeRoles, protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(protect, authorizeRoles("admin"));

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
router.patch("/guide/:id/approve", guideActivation);
router.patch("/guide/:id/reject", guideActivation);
router.patch("/guide/:id/suspend", guideActivation);

// Tours created by guides
router.get("/tours/:page", getAllTours);
router.get("/trip/:id", getTourById);

export default router;
