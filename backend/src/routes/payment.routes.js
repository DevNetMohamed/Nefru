import { Router } from "express";

import {
  createPaymentIntent,
  createSetupIntent,
  deletePaymentMethod,
  listPaymentMethods,
  payWithSavedCard,
  setDefaultPaymentMethod,
  verifyPayment,
} from "../controllers/payment.controller.js";
import { authorizeRoles, protect } from "../middlewares/authMiddleware.js";

const paymentRouter = Router();
paymentRouter.use(protect, authorizeRoles("tourist"));
paymentRouter.post("/create-intent", createPaymentIntent);
paymentRouter.post("/pay-with-saved-card", payWithSavedCard);
paymentRouter.post("/verify", verifyPayment);
paymentRouter.get("/methods", listPaymentMethods);
paymentRouter.post("/methods/setup-intent", createSetupIntent);
paymentRouter.patch("/methods/:paymentMethodId/default", setDefaultPaymentMethod);
paymentRouter.delete("/methods/:paymentMethodId", deletePaymentMethod);

export default paymentRouter;
