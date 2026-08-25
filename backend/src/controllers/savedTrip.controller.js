import mongoose from "mongoose";

import { GuideProfile } from "../models/guide.model.js";
import { TouristProfile } from "../models/tourist.model.js";
import { Trip } from "../models/trip.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

async function getProfile(user) {
  return TouristProfile.findOneAndUpdate(
    { user: user._id },
    {
      $setOnInsert: {
        user: user._id,
        fullName: String(user.email || "Nefru traveler").split("@")[0],
      },
    },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  );
}

async function serializeSavedTrips(ids) {
  const trips = await Trip.find({ _id: { $in: ids }, status: "active" })
    .populate("guide", "email status")
    .lean();
  const guideIds = trips.map((trip) => trip.guide?._id).filter(Boolean);
  const guideProfiles = await GuideProfile.find({ user: { $in: guideIds } })
    .select("user fullName avatar verificationStatus")
    .lean();
  const guides = new Map(guideProfiles.map((guide) => [guide.user.toString(), guide]));

  return trips.map((trip) => {
    const guide = trip.guide ? guides.get(trip.guide._id.toString()) : null;
    return {
      id: trip._id,
      _id: trip._id,
      title: trip.title,
      description: trip.description,
      location: trip.location,
      price: trip.price,
      currency: "USD",
      duration: trip.duration,
      image: trip.image,
      category: trip.category,
      rating: trip.rating || 0,
      reviewsCount: trip.reviewsCount || 0,
      guide: guide
        ? { name: guide.fullName, avatar: guide.avatar, verified: guide.verificationStatus === "approved" }
        : null,
    };
  });
}

export const getSavedTrips = asyncHandler(async (req, res) => {
  const profile = await getProfile(req.user);
  const trips = await serializeSavedTrips(profile.savedTrips || []);
  res.status(200).json({ success: true, data: { trips, ids: trips.map((trip) => trip.id) } });
});

export const saveTrip = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.tripId)) {
    res.status(400);
    throw new Error("Invalid trip ID");
  }
  const trip = await Trip.findOne({ _id: req.params.tripId, status: "active" }).select("_id");
  if (!trip) {
    res.status(404);
    throw new Error("Active trip not found");
  }
  const profile = await getProfile(req.user);
  await TouristProfile.updateOne({ _id: profile._id }, { $addToSet: { savedTrips: trip._id } });
  res.status(200).json({ success: true, message: "Trip saved", data: { tripId: trip._id, saved: true } });
});

export const unsaveTrip = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.tripId)) {
    res.status(400);
    throw new Error("Invalid trip ID");
  }
  const profile = await getProfile(req.user);
  await TouristProfile.updateOne({ _id: profile._id }, { $pull: { savedTrips: req.params.tripId } });
  res.status(200).json({ success: true, message: "Trip removed from saved trips", data: { tripId: req.params.tripId, saved: false } });
});
