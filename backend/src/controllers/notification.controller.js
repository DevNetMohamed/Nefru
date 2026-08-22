import mongoose from "mongoose";

import { Notification } from "../models/notification.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getMyNotifications = asyncHandler(async (req, res) => {
  const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(
    Math.max(Number.parseInt(req.query.limit, 10) || 20, 1),
    100,
  );
  const query = { user: req.user._id };

  if (req.query.unread === "true") {
    query.isRead = false;
  }

  const [notifications, total, unreadCount] = await Promise.all([
    Notification.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Notification.countDocuments(query),
    Notification.countDocuments({ user: req.user._id, isRead: false }),
  ]);

  res.status(200).json({
    success: true,
    data: { notifications },
    meta: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
      unreadCount,
    },
  });
});

export const markNotificationRead = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(400);
    throw new Error("Invalid notification id");
  }

  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { $set: { isRead: true } },
    { new: true },
  );

  if (!notification) {
    res.status(404);
    throw new Error("Notification not found");
  }

  res.status(200).json({
    success: true,
    message: "Notification marked as read",
    data: { notification },
  });
});

export const markAllNotificationsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany(
    { user: req.user._id, isRead: false },
    { $set: { isRead: true } },
  );

  res.status(200).json({
    success: true,
    message: "All notifications marked as read",
  });
});

