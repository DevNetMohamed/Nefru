import express from "express";
const router = express.Router();
import {getAccountsAll, getDashboard} from "../controllers/Admin/Admin.controller.js"
// Accounts (Tourists , Guide & Admins)
// get all accounts
router.get("/dashboard",getDashboard)
router.get("/accounts/:role/:page",getAccountsAll)
export default router;
