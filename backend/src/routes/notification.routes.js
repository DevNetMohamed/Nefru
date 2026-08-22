import { Router } from "express";

import {
  getMyNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "../controllers/notification.controller.js";
import { protect } from "../middlewares/authMiddleware.js";

const notificationRouter = Router();

notificationRouter.use(protect);

notificationRouter.get("/", getMyNotifications);
notificationRouter.patch("/read-all", markAllNotificationsRead);
notificationRouter.patch("/:id/read", markNotificationRead);

export default notificationRouter;

