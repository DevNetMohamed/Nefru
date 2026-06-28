import { Trip } from "../models/trip.model.js";
import { Guide } from "../models/guide.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose from "mongoose";

const ALLOWED_STATUSES = ["draft", "reviewing", "active"];

function getTripSummary(trip) {
  return {
    id: trip._id,
    title: trip.title,
    description: trip.description,
    longDescription: trip.longDescription || trip.description,
    location: trip.location,
    price: trip.price,
    duration: trip.duration,
    image: trip.image,
    category: trip.category,
    status: trip.status || "draft",
    statusText:
      trip.status === "reviewing"
        ? "Reviewing"
        : trip.status === "active"
          ? "Active"
          : "Draft",
    groupSize: trip.groupSize || 12,
    actionLabel: trip.status === "draft" ? "Continue" : "Manage",
    highlights: trip.highlights || [],
    reviews: trip.reviews || [],
    gallery: trip.gallery || [],
    schedule: trip.schedule || { dates: [], slots: [] },
    createdAt: trip.createdAt,
    updatedAt: trip.updatedAt,
  };
}

function canManageTrip(user, trip) {
  if (!user || !trip) return false;
  if (user.role === "admin") return true;
  return trip.guide?.toString() === user._id?.toString();
}

/**
 * @desc Get all trips with search and filter capabilities
 * @route GET /api/trips
 * @access Public
 */
export const getAllTrips = asyncHandler(async (req, res) => {
  const { search, category, location } = req.query;

  const query = {};

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  if (category) {
    query.category = category;
  }

  if (location) {
    query.location = { $regex: location, $options: "i" };
  }

  const trips = await Trip.find(query)
    .populate("guide", "fullName avatar verificationStatus")
    .sort({ createdAt: -1 })
    .lean();

  res.status(200).json({
    success: true,
    count: trips.length,
    data: trips,
  });
});

/**
 * @desc Get a single trip by ID with full details including guide info
 * @route GET /api/trips/:id
 * @access Public
 */
export const getTripById = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(400);
    throw new Error("Invalid trip ID");
  }

  const trip = await Trip.findById(req.params.id)
    .populate("guide", "fullName avatar verificationStatus")
    .lean();

  if (!trip) {
    res.status(404);
    throw new Error("Trip not found");
  }

  const guideProfile = await Guide.findOne({ user: trip.guide._id })
    .select("rating reviewsCount about yearsExperience languages specialties")
    .lean();

  const tripResponse = {
    id: trip._id,
    title: trip.title,
    description: trip.description,
    longDescription: trip.longDescription || trip.description,
    location: trip.location,
    price: trip.price,
    duration: trip.duration,
    image: trip.image,
    category: trip.category,
    status: trip.status || "draft",
    groupSize: trip.groupSize || 12,
    schedule: trip.schedule || { dates: [], slots: [] },
    gallery: trip.gallery || [],
    rating: trip.rating || guideProfile?.rating || 0,
    reviewsCount: trip.reviewsCount || 0,
    highlights: trip.highlights || [],
    reviews: trip.reviews || [],
    date: trip.createdAt
      ? new Date(trip.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })
      : "N/A",
    guide: {
      id: trip.guide._id,
      name: trip.guide.fullName,
      avatar: trip.guide.avatar,
      badge: `${guideProfile?.yearsExperience || 0}+ years experience`,
      rating: guideProfile?.rating || 0,
      reviewsCount: guideProfile?.reviewsCount || 0,
      about: guideProfile?.about || "No bio available",
      verified: trip.guide.verificationStatus === "approved",
    },
  };

  res.status(200).json({
    success: true,
    data: tripResponse,
  });
});

/**
 * @desc Create a new trip
 * @route POST /api/trips
 * @access Private (Guide/Admin)
 */
export const createTrip = asyncHandler(async (req, res) => {
  if (req.user.role !== "guide" && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Only guides and admins can create tours");
  }

  const {
    title,
    description,
    longDescription,
    location,
    price,
    duration,
    image,
    category,
    groupSize,
    schedule,
    gallery,
  } = req.body;

  if (!title || !description || !location || !price || !duration || !category) {
    res.status(400);
    throw new Error("Please provide title, description, location, price, duration and category");
  }

  const trip = await Trip.create({
    title,
    description,
    longDescription: longDescription || description,
    location,
    price,
    duration,
    image: image || "",
    category,
    groupSize: groupSize || 12,
    schedule: schedule || { dates: [], slots: [] },
    gallery: Array.isArray(gallery) ? gallery : [],
    guide: req.user._id,
    status: "draft",
  });

  res.status(201).json({
    success: true,
    message: "Tour created successfully",
    data: getTripSummary(trip),
  });
});

/**
 * @desc Get tours for the logged-in guide
 * @route GET /api/trips/guide/me
 * @access Private (Guide)
 */
export const getMyGuideTrips = asyncHandler(async (req, res) => {
  if (req.user.role !== "guide" && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Only guides can view their tours");
  }

  const { status } = req.query;
  const query = { guide: req.user._id };

  if (status && ALLOWED_STATUSES.includes(status)) {
    query.status = status;
  }

  const trips = await Trip.find(query).sort({ createdAt: -1 }).lean();

  const counts = {
    all: await Trip.countDocuments({ guide: req.user._id }),
    active: await Trip.countDocuments({ guide: req.user._id, status: "active" }),
    reviewing: await Trip.countDocuments({ guide: req.user._id, status: "reviewing" }),
    draft: await Trip.countDocuments({ guide: req.user._id, status: "draft" }),
  };

  res.status(200).json({
    success: true,
    data: {
      tours: trips.map(getTripSummary),
      counts,
    },
  });
});

/**
 * @desc Update a guide tour
 * @route PATCH /api/trips/:id
 * @access Private (Guide/Admin)
 */
export const updateMyTrip = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(400);
    throw new Error("Invalid trip ID");
  }

  const trip = await Trip.findById(req.params.id);

  if (!trip) {
    res.status(404);
    throw new Error("Trip not found");
  }

  if (!canManageTrip(req.user, trip)) {
    res.status(403);
    throw new Error("You can only edit your own tours");
  }

  const allowedFields = [
    "title",
    "description",
    "longDescription",
    "location",
    "price",
    "duration",
    "image",
    "category",
    "groupSize",
    "schedule",
    "gallery",
  ];

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      trip[field] = req.body[field];
    }
  });

  await trip.save();

  res.status(200).json({
    success: true,
    message: "Tour updated successfully",
    data: getTripSummary(trip),
  });
});

/**
 * @desc Change trip review status
 * @route PATCH /api/trips/:id/status
 * @access Private (Guide/Admin)
 */
export const changeTripStatus = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(400);
    throw new Error("Invalid trip ID");
  }

  const trip = await Trip.findById(req.params.id);

  if (!trip) {
    res.status(404);
    throw new Error("Trip not found");
  }

  if (!canManageTrip(req.user, trip)) {
    res.status(403);
    throw new Error("You can only change your own tours");
  }

  const { status } = req.body;

  if (!status || !ALLOWED_STATUSES.includes(status)) {
    res.status(400);
    throw new Error("Please provide a valid status");
  }

  trip.status = status;
  await trip.save();

  res.status(200).json({
    success: true,
    message: "Tour status updated",
    data: getTripSummary(trip),
  });
});

/**
 * @desc Update tour media fields
 * @route PATCH /api/trips/:id/media
 * @access Private (Guide/Admin)
 */
export const updateTripMedia = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(400);
    throw new Error("Invalid trip ID");
  }

  const trip = await Trip.findById(req.params.id);

  if (!trip) {
    res.status(404);
    throw new Error("Trip not found");
  }

  if (!canManageTrip(req.user, trip)) {
    res.status(403);
    throw new Error("You can only edit your own tours");
  }

  if (req.body.image !== undefined) {
    trip.image = req.body.image;
  }

  if (req.body.gallery !== undefined) {
    trip.gallery = Array.isArray(req.body.gallery) ? req.body.gallery : [];
  }

  await trip.save();

  res.status(200).json({
    success: true,
    message: "Tour media updated",
    data: getTripSummary(trip),
  });
});
