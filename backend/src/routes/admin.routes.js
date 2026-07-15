import express from "express";
const router = express.Router();
import {getAccountsAll, getDashboard, getTrips} from "../controllers/Admin/Admin.controller.js"

router.get("/dashboard",getDashboard)
router.get("/accounts/:role/:page",getAccountsAll)

router.get("/trips/:page",getTrips)

export default router;
