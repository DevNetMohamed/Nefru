import { GuideProfile } from "../models/guide.model.js";
import { Trip } from "../models/trip.model.js";

async function getPublicTrips(sort = null) {
  let query = Trip.find({ status: "active" })
    .populate("guide", "email status")
    .limit(5)
    .lean();

  if (sort) {
    query = query.sort(sort);
  }

  const trips = await query;
  const activeGuideIds = trips
    .map((trip) => trip.guide)
    .filter((guide) => guide?.status === "active")
    .map((guide) => guide._id);

  const guideProfiles = await GuideProfile.find({
    user: { $in: activeGuideIds },
    verificationStatus: "approved",
  })
    .select("user fullName avatar headline rating reviewsCount")
    .lean();

  const profilesByUser = new Map(
    guideProfiles.map((profile) => [profile.user.toString(), profile]),
  );

  return trips
    .filter((trip) => {
      if (!trip.guide || trip.guide.status !== "active") return false;
      return profilesByUser.has(trip.guide._id.toString());
    })
    .map((trip) => {
      const profile = profilesByUser.get(trip.guide._id.toString());

      return {
        ...trip,
        guide: {
          id: trip.guide._id,
          email: trip.guide.email,
          fullName: profile.fullName,
          avatar: profile.avatar,
          headline: profile.headline,
          rating: profile.rating,
          reviewsCount: profile.reviewsCount,
          verified: true,
        },
      };
    })
    .slice(0, 6);
}

export const getHomeData = async () => {
  const [featuredTrips, availableToday, toursNearYou, trustedGuideCandidates] =
    await Promise.all([
      getPublicTrips(),
      getPublicTrips({ createdAt: -1 }),
      getPublicTrips(),
      GuideProfile.find({ verificationStatus: "approved" })
        .populate({
          path: "user",
          match: { status: "active" },
          select: "email status",
        })
        .sort({ rating: -1 })
        .limit(18)
        .lean(),
    ]);

  const trustedGuides = trustedGuideCandidates
    .filter((guide) => guide.user)
    .slice(0, 6);

  return {
    featuredTrips,
    availableToday,
    trustedGuides,
    toursNearYou,
  };
};
