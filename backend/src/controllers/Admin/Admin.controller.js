import mongoose from "mongoose";

import { User, USER_ROLES } from "../../models/user.model.js";
import { Trip } from "../../models/trip.model.js";
import { Booking } from "../../models/booking.model.js";
import { GuideProfile } from "../../models/guide.model.js";
import { TouristProfile } from "../../models/tourist.model.js";
import { GuideVerification } from "../../models/guideVerification.model.js";
import { Notification } from "../../models/notification.model.js";
import { sendEmail } from "../../utils/sendEmail.js";

import { getDashboardData } from "./services.js";

const USERS_PAGE_LIMIT = 10;
const TOURS_PAGE_LIMIT = 10;
const BOOKINGS_PAGE_LIMIT = 10;
const USER_STATUSES = ["active", "pending", "deactivated"];

export const getDashboard = async (req, res) => {
  try {
    const data = await getDashboardData();
    return res.status(200).json({
      success: true,
      message: "Operation completed successfully",
      data,
    });
  } catch (error) {
    console.error("Error loading dashboard:", error);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred while retrieving dashboard data",
      error: { code: "INTERNAL_SERVER_ERROR", details: [] },
    });
  }
};

function isValidObjectId(value) {
  return Boolean(value) && mongoose.Types.ObjectId.isValid(value);
}

// Shared windowed pagination view: [1, mid-1..mid+1, last]
function buildPagingView(currentPage, totalPages) {
  if (totalPages <= 3) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);
  const view = Array.from({ length: end - start + 1 }, (_, i) => start + i);
  return [1, ...view, totalPages];
}

export const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!isValidObjectId(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
        error: { code: "VALIDATION_ERROR", details: ["The provided user ID is not a valid format"] },
      });
    }

    const user = await User.findById(userId).populate(
      "profileId",
      "fullName avatar verificationStatus",
    );
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        error: { code: "NO_CONTENT_ERROR", details: ["User not registered"] },
      });
    }

    const plain = user.toObject();
    return res.status(200).json({
      success: true,
      message: "Operation completed successfully",
      data: {
        ...plain,
        fullName: plain.profileId?.fullName || "",
        avatar: plain.profileId?.avatar || "",
        verificationStatus: plain.profileId?.verificationStatus,
      },
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred while fetching account",
      error: { code: "INTERNAL_SERVER_ERROR", details: [] },
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const { role, page } = req.query;

    if (!role || !page || !USER_ROLES.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid request",
        error: { code: "INVALID_REQUEST", details: [`role must be one of: ${USER_ROLES.join(", ")}, page must be a positive integer`] },
      });
    }

    const currentPage = parseInt(page, 10);
    if (isNaN(currentPage) || currentPage < 1) {
      return res.status(400).json({
        success: false,
        message: "Invalid page parameter",
        error: { code: "VALIDATION_ERROR", details: ["Page must be a positive integer"] },
      });
    }

    const SKIP = (currentPage - 1) * USERS_PAGE_LIMIT;

    const [users, total, touristCount, guideCount, adminCount] = await Promise.all([
      User.find({ role })
        .sort({ createdAt: -1 })
        .skip(SKIP)
        .limit(USERS_PAGE_LIMIT)
        .populate("profileId", "fullName avatar verificationStatus"),
      User.countDocuments({ role }),
      User.countDocuments({ role: "tourist" }),
      User.countDocuments({ role: "guide" }),
      User.countDocuments({ role: "admin" }),
    ]);

    const totalPages = Math.max(1, Math.ceil(total / USERS_PAGE_LIMIT));

    // Guides get an extra verification column.
    const headers =
      role === "guide"
        ? ["USER", "EMAIL", "JOINED", "VERIFICATION", "STATUS"]
        : ["USER", "EMAIL", "JOINED", "STATUS"];

    // Flatten profile fields so clients render rows without extra lookups.
    const rows = users.map((user) => {
      const plain = user.toObject();
      return {
        ...plain,
        fullName: plain.profileId?.fullName || "",
        avatar: plain.profileId?.avatar || "",
        verificationStatus: plain.profileId?.verificationStatus,
      };
    });

    return res.status(200).json({
      success: true,
      message: "Operation completed successfully",
      data: rows,
      meta: {
        totalRecords: total,
        totalPages,
        recordsCount: rows.length,
        currentPage,
        pagingView: buildPagingView(currentPage, totalPages),
        headers,
        types: USER_ROLES,
        roleCounts: { tourist: touristCount, guide: guideCount, admin: adminCount },
      },
    });
  } catch (error) {
    console.error("Error listing accounts:", error);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred while fetching accounts",
      error: { code: "INTERNAL_SERVER_ERROR", details: [] },
    });
  }
};

// Only a controlled set of fields may be edited via this endpoint.
// Role/status escalation and password changes must go through dedicated flows.
const USER_EDITABLE_FIELDS = ["status"];

export const updateUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!isValidObjectId(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
        error: { code: "VALIDATION_ERROR", details: ["The provided user ID is not a valid format"] },
      });
    }

    const requested = Object.keys(req.body || {});
    if (requested.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No fields to update",
        error: { code: "VALIDATION_ERROR", details: ["Request body is empty"] },
      });
    }

    const rejected = requested.filter((field) => !USER_EDITABLE_FIELDS.includes(field));
    if (rejected.length > 0) {
      return res.status(400).json({
        success: false,
        message: "These fields cannot be updated through this endpoint",
        error: { code: "VALIDATION_ERROR", details: [`Not editable: ${rejected.join(", ")}`] },
      });
    }

    if (!USER_STATUSES.includes(req.body.status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
        error: { code: "VALIDATION_ERROR", details: [`status must be one of: ${USER_STATUSES.join(", ")}`] },
      });
    }

    if (userId === String(req.user?._id || "")) {
      return res.status(400).json({
        success: false,
        message: "You cannot change your own account status",
        error: { code: "VALIDATION_ERROR", details: ["Self-status change is not allowed"] },
      });
    }

    const target = await User.findById(userId);
    if (!target) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        error: { code: "NO_CONTENT_ERROR", details: ["User not registered"] },
      });
    }
    if (target.role === "admin") {
      return res.status(400).json({
        success: false,
        message: "Admin accounts cannot be modified through this endpoint",
        error: { code: "VALIDATION_ERROR", details: ["Admin accounts are protected"] },
      });
    }

    target.status = req.body.status;
    await target.save();

    return res.status(200).json({
      success: true,
      message: "Operation completed successfully",
      data: target.toObject(),
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        error: { code: "VALIDATION_ERROR", details: Object.values(error.errors).map((e) => e.message) },
      });
    }
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue || {})[0] || "field";
      return res.status(409).json({
        success: false,
        message: "Conflict: a user with this value already exists",
        error: { code: "DUPLICATE_ERROR", details: [`${field} must be unique`] },
      });
    }
    console.error("Error updating user:", error);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred while updating user",
      error: { code: "INTERNAL_SERVER_ERROR", details: [] },
    });
  }
};

export const banUserById = async (req, res) => {
  return setUserStatus(req, res, "deactivated", "ban");
};

export const unbanUserById = async (req, res) => {
  return setUserStatus(req, res, "active", "unban");
};

async function setUserStatus(req, res, nextStatus, verb) {
  try {
    const userId = req.params.id;
    if (!isValidObjectId(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
        error: { code: "VALIDATION_ERROR", details: ["The provided user ID is not a valid format"] },
      });
    }

    if (userId === String(req.user?._id || "")) {
      return res.status(400).json({
        success: false,
        message: `You cannot ${verb} your own account`,
        error: { code: "VALIDATION_ERROR", details: ["Self-action is not allowed"] },
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        error: { code: "NO_CONTENT_ERROR", details: ["User not registered"] },
      });
    }
    if (user.role === "admin") {
      return res.status(400).json({
        success: false,
        message: "Admin accounts cannot be banned or unbanned",
        error: { code: "VALIDATION_ERROR", details: ["Admin accounts are protected"] },
      });
    }

    user.status = nextStatus;
    await user.save();

    return res.status(200).json({
      success: true,
      message: verb === "ban" ? "User banned successfully" : "User unbanned successfully",
      data: user.toObject(),
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
        error: { code: "VALIDATION_ERROR", details: ["The provided user ID is not a valid format"] },
      });
    }
    console.error(`Error during user ${verb}:`, error);
    return res.status(500).json({
      success: false,
      message: `An unexpected error occurred while trying to ${verb} user`,
      error: { code: "INTERNAL_SERVER_ERROR", details: [] },
    });
  }
}

export const deleteUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!isValidObjectId(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
        error: { code: "VALIDATION_ERROR", details: ["The provided user ID is not a valid format"] },
      });
    }

    if (userId === String(req.user?._id || "")) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete your own account",
        error: { code: "VALIDATION_ERROR", details: ["Self-deletion is not allowed"] },
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        error: { code: "NO_CONTENT_ERROR", details: ["User not registered"] },
      });
    }
    if (user.role === "admin") {
      return res.status(400).json({
        success: false,
        message: "Admin accounts cannot be deleted through this endpoint",
        error: { code: "VALIDATION_ERROR", details: ["Admin accounts are protected"] },
      });
    }

    // Cascade so trips/bookings/profiles never dangle.
    const tripFilter = user.role === "guide" ? { guide: user._id } : null;
    if (tripFilter) {
      const tripIds = (await Trip.find(tripFilter).select("_id").lean()).map((t) => t._id);
      if (tripIds.length > 0) {
        await Booking.deleteMany({ trip: { $in: tripIds } });
      }
      await Trip.deleteMany(tripFilter);
      await GuideVerification.deleteMany({ guideProfile: user.profileId });
    }
    await Booking.deleteMany({ tourist: user._id });

    await Promise.all([
      GuideProfile.deleteOne({ user: user._id }),
      TouristProfile.deleteOne({ user: user._id }),
      Notification.deleteMany({ user: user._id }),
    ]);
    await user.deleteOne();

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
      data: { id: userId },
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
        error: { code: "VALIDATION_ERROR", details: ["The provided user ID is not a valid format"] },
      });
    }
    console.error("Error deleting user:", error);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred while deleting user",
      error: { code: "INTERNAL_SERVER_ERROR", details: [] },
    });
  }
}

export const guideActivation = (action) => async (req, res) => {
  try {
    if (!["approve", "reject", "suspend"].includes(action)) {
      return res.status(400).json({
        success: false,
        message: "Action is invalid",
        error: { code: "VALIDATION_ERROR", details: ["Action is not valid"] },
      });
    }

    const userId = req.params.id;
    if (!isValidObjectId(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
        error: { code: "VALIDATION_ERROR", details: ["The provided user ID is not a valid format"] },
      });
    }

    const user = await User.findById(userId);
    if (!user || user.role !== "guide") {
      return res.status(404).json({
        success: false,
        message: "Guide account not found",
        error: { code: "NOT_FOUND", details: [] },
      });
    }

    const guideProfile = await GuideProfile.findOne({ user: user._id }).select(
      "+rejectionReason",
    );
    if (!guideProfile) {
      return res.status(404).json({
        success: false,
        message: "Guide profile not found",
        error: { code: "NOT_FOUND", details: [] },
      });
    }

    let title;
    let message;
    let notificationLink = "/guide/verification";

    if (action === "suspend") {
      // "suspended" is not part of the User.status enum; deactivated is the
      // enum-valid equivalent enforced by auth middleware.
      user.status = "deactivated";
      await user.save();
      title = "Guide account suspended";
      message =
        "Your Nefru guide account has been suspended. Contact support if you need help.";
    } else {
      const nextStatus = action === "approve" ? "approved" : "rejected";
      const reason =
        action === "reject"
          ? String(
              req.body?.rejectionReason ||
                "Please review your verification documents and submit the requested changes.",
            ).trim()
          : "";

      guideProfile.verificationStatus = nextStatus;
      guideProfile.rejectionReason = reason;
      await guideProfile.save();

      const verification = await GuideVerification.findOne({
        guideProfile: guideProfile._id,
      }).select("+reviewHistory +requestedChanges");

      if (verification) {
        verification.reviewedAt = new Date();
        verification.reviewedBy = req.user?._id || null;
        verification.reviewHistory.push({
          status: nextStatus,
          reason,
          reviewedBy: req.user?._id || null,
          reviewedAt: verification.reviewedAt,
        });
        await verification.save();
      }

      if (action === "approve") {
        title = "Your guide account is approved";
        message =
          "Congratulations! Your Nefru guide verification was approved. You can now create and publish tours.";
        notificationLink = "/guide/dashboard";
      } else {
        title = "Changes needed for your guide application";
        message = `Your Nefru guide application needs changes. ${reason}`;
      }
    }

    await Notification.create({
      user: user._id,
      type: "account",
      title,
      message,
      link: notificationLink,
      entityType: "user",
      entityId: user._id,
      metadata: {
        verificationStatus: guideProfile.verificationStatus,
        accountStatus: user.status,
      },
    }).catch(() => {});

    await sendEmail({
      email: user.email,
      subject: title,
      message,
    }).catch((error) => {
      console.error("Guide status email could not be sent:", error.message);
    });

    return res.status(200).json({
      success: true,
      message: "Guide status updated successfully",
      data: {
        user,
        guideProfile,
      },
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
        error: { code: "VALIDATION_ERROR", details: [] },
      });
    }

    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred while updating guide status",
      error: { code: "INTERNAL_SERVER_ERROR", details: [] },
    });
  }
};

export const getAllTours = async (req, res) => {
  try {
    const currentPage = parseInt(req.params.page, 10);
    if (isNaN(currentPage) || currentPage < 1) {
      return res.status(400).json({
        success: false,
        message: "Invalid page parameter",
        error: { code: "VALIDATION_ERROR", details: ["Page must be a positive integer"] },
      });
    }

    // Publication state: published = publicly visible ("active"),
    // unpublished = every other status (draft/reviewing/pending/approved/rejected).
    const state = String(req.query.state || "all").toLowerCase();
    const filter = {};
    if (state === "published") {
      filter.status = "active";
    } else if (state === "unpublished") {
      filter.status = { $ne: "active" };
    } else if (state !== "all") {
      return res.status(400).json({
        success: false,
        message: "Invalid state parameter",
        error: { code: "VALIDATION_ERROR", details: ["state must be one of: all, published, unpublished"] },
      });
    }

    const SKIP = (currentPage - 1) * TOURS_PAGE_LIMIT;

    const [trips, total, totalCount, publishedCount, awaitingReviewCount] = await Promise.all([
      Trip.find(filter)
        .sort({ createdAt: -1 })
        .skip(SKIP)
        .limit(TOURS_PAGE_LIMIT)
        .select("title location status rating image category price createdAt")
        .lean(),
      Trip.countDocuments(filter),
      Trip.countDocuments(),
      Trip.countDocuments({ status: "active" }),
      Trip.countDocuments({ status: { $in: ["reviewing", "pending"] } }),
    ]);

    const totalPages = Math.max(1, Math.ceil(total / TOURS_PAGE_LIMIT));

    return res.status(200).json({
      success: true,
      message: "Operation completed successfully",
      data: trips,
      meta: {
        totalRecords: total,
        totalPages,
        recordsCount: trips.length,
        currentPage,
        pagingView: buildPagingView(currentPage, totalPages),
        headers: ["IMAGE", "NAME", "LOCATION", "STATUS", "RATE"],
        types: ["all", "published", "unpublished"],
        stats: {
          total: totalCount,
          published: publishedCount,
          unpublished: totalCount - publishedCount,
          awaitingReview: awaitingReviewCount,
        },
      },
    });
  } catch (error) {
    console.error("Error listing tours:", error);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred while fetching tours",
      error: { code: "INTERNAL_SERVER_ERROR", details: [] },
    });
  }
}

export const getTourById = async (req, res) => {
  try {
    const tripId = req.params.id;
    if (!isValidObjectId(tripId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid trip ID",
        error: { code: "VALIDATION_ERROR", details: ["The provided trip ID is not a valid format"] },
      });
    }

    const trip = await Trip.findById(tripId).lean();
    if (!trip) {
      return res.status(404).json({
        success: false,
        message: "Trip not found",
        error: { code: "NO_CONTENT_ERROR", details: ["Trip not registered"] },
      });
    }

    return res.status(200).json({
      success: true,
      message: "Operation completed successfully",
      data: trip,
    });
  } catch (error) {
    console.error("Error fetching tour:", error);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred while fetching tour",
      error: { code: "INTERNAL_SERVER_ERROR", details: [] },
    });
  }
}

// Trip moderation / publication. Public visibility requires status "active".
// Primary actions: publish -> active, hide -> draft (unpublished), reject.
// approve/suspend kept as legacy aliases of publish/hide.
const TRIP_ACTION_MAP = {
  publish: "active",
  hide: "draft",
  reject: "rejected",
  approve: "active",
  suspend: "draft",
};

export const updateTripStatus = async (req, res) => {
  try {
    const action = String(req.body?.action || "").toLowerCase();
    const nextStatus = TRIP_ACTION_MAP[action];
    if (!nextStatus) {
      return res.status(400).json({
        success: false,
        message: "Action is invalid",
        error: { code: "VALIDATION_ERROR", details: [`action must be one of: ${Object.keys(TRIP_ACTION_MAP).join(", ")}`] },
      });
    }

    const tripId = req.params.id;
    if (!isValidObjectId(tripId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid trip ID",
        error: { code: "VALIDATION_ERROR", details: ["The provided trip ID is not a valid format"] },
      });
    }

    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({
        success: false,
        message: "Trip not found",
        error: { code: "NO_CONTENT_ERROR", details: ["Trip not registered"] },
      });
    }

    if (trip.status === nextStatus) {
      return res.status(200).json({
        success: true,
        message: `Trip is already ${nextStatus}`,
        data: trip.toObject(),
      });
    }

    trip.status = nextStatus;
    await trip.save();

    return res.status(200).json({
      success: true,
      message: `Trip ${action}d successfully`,
      data: trip.toObject(),
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        error: { code: "VALIDATION_ERROR", details: Object.values(error.errors).map((e) => e.message) },
      });
    }
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid trip ID",
        error: { code: "VALIDATION_ERROR", details: ["The provided trip ID is not a valid format"] },
      });
    }
    console.error("Error updating trip status:", error);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred while updating trip status",
      error: { code: "INTERNAL_SERVER_ERROR", details: [] },
    });
  }
}

// Read-only bookings list for the admin Booking page.
export const getBookings = async (req, res) => {
  try {
    const currentPage = parseInt(req.params.page, 10);
    if (isNaN(currentPage) || currentPage < 1) {
      return res.status(400).json({
        success: false,
        message: "Invalid page parameter",
        error: { code: "VALIDATION_ERROR", details: ["Page must be a positive integer"] },
      });
    }

    const SKIP = (currentPage - 1) * BOOKINGS_PAGE_LIMIT;

    const [
      bookings,
      total,
      confirmedCount,
      completedCount,
      cancelledCount,
      pendingPaymentCount,
      revenueAgg,
    ] = await Promise.all([
      Booking.find()
        .sort({ createdAt: -1 })
        .skip(SKIP)
        .limit(BOOKINGS_PAGE_LIMIT)
        .populate("trip", "title location image")
        .populate("tourist", "email")
        .populate("guide", "email")
        .lean(),
      Booking.countDocuments(),
      Booking.countDocuments({ status: "confirmed" }),
      Booking.countDocuments({ status: "completed" }),
      Booking.countDocuments({ status: "cancelled" }),
      Booking.countDocuments({ status: "pending_payment" }),
      Booking.aggregate([
        { $match: { paymentStatus: "paid" } },
        { $group: { _id: null, total: { $sum: "$totalPrice" } } },
      ]),
    ]);

    const totalPages = Math.max(1, Math.ceil(total / BOOKINGS_PAGE_LIMIT));

    const rows = bookings.map((booking) => ({
      _id: booking._id,
      tripTitle: booking.trip?.title || "Deleted trip",
      tripImage: booking.trip?.image || "",
      touristEmail: booking.tourist?.email || "",
      guideEmail: booking.guide?.email || "",
      slotDate: booking.slotDate,
      timeSlot: booking.timeSlot,
      numberOfGuests: booking.numberOfGuests,
      totalPrice: booking.totalPrice,
      currency: booking.currency,
      status: booking.status,
      paymentStatus: booking.paymentStatus,
      createdAt: booking.createdAt,
    }));

    return res.status(200).json({
      success: true,
      message: "Operation completed successfully",
      data: rows,
      meta: {
        totalRecords: total,
        totalPages,
        recordsCount: rows.length,
        currentPage,
        pagingView: buildPagingView(currentPage, totalPages),
        headers: ["TOUR", "TOURIST", "GUIDE", "DATE", "GUESTS", "TOTAL", "STATUS"],
        types: ["All"],
        stats: {
          total,
          confirmed: confirmedCount,
          completed: completedCount,
          cancelled: cancelledCount,
          pendingPayment: pendingPaymentCount,
          revenuePaid:
            Math.round((revenueAgg[0]?.total || 0) * 100) / 100,
        },
      },
    });
  } catch (error) {
    console.error("Error listing bookings:", error);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred while fetching bookings",
      error: { code: "INTERNAL_SERVER_ERROR", details: [] },
    });
  }
}
