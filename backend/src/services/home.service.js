import { Trip } from "../models/trip.model.js";
import { GuideProfile } from "../models/guide.model.js";

export const getHomeData = async () => {
  const featuredTrips = await Trip.find()
    .populate("guide", "fullName avatar name")
    .limit(6);

  const availableToday = await Trip.find()
    .populate("guide", "fullName avatar name")
    .sort({ createdAt: -1 })
    .limit(4);

  const trustedGuides = await GuideProfile.find()
    .populate("user", "fullName avatar")
    .limit(4);

  const toursNearYou = await Trip.find()
    .populate("guide", "fullName avatar name")
    .limit(4);

  return {
    featuredTrips,
    availableToday,
    trustedGuides,
    toursNearYou,
  };
};
