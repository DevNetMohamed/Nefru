import { Router } from "express";
import {
  createPaymentIntent,
  confirmPayment,
  handleStripeWebhook,
} from "../controllers/payment.controller.js";
import { protect } from "../middlewares/authMiddleware.js";

const paymentRouter = Router();

// 1. إنشاء نية الدفع من Stripe (مجهّز بـ Client Secret)
paymentRouter.post("/create-intent", protect, createPaymentIntent);

// 2. تأكيد العملية بعد النجاح في الفلاونت إند
paymentRouter.post("/confirm", protect, confirmPayment);

// 3. مسار Webhook للاستقبال التلقائي من Stripe
paymentRouter.post("/webhook", handleStripeWebhook);

export default paymentRouter;
