import express from "express";
const router = express.Router();
import {
    getDashboard,
    getAllUsers,
    getUserById,
    updateUserById,
    banUserById,
    unbanUserById,
    deleteUserById,
    guideActivation,
    getAllTours,
    getTourById,
    tourAction
} from "../controllers/Admin/Admin.controller.js"

// Dashboard
router.get("/dashboard",getDashboard)
// router.get("/analytics",getAnalytics)
// router.get("/activity",getActivity)

// User Management
router.get("/user",getAllUsers)
router.get("/user/:id",getUserById)

router.patch("/user/:id",updateUserById)
router.patch("/user/:id/ban",banUserById)
router.patch("/user/:id/unban",unbanUserById)

router.delete("/user/:id",deleteUserById)

router.patch("/guide/:id/approve",guideActivation)
router.patch("/guide/:id/reject",guideActivation)
router.patch("/guide/:id/suspend",guideActivation)

// CMS
// router.get("/blogs")
// router.post("/blogs")
// router.get("/blogs/:")
// router.patch("/blogs/:id")
// router.delete("/blogs/:id")
// router.patch("/blogs/:id/publish")

// Tours created by guide
router.get("/tours/:page", getAllTours)
router.get("/tour/:id", getTourById)
// router.patch("/tour/:id/approve",tourAction)
// router.patch("/tour/:id/reject",tourAction)
// router.delete("/tour/:id")

export default router;
