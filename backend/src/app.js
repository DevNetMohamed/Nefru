import express from "express";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

import { env } from "./config/env.js";
import apiRouter from "./routes/index.js";
import { notFound } from "./middlewares/notFound.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { csrfOriginGuard } from "./middlewares/csrfOriginGuard.js";
import { handleStripeWebhook } from "./controllers/payment.controller.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("trust proxy", 1);
app.use(
  cors({
    origin: env.frontendUrl,
    credentials: true,
  }),
);
app.use(morgan("dev"));
app.post(
  "/api/payments/webhook",
  express.raw({ type: "application/json" }),
  handleStripeWebhook,
);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(csrfOriginGuard);
app.use("/uploads", express.static("public/uploads"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api", apiRouter);

app.use(notFound);
app.use(errorHandler);

export default app;
