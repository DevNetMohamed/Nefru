import express from "express";
// const router = express.Router();
// import {authAdminController} from "../controllers/Auth/authAdmin.controller"
import {getAccountsAll} from "../controllers/Admin/Admin.controller"
// router.post("/login", authAdminController.loginAdmin);
// Accounts (Tourists , Guide & Admins)
// get all accounts
asdkajsh
router.get("/accounts/:page",getAccountsAll)
export default router;
