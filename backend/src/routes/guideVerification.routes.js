import { Router } from "express";

import { verificationUpload } from "../config/verificationUpload.js";
import {
  downloadVerificationDocument,
  getMyVerification,
  replaceVerificationDocument,
  resubmitVerification,
  submitVerification,
  uploadVerificationDocument,
} from "../controllers/guideVerification.controller.js";
import { validateVerificationDocumentUpload } from "../controllers/validation/guideVerificationValidation.js";
import { authorizeRoles, protect } from "../middlewares/authMiddleware.js";

const guideVerificationRouter = Router();

guideVerificationRouter.get(
  "/me",
  protect,
  authorizeRoles("guide"),
  getMyVerification,
);

guideVerificationRouter.get(
  "/documents/:documentId/file",
  protect,
  downloadVerificationDocument,
);

guideVerificationRouter.post(
  "/documents",
  protect,
  authorizeRoles("guide"),
  verificationUpload.single("document"),
  validateVerificationDocumentUpload,
  uploadVerificationDocument,
);

guideVerificationRouter.patch(
  "/documents/:documentId",
  protect,
  authorizeRoles("guide"),
  verificationUpload.single("document"),
  validateVerificationDocumentUpload,
  replaceVerificationDocument,
);

guideVerificationRouter.post(
  "/submit",
  protect,
  authorizeRoles("guide"),
  submitVerification,
);

guideVerificationRouter.post(
  "/resubmit",
  protect,
  authorizeRoles("guide"),
  resubmitVerification,
);

export default guideVerificationRouter;
