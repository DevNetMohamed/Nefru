import mongoose from "mongoose";
import { GuideProfile } from "../models/guide.model.js";
import { Trip } from "../models/trip.model.js";

const GUIDE_USER_FIELDS =
  "email status createdAt authProviders emailVerified";

function toGuideResponse(guide, tours, { includePrivate = false } = {}) {
  const user = guide.user;
  const avatar = guide.avatar || "";

  const response = {
    id: guide._id,
    name: guide.fullName,
    fullName: guide.fullName,
    avatar,
    profileImage: avatar,
    heroImage: guide.gallery?.[0]?.src || avatar,
    title: guide.headline,
    headline: guide.headline,
    location: guide.location,
    phoneNumber: guide.phoneNumber,
    gender: guide.gender,
    nationality: guide.nationality,
    dateOfBirth: guide.dateOfBirth,
    preferredLanguage: guide.preferredLanguage,
    verified: guide.verificationStatus === "approved",
    verificationStatus: guide.verificationStatus,
    status: user.status,
    rating: guide.rating,
    reviewsCount: guide.reviewsCount,
    yearsExperience: guide.yearsExperience,
    languages: guide.languages,
    specialties: guide.specialties,
    about: guide.about,
    email: user.email,
    memberSince: user.createdAt,
    gallery: guide.gallery.map((item) => ({
      id: item._id,
      src: item.src,
      alt: item.alt,
    })),
    tours: tours.map((trip) => ({
      id: trip._id,
      title: trip.title,
      image: trip.image,
      duration: trip.duration,
      price: trip.price,
      location: trip.location,
      category: trip.category,
    })),
    createdAt: guide.createdAt,
    updatedAt: guide.updatedAt,
  };

  if (includePrivate) {
    response.rejectionReason = guide.rejectionReason || "";
  }

  return response;
}

async function getGuideResponse(guideQuery, options = {}) {
  if (options.includePrivate) {
    guideQuery.select("+rejectionReason");
  }

  const guide = await guideQuery.populate("user", GUIDE_USER_FIELDS).lean();

  if (!guide?.user) return null;

  const tours = await Trip.find({ guide: guide.user._id })
    .select("title image duration price location category")
    .sort({ createdAt: -1 })
    .lean();

  return toGuideResponse(guide, tours, options);
}

export async function getPublicGuideProfile(guideId) {
  if (!mongoose.isValidObjectId(guideId)) return null;

  const guide = await getGuideResponse(GuideProfile.findById(guideId));

  if (!guide || guide.status !== "active" || !guide.verified) {
    return null;
  }

  const publicGuide = { ...guide };
  delete publicGuide.verificationStatus;
  delete publicGuide.status;

  return publicGuide;
}

export async function getOwnGuideProfile(userId) {
  return getGuideResponse(GuideProfile.findOne({ user: userId }), {
    includePrivate: true,
  });
}

export async function updateOwnGuideProfile(userId, updates) {
  return getGuideResponse(
    GuideProfile.findOneAndUpdate(
      { user: userId },
      { $set: updates },
      { new: true, runValidators: true },
    ),
    { includePrivate: true },
  );
}
