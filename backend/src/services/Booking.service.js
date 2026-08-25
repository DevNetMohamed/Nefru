import mongoose from "mongoose";
import Stripe from "stripe";

import { env } from "../config/env.js";
import { Booking } from "../models/booking.model.js";
import { BookingSeat } from "../models/bookingSeat.model.js";
import { GuideProfile } from "../models/guide.model.js";
import { Notification } from "../models/notification.model.js";
import { TouristProfile } from "../models/tourist.model.js";
import { Trip } from "../models/trip.model.js";
import { AppError } from "../utils/AppError.js";
import {
  findOccurrence,
  normalizeTripSchedule,
  occurrenceDateTime,
} from "../utils/tripSchedule.js";

const HOLD_MINUTES = 15;
const ACTIVE_BOOKING_STATUSES = ["pending_payment", "confirmed"];
const stripe = env.stripeSecretKey ? new Stripe(env.stripeSecretKey) : null;
const CANCELLABLE_PAYMENT_STATUSES = new Set([
  "requires_payment_method",
  "requires_confirmation",
  "requires_action",
  "requires_capture",
  "processing",
]);

async function cancelPendingPaymentIntent(paymentIntentId) {
  if (!paymentIntentId) return "none";
  if (!stripe) return "unknown";
  try {
    const intent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (CANCELLABLE_PAYMENT_STATUSES.has(intent.status)) {
      await stripe.paymentIntents.cancel(intent.id);
      return "canceled";
    }
    return intent.status;
  } catch (error) {
    console.error(`Unable to cancel Stripe PaymentIntent ${paymentIntentId}:`, error.message);
    return "unknown";
  }
}

function assertObjectId(value, label = "ID") {
  if (!mongoose.isValidObjectId(value)) {
    throw new AppError(`Invalid ${label}`, 400, "INVALID_ID");
  }
}

function bookingView(booking, names = {}) {
  const trip = booking.trip || {};
  const guide = booking.guide || {};
  const tourist = booking.tourist || {};
  const statusGroup = booking.status === "completed"
    ? "completed"
    : ["cancelled", "refunded", "no_show"].includes(booking.status)
      ? "cancelled"
      : "upcoming";

  return {
    id: booking._id,
    bookingId: booking._id,
    tripId: trip._id || booking.trip,
    occurrenceKey: booking.occurrenceKey,
    title: trip.title || "Trip",
    image: trip.image || "",
    location: trip.location || "",
    duration: trip.duration || "",
    guide: names.guide || guide.email || "Nefru guide",
    tourist: names.tourist || tourist.email || "Nefru traveler",
    touristEmail: tourist.email || "",
    date: booking.slotDate,
    startsAt: booking.date,
    endsAt: booking.endAt,
    startTime: booking.timeSlot,
    price: booking.totalPrice,
    totalPrice: booking.totalPrice,
    currency: booking.currency,
    status: booking.status,
    statusGroup,
    paymentStatus: booking.paymentStatus,
    holdExpiresAt: booking.holdExpiresAt,
    specialRequest: booking.specialRequests?.[0] || "",
    cancellationReason: booking.cancellationReason || "",
    cancelledBy: booking.cancelledBy || "",
    createdAt: booking.createdAt,
  };
}

async function namesForBookings(bookings) {
  const guideIds = bookings.map((item) => item.guide?._id || item.guide).filter(Boolean);
  const touristIds = bookings.map((item) => item.tourist?._id || item.tourist).filter(Boolean);
  const [guides, tourists] = await Promise.all([
    GuideProfile.find({ user: { $in: guideIds } }).select("user fullName").lean(),
    TouristProfile.find({ user: { $in: touristIds } }).select("user fullName").lean(),
  ]);
  return {
    guides: new Map(guides.map((item) => [item.user.toString(), item.fullName])),
    tourists: new Map(tourists.map((item) => [item.user.toString(), item.fullName])),
  };
}

function namesFor(booking, maps) {
  const guideId = booking.guide?._id || booking.guide;
  const touristId = booking.tourist?._id || booking.tourist;
  return {
    guide: guideId ? maps.guides.get(guideId.toString()) : "",
    tourist: touristId ? maps.tourists.get(touristId.toString()) : "",
  };
}

async function notify(user, payload) {
  return Notification.create({ user, ...payload });
}

export async function expirePendingBookings(extraQuery = {}) {
  const now = new Date();
  const expired = await Booking.find({
    ...extraQuery,
    status: "pending_payment",
    holdExpiresAt: { $lte: now },
  }).select("_id tourist trip stripePaymentIntentId");

  if (!expired.length) return [];
  const paymentStates = await Promise.all(
    expired.map((booking) => cancelPendingPaymentIntent(booking.stripePaymentIntentId)),
  );
  const uncertainIds = expired
    .filter((_, index) => ["succeeded", "unknown"].includes(paymentStates[index]))
    .map((booking) => booking._id);
  if (uncertainIds.length) {
    const graceExpiresAt = new Date(Date.now() + 5 * 60 * 1000);
    const seatGraceExpiresAt = new Date(graceExpiresAt.getTime() + 60 * 1000);
    await Promise.all([
      Booking.updateMany(
        { _id: { $in: uncertainIds }, status: "pending_payment" },
        { $set: { holdExpiresAt: graceExpiresAt } },
      ),
      BookingSeat.updateMany(
        { booking: { $in: uncertainIds } },
        { $set: { expiresAt: seatGraceExpiresAt } },
      ),
    ]);
  }
  const ids = expired
    .filter((_, index) => !["succeeded", "unknown"].includes(paymentStates[index]))
    .map((item) => item._id);
  if (!ids.length) return [];
  const definitelyExpired = expired.filter((booking) =>
    ids.some((id) => id.toString() === booking._id.toString()),
  );
  await Promise.all([
    Booking.updateMany(
      { _id: { $in: ids }, status: "pending_payment" },
      {
        $set: {
          status: "expired",
          paymentStatus: "failed",
          cancelledBy: "system",
          cancellationReason: "Payment window expired",
          cancelledAt: now,
        },
      },
    ),
    BookingSeat.deleteMany({ booking: { $in: ids } }),
  ]);

  await Notification.insertMany(
    definitelyExpired.map((booking) => ({
      user: booking.tourist,
      type: "payment",
      title: "Payment window expired",
      message: "Your 15-minute booking hold expired. You can select the trip again.",
      link: `/user/trips/info/${booking.trip}`,
      entityType: "booking",
      entityId: booking._id,
    })),
  );
  return ids;
}

async function allocateSeat({ booking, trip, tourist, occurrenceKey, capacity, expiresAt }) {
  await BookingSeat.deleteMany({ expiresAt: { $lte: new Date() } });

  for (let seatNumber = 1; seatNumber <= capacity; seatNumber += 1) {
    try {
      return await BookingSeat.create({
        booking,
        trip,
        tourist,
        occurrenceKey,
        seatNumber,
        expiresAt,
      });
    } catch (error) {
      if (error?.code !== 11000) throw error;
      const duplicateForTourist = await BookingSeat.exists({ trip, occurrenceKey, tourist });
      if (duplicateForTourist) {
        throw new AppError("You already booked this date and time", 409, "DUPLICATE_BOOKING");
      }
    }
  }

  throw new AppError("This time slot is fully booked", 409, "SLOT_FULL");
}

export async function getTripAvailability(tripId) {
  assertObjectId(tripId, "trip ID");
  await expirePendingBookings({ trip: tripId });
  const trip = await Trip.findOne({ _id: tripId, status: "active" }).lean();
  if (!trip) throw new AppError("Active trip not found", 404, "TRIP_NOT_FOUND");

  const schedule = normalizeTripSchedule(trip.schedule, trip.groupSize || 1);
  const now = new Date();
  const futureSlots = schedule.slots.filter(
    (slot) => occurrenceDateTime(slot.date, slot.startTime) > now,
  );
  const counts = await BookingSeat.aggregate([
    { $match: { trip: trip._id, occurrenceKey: { $in: futureSlots.map((slot) => slot.occurrenceKey) } } },
    { $group: { _id: "$occurrenceKey", reserved: { $sum: 1 } } },
  ]);
  const reservedByOccurrence = new Map(counts.map((item) => [item._id, item.reserved]));
  const slots = futureSlots.map((slot) => {
    const reserved = reservedByOccurrence.get(slot.occurrenceKey) || 0;
    return {
      ...slot,
      reserved,
      availableSpots: Math.max(slot.capacity - reserved, 0),
      bookable: reserved < slot.capacity,
    };
  });
  const dates = [...new Set(slots.map((slot) => slot.date))];
  const slotsByDate = Object.fromEntries(
    dates.map((date) => [date, slots.filter((slot) => slot.date === date)]),
  );

  return {
    trip: {
      id: trip._id,
      title: trip.title,
      description: trip.description,
      longDescription: trip.longDescription || trip.description,
      location: trip.location,
      duration: trip.duration,
      image: trip.image,
      price: trip.price,
      currency: "USD",
      groupSize: trip.groupSize,
    },
    holdMinutes: HOLD_MINUTES,
    schedule: { dates, slotsByDate, slots },
  };
}

export async function createBooking(data, tourist) {
  if (!tourist) throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
  const { tripId, occurrenceKey, specialRequest = "" } = data;
  assertObjectId(tripId, "trip ID");
  if (!occurrenceKey) throw new AppError("Choose a date and time", 400, "SLOT_REQUIRED");

  await expirePendingBookings({ trip: tripId, occurrenceKey });
  const trip = await Trip.findOne({ _id: tripId, status: "active" });
  if (!trip) throw new AppError("Active trip not found", 404, "TRIP_NOT_FOUND");
  const { occurrence } = findOccurrence(trip, occurrenceKey);
  if (!occurrence) throw new AppError("Time slot not found", 404, "SLOT_NOT_FOUND");

  const startsAt = occurrenceDateTime(occurrence.date, occurrence.startTime);
  const endsAt = occurrenceDateTime(occurrence.date, occurrence.endTime);
  if (startsAt <= new Date()) throw new AppError("This time slot has already started", 409, "SLOT_STARTED");

  const duplicate = await Booking.exists({
    trip: trip._id,
    tourist: tourist._id,
    occurrenceKey,
    status: { $in: ACTIVE_BOOKING_STATUSES },
  });
  if (duplicate) throw new AppError("You already booked this date and time", 409, "DUPLICATE_BOOKING");

  const holdExpiresAt = new Date(Date.now() + HOLD_MINUTES * 60 * 1000);
  const seatExpiresAt = new Date(holdExpiresAt.getTime() + 60 * 1000);
  const specialRequests = String(specialRequest).trim()
    ? [String(specialRequest).trim().slice(0, 500)]
    : [];
  const booking = await Booking.create({
    trip: trip._id,
    tourist: tourist._id,
    guide: trip.guide,
    occurrenceKey,
    slotDate: occurrence.date,
    date: startsAt,
    endAt: endsAt,
    timeSlot: `${occurrence.startTime} - ${occurrence.endTime}`,
    numberOfGuests: 1,
    pricePerPerson: trip.price,
    totalPrice: trip.price,
    platformFee: 0,
    guideEarnings: trip.price,
    currency: "USD",
    status: "pending_payment",
    paymentStatus: "unpaid",
    holdExpiresAt,
    specialRequests,
  });

  try {
    await allocateSeat({
      booking: booking._id,
      trip: trip._id,
      tourist: tourist._id,
      occurrenceKey,
      capacity: occurrence.capacity,
      expiresAt: seatExpiresAt,
    });
  } catch (error) {
    await Booking.deleteOne({ _id: booking._id });
    throw error;
  }

  return bookingView({ ...booking.toObject(), trip: trip.toObject() });
}

export async function getBookingById(bookingId, user) {
  assertObjectId(bookingId, "booking ID");
  await expirePendingBookings({ _id: bookingId });
  const booking = await Booking.findById(bookingId)
    .populate("trip")
    .populate("tourist", "email")
    .populate("guide", "email")
    .lean();
  if (!booking || booking.status === "expired") throw new AppError("Booking not found", 404, "BOOKING_NOT_FOUND");
  const canView = user.role === "admin"
    || booking.tourist?._id?.toString() === user._id.toString()
    || booking.guide?._id?.toString() === user._id.toString();
  if (!canView) throw new AppError("You cannot view this booking", 403, "FORBIDDEN");
  const maps = await namesForBookings([booking]);
  return bookingView(booking, namesFor(booking, maps));
}

export async function getMyBookings(tourist) {
  await expirePendingBookings({ tourist: tourist._id });
  const bookings = await Booking.find({
    tourist: tourist._id,
    status: { $ne: "expired" },
  })
    .populate("trip")
    .populate("guide", "email")
    .populate("tourist", "email")
    .sort({ date: 1, createdAt: -1 })
    .lean();
  const maps = await namesForBookings(bookings);
  return bookings.map((booking) => bookingView(booking, namesFor(booking, maps)));
}

export async function getGuideBookings(guide) {
  await expirePendingBookings({ guide: guide._id });
  const bookings = await Booking.find({ guide: guide._id, status: { $ne: "expired" } })
    .populate("trip")
    .populate("tourist", "email")
    .populate("guide", "email")
    .sort({ date: 1, createdAt: -1 })
    .lean();
  const maps = await namesForBookings(bookings);
  const serialized = bookings.map((booking) => bookingView(booking, namesFor(booking, maps)));
  const occurrences = new Map();

  serialized.forEach((booking) => {
    const groupKey = `${booking.tripId}:${booking.occurrenceKey}`;
    if (!occurrences.has(groupKey)) {
      const original = bookings.find((item) => item._id.toString() === booking.id.toString());
      const slot = normalizeTripSchedule(original?.trip?.schedule, original?.trip?.groupSize || 1)
        .slots.find((item) => item.occurrenceKey === booking.occurrenceKey);
      occurrences.set(groupKey, {
        occurrenceKey: booking.occurrenceKey,
        tripId: booking.tripId,
        title: booking.title,
        image: booking.image,
        location: booking.location,
        date: booking.date,
        startsAt: booking.startsAt,
        endsAt: booking.endsAt,
        startTime: slot?.startTime || booking.startTime.split(" - ")[0],
        endTime: slot?.endTime || booking.startTime.split(" - ")[1] || "",
        capacity: slot?.capacity || 1,
        bookings: [],
      });
    }
    occurrences.get(groupKey).bookings.push(booking);
  });

  return {
    bookings: serialized,
    occurrences: [...occurrences.values()],
  };
}

export async function cancelTouristBooking(bookingId, tourist, reason = "") {
  assertObjectId(bookingId, "booking ID");
  await expirePendingBookings({ _id: bookingId });
  const booking = await Booking.findOne({ _id: bookingId, tourist: tourist._id }).populate("trip");
  if (!booking || !ACTIVE_BOOKING_STATUSES.includes(booking.status)) {
    throw new AppError("Active booking not found", 404, "BOOKING_NOT_FOUND");
  }
  if (booking.date <= new Date()) throw new AppError("A trip cannot be cancelled after it starts", 409, "TRIP_STARTED");

  booking.status = "cancelled";
  booking.cancelledBy = "tourist";
  booking.cancellationReason = String(reason || "Cancelled by traveler").slice(0, 500);
  booking.cancelledAt = new Date();
  booking.holdExpiresAt = null;
  await Promise.all([
    booking.save(),
    BookingSeat.deleteOne({ booking: booking._id }),
    cancelPendingPaymentIntent(booking.stripePaymentIntentId),
  ]);
  await Promise.all([
    notify(booking.guide, {
      type: "booking",
      title: "Booking cancelled",
      message: `${booking.trip.title} booking was cancelled by the traveler.`,
      link: "/guide/bookings",
      entityType: "booking",
      entityId: booking._id,
    }),
    notify(booking.tourist, {
      type: "booking",
      title: "Booking cancelled",
      message: booking.paymentStatus === "paid"
        ? `${booking.trip.title} was cancelled. Automatic refunds are not available yet.`
        : `${booking.trip.title} was cancelled.`,
      link: "/user/profile/bookings",
      entityType: "booking",
      entityId: booking._id,
    }),
  ]);
  return bookingView(booking.toObject());
}

export async function completeOccurrence(tripId, occurrenceKey, guide) {
  assertObjectId(tripId, "trip ID");
  if (!occurrenceKey) throw new AppError("Occurrence is required", 400, "OCCURRENCE_REQUIRED");
  const bookings = await Booking.find({
    trip: tripId,
    guide: guide._id,
    occurrenceKey,
    status: "confirmed",
  }).populate("trip");
  if (!bookings.length) throw new AppError("Confirmed occurrence not found", 404, "OCCURRENCE_NOT_FOUND");
  if (bookings[0].endAt > new Date()) throw new AppError("This trip has not ended yet", 409, "TRIP_NOT_ENDED");
  const ids = bookings.map((item) => item._id);
  const now = new Date();
  await Promise.all([
    Booking.updateMany({ _id: { $in: ids }, status: "confirmed" }, { $set: { status: "completed", completedAt: now } }),
    BookingSeat.deleteMany({ booking: { $in: ids } }),
  ]);
  await Notification.insertMany(bookings.map((booking) => ({
    user: booking.tourist,
    type: "booking",
    title: "Trip completed",
    message: `${booking.trip.title} was marked as completed by your guide.`,
    link: "/user/profile/bookings",
    entityType: "booking",
    entityId: booking._id,
  })));
  return { tripId, occurrenceKey, completedBookings: ids.length };
}

export async function cancelGuideOccurrence(tripId, occurrenceKey, guide, reason) {
  assertObjectId(tripId, "trip ID");
  if (!occurrenceKey) throw new AppError("Occurrence is required", 400, "OCCURRENCE_REQUIRED");
  if (!String(reason || "").trim()) throw new AppError("Cancellation reason is required", 400, "REASON_REQUIRED");
  const bookings = await Booking.find({
    trip: tripId,
    guide: guide._id,
    occurrenceKey,
    status: { $in: ACTIVE_BOOKING_STATUSES },
  }).populate("trip");
  if (!bookings.length) throw new AppError("Active occurrence not found", 404, "OCCURRENCE_NOT_FOUND");
  if (bookings[0].date <= new Date()) throw new AppError("A trip cannot be cancelled after it starts", 409, "TRIP_STARTED");
  const ids = bookings.map((item) => item._id);
  const now = new Date();
  const trip = bookings[0].trip;
  const currentSchedule = normalizeTripSchedule(trip.schedule, trip.groupSize || 1);
  const remainingSlots = currentSchedule.slots.filter(
    (slot) => slot.occurrenceKey !== occurrenceKey,
  );
  const remainingDates = [...new Set(remainingSlots.map((slot) => slot.date))];
  trip.schedule = {
    dates: remainingDates,
    slotsByDate: Object.fromEntries(
      remainingDates.map((date) => [
        date,
        remainingSlots.filter((slot) => slot.date === date),
      ]),
    ),
    slots: remainingSlots,
  };
  await trip.save();
  await Promise.all(
    bookings.map((booking) => cancelPendingPaymentIntent(booking.stripePaymentIntentId)),
  );
  await Promise.all([
    Booking.updateMany(
      { _id: { $in: ids }, status: { $in: ACTIVE_BOOKING_STATUSES } },
      {
        $set: {
          status: "cancelled",
          cancelledBy: "guide",
          cancellationReason: String(reason).trim().slice(0, 500),
          cancelledAt: now,
          holdExpiresAt: null,
        },
      },
    ),
    BookingSeat.deleteMany({ booking: { $in: ids } }),
  ]);
  await Notification.insertMany(bookings.map((booking) => ({
    user: booking.tourist,
    type: "booking",
    title: "Trip cancelled by guide",
    message: `${booking.trip.title}: ${String(reason).trim()}`,
    link: "/user/profile/bookings",
    entityType: "booking",
    entityId: booking._id,
  })));
  return { tripId, occurrenceKey, cancelledBookings: ids.length };
}

export { HOLD_MINUTES };
