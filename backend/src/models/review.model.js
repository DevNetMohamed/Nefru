import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
      unique: true,
    },
    trip: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trip",
      required: true,
      index: true,
    },
    tourist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    guide: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    title: {
      type: String,
      trim: true,
      maxlength: 120,
      default: "",
    },
    comment: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1500,
    },
    language: {
      type: String,
      trim: true,
      lowercase: true,
      default: "en",
    },
    isVerifiedBooking: {
      type: Boolean,
      default: true,
    },
    isVisible: {
      type: Boolean,
      default: true,
    },
    guideResponse: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },
  },
  { timestamps: true },
);

reviewSchema.index({ trip: 1, createdAt: -1 });
reviewSchema.index({ guide: 1, rating: 1 });

export const Review = mongoose.model("Review", reviewSchema);
