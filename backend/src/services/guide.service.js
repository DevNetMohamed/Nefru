import mongoose from "mongoose";
import { Guide } from "../models/guide.model.js";
import { Trip } from "../models/trip.model.js";

const GUIDE_USER_FIELDS = "fullName avatar verificationStatus isActive";

function toGuideResponse(guide, tours) {
  const user = guide.user;

  return {
    id: guide._id,
    name: user.fullName,
    profileImage: user.avatar,
    heroImage: guide.heroImage,
    title: guide.title,
    headline: guide.headline,
    location: guide.location,
    verified: user.verificationStatus === "approved",
    verificationStatus: user.verificationStatus,
    isActive: user.isActive,
    rating: guide.rating,
    reviewsCount: guide.reviewsCount,
    yearsExperience: guide.yearsExperience,
    languages: guide.languages,
    specialties: guide.specialties,
    about: guide.about,
    gallery: guide.gallery.map((item) => ({
      id: item._id,
      src: item.src,
      alt: item.alt,
    })),
    tours: tours.map((tour) => ({
      id: tour._id,
      title: tour.title,
      image: tour.image,
      duration: tour.duration,
      price: tour.price,
      location: tour.location,
      category: tour.category,
    })),
    createdAt: guide.createdAt,
    updatedAt: guide.updatedAt,
  };
}

async function getGuideResponse(guideQuery) {
  const guide = await guideQuery.populate("user", GUIDE_USER_FIELDS).lean();

  if (!guide?.user) return null;

  const tours = await Trip.find({ guide: guide.user._id })
    .select("title image duration price location category")
    .sort({ createdAt: -1 })
    .lean();

  return toGuideResponse(guide, tours);
}

export async function getPublicGuideProfile(guideId) {
  if (!mongoose.isValidObjectId(guideId)) return null;

  const guide = await getGuideResponse(Guide.findById(guideId));

  if (!guide || !guide.isActive || !guide.verified) return null;

  const publicGuide = { ...guide };
  delete publicGuide.verificationStatus;
  delete publicGuide.isActive;

  return publicGuide;
}

export async function getOwnGuideProfile(userId) {
  return getGuideResponse(Guide.findOne({ user: userId }));
}

export async function updateOwnGuideProfile(userId, updates) {
  return getGuideResponse(
    Guide.findOneAndUpdate(
      { user: userId },
      { $set: updates },
      { new: true, runValidators: true },
    ),
  );
}
