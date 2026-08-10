import crypto from "crypto";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";

import { env } from "../config/env.js";
import { User } from "../models/user.model.js";
import { TouristProfile } from "../models/tourist.model.js";
import { Trip } from "../models/trip.model.js";
import { Booking } from "../models/booking.model.js";
import { Review } from "../models/review.model.js";
import { Interaction } from "../models/interaction.model.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outputDir = path.resolve(__dirname, "../../exports/nefru-ml");
const exportSalt = process.env.ML_EXPORT_SALT || "replace-this-before-real-data-export";

const interactionWeights = {
  impression: 0.1,
  search: 0.5,
  view: 1,
  map_opened: 1.2,
  share: 1.5,
  save: 3,
  unsave: -1,
  booking_started: 4,
  booking_completed: 6,
  booking_cancelled: -3,
  review_submitted: 7,
};

function anonymize(value) {
  return crypto
    .createHash("sha256")
    .update(`${exportSalt}:${String(value)}`)
    .digest("hex")
    .slice(0, 24);
}

function csvEscape(value) {
  if (value === null || value === undefined) return "";
  const text = typeof value === "object" ? JSON.stringify(value) : String(value);
  if (/[",\n\r]/.test(text)) return `"${text.replaceAll('"', '""')}"`;
  return text;
}

function toCsv(rows, columns) {
  const header = columns.join(",");
  const body = rows.map((row) => columns.map((column) => csvEscape(row[column])).join(","));
  return [header, ...body].join("\n");
}

function ageGroup(dateOfBirth) {
  if (!dateOfBirth) return "unknown";
  const age = Math.floor((Date.now() - new Date(dateOfBirth).getTime()) / (365.25 * 24 * 60 * 60 * 1000));
  if (age < 18) return "under_18";
  if (age <= 24) return "18_24";
  if (age <= 34) return "25_34";
  if (age <= 44) return "35_44";
  if (age <= 54) return "45_54";
  return "55_plus";
}

async function writeCsv(filename, rows, columns) {
  await fs.writeFile(path.join(outputDir, filename), toCsv(rows, columns), "utf8");
}

async function writeJson(filename, value) {
  await fs.writeFile(path.join(outputDir, filename), JSON.stringify(value, null, 2), "utf8");
}

async function exportDataset() {
  try {
    await mongoose.connect(env.mongoUri);
    await fs.mkdir(outputDir, { recursive: true });

    const [tourists, profiles, trips, bookings, reviews, interactions] = await Promise.all([
      User.find({ role: "tourist" }).select("_id isActive createdAt").lean(),
      TouristProfile.find().lean(),
      Trip.find().select("_id guide title description location price duration category status groupSize rating reviewsCount createdAt").lean(),
      Booking.find().lean(),
      Review.find({ isVisible: true }).lean(),
      Interaction.find().sort({ eventAt: 1 }).lean(),
    ]);

    const profilesByUser = new Map(profiles.map((profile) => [profile.user.toString(), profile]));

    const userRows = tourists.map((tourist) => {
      const profile = profilesByUser.get(tourist._id.toString());
      return {
        user_id: anonymize(tourist._id),
        nationality: profile?.nationality || "unknown",
        preferred_language: profile?.preferredLanguage || "unknown",
        gender: profile?.gender || "unknown",
        age_group: ageGroup(profile?.dateOfBirth),
        is_active: tourist.isActive,
        joined_at: tourist.createdAt?.toISOString() || "",
      };
    });

    const tourRows = trips.map((trip) => ({
      tour_id: anonymize(trip._id),
      guide_id: anonymize(trip.guide),
      title: trip.title,
      description: trip.description,
      location: trip.location,
      category: trip.category,
      price: trip.price,
      duration: trip.duration,
      group_size: trip.groupSize,
      publication_status: trip.status,
      average_rating: trip.rating,
      reviews_count: trip.reviewsCount,
      created_at: trip.createdAt?.toISOString() || "",
    }));

    const bookingRows = bookings.map((booking) => ({
      booking_id: anonymize(booking._id),
      user_id: anonymize(booking.tourist),
      tour_id: anonymize(booking.trip),
      guide_id: anonymize(booking.guide),
      scheduled_at: booking.date?.toISOString() || "",
      number_of_guests: booking.numberOfGuests,
      price_per_person: booking.pricePerPerson,
      total_price: booking.totalPrice,
      guide_earnings: booking.guideEarnings,
      currency: booking.currency,
      booking_status: booking.status,
      payment_status: booking.paymentStatus,
      payment_method: booking.paymentMethod,
      has_special_requests: Array.isArray(booking.specialRequests) && booking.specialRequests.length > 0,
      booking_source: booking.bookingSource,
      created_at: booking.createdAt?.toISOString() || "",
    }));

    const reviewRows = reviews.map((review) => ({
      review_id: anonymize(review._id),
      booking_id: anonymize(review.booking),
      user_id: anonymize(review.tourist),
      tour_id: anonymize(review.trip),
      guide_id: anonymize(review.guide),
      rating: review.rating,
      title: review.title,
      review_text: review.comment,
      language: review.language,
      verified_booking: review.isVerifiedBooking,
      created_at: review.createdAt?.toISOString() || "",
    }));

    const interactionRows = interactions.map((interaction) => ({
      user_id: anonymize(interaction.tourist),
      tour_id: interaction.trip ? anonymize(interaction.trip) : "",
      event_type: interaction.eventType,
      implicit_score: interactionWeights[interaction.eventType] ?? interaction.value ?? 0,
      original_value: interaction.value,
      session_id: anonymize(interaction.sessionId),
      source: interaction.source,
      device: interaction.device,
      query: interaction.metadata?.query || "",
      category: interaction.metadata?.category || "",
      location: interaction.metadata?.location || "",
      result_position: interaction.metadata?.position || 0,
      dwell_time_seconds: interaction.metadata?.dwellTimeSeconds || 0,
      event_at: interaction.eventAt?.toISOString() || "",
    }));

    await Promise.all([
      writeCsv("users.csv", userRows, [
        "user_id",
        "nationality",
        "preferred_language",
        "gender",
        "age_group",
        "is_active",
        "joined_at",
      ]),
      writeCsv("tours.csv", tourRows, [
        "tour_id",
        "guide_id",
        "title",
        "description",
        "location",
        "category",
        "price",
        "duration",
        "group_size",
        "publication_status",
        "average_rating",
        "reviews_count",
        "created_at",
      ]),
      writeCsv("bookings.csv", bookingRows, [
        "booking_id",
        "user_id",
        "tour_id",
        "guide_id",
        "scheduled_at",
        "number_of_guests",
        "price_per_person",
        "total_price",
        "guide_earnings",
        "currency",
        "booking_status",
        "payment_status",
        "payment_method",
        "has_special_requests",
        "booking_source",
        "created_at",
      ]),
      writeCsv("reviews.csv", reviewRows, [
        "review_id",
        "booking_id",
        "user_id",
        "tour_id",
        "guide_id",
        "rating",
        "title",
        "review_text",
        "language",
        "verified_booking",
        "created_at",
      ]),
      writeCsv("interactions.csv", interactionRows, [
        "user_id",
        "tour_id",
        "event_type",
        "implicit_score",
        "original_value",
        "session_id",
        "source",
        "device",
        "query",
        "category",
        "location",
        "result_position",
        "dwell_time_seconds",
        "event_at",
      ]),
      writeJson("dataset-summary.json", {
        generatedAt: new Date().toISOString(),
        anonymized: true,
        counts: {
          users: userRows.length,
          tours: tourRows.length,
          bookings: bookingRows.length,
          reviews: reviewRows.length,
          interactions: interactionRows.length,
        },
        interactionWeights,
        recommendedTargets: {
          recommender: "Predict or rank tour_id for each user_id using interactions.csv.",
          cancellation: "Predict booking_status=cancelled from booking and user/trip features.",
          sentiment: "Predict rating or sentiment bucket from review_text.",
          demand: "Aggregate confirmed/completed bookings by trip, date, location, and category.",
        },
      }),
    ]);

    console.log(`ML dataset exported to: ${outputDir}`);
    console.log({
      users: userRows.length,
      tours: tourRows.length,
      bookings: bookingRows.length,
      reviews: reviewRows.length,
      interactions: interactionRows.length,
    });
  } catch (error) {
    console.error("ML export failed:", error.message, error);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
}

exportDataset();
