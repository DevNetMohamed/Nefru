import { Trip } from "../models/trip.model.js";
import { GuideProfile } from "../models/guide.model.js";

export const getHomeData = async () => {
  const featuredTrips = await Trip.find({ status: "active" })
    .populate("guide", "fullName avatar email verificationStatus")
    .limit(6);

  const availableToday = await Trip.find({ status: "active" })
    .populate("guide", "fullName avatar email verificationStatus")
    .sort({ createdAt: -1 })
    .limit(6);

  const trustedGuides = await GuideProfile.find({ verificationStatus: "approved", isActive: true })
    .populate("user", "fullName avatar email")
    .sort({ rating: -1 })
    .limit(6);

  const toursNearYou = await Trip.find({ status: "active" })
    .populate("guide", "fullName avatar email verificationStatus")
    .limit(6);

  return {
    featuredTrips,
    availableToday,
    trustedGuides,
    toursNearYou,
  };
};
