import express from "express";
const router = express.Router();
import {
    getAllUsers,
    getAccountsAll,
    getDashboard,
    getTrips} from "../controllers/Admin/Admin.controller.js"

router.get("/dashboard",getDashboard)
router.get("/accounts/admin/users",getAllUsers)
router.get("/accounts/admin/users/:id",getAccountsAll)
router.get("/accounts",getAccountsAll)

router.get("/trips/:page",getTrips)

export default router;
