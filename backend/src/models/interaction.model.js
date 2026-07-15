import mongoose from "mongoose";

const INTERACTION_TYPES = [
  "impression",
  "view",
  "search",
  "save",
  "unsave",
  "share",
  "map_opened",
  "booking_started",
  "booking_completed",
  "booking_cancelled",
  "review_submitted",
];

const interactionSchema = new mongoose.Schema(
  {
    tourist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    trip: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trip",
      default: null,
      index: true,
    },
    eventType: {
      type: String,
      enum: INTERACTION_TYPES,
      required: true,
      index: true,
    },
    value: {
      type: Number,
      default: 1,
    },
    sessionId: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    source: {
      type: String,
      enum: ["home", "search", "tour_details", "saved", "notification", "direct"],
      default: "home",
    },
    device: {
      type: String,
      enum: ["mobile", "desktop", "tablet"],
      default: "mobile",
    },
    metadata: {
      query: { type: String, trim: true, default: "" },
      category: { type: String, trim: true, default: "" },
      location: { type: String, trim: true, default: "" },
      position: { type: Number, min: 0, default: 0 },
      dwellTimeSeconds: { type: Number, min: 0, default: 0 },
    },
    eventAt: {
      type: Date,
      required: true,
      default: Date.now,
      index: true,
    },
  },
  { timestamps: true },
);

interactionSchema.index({ tourist: 1, eventAt: -1 });
interactionSchema.index({ trip: 1, eventType: 1, eventAt: -1 });

export const Interaction = mongoose.model("Interaction", interactionSchema);
export { INTERACTION_TYPES };
