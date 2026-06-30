import mongoose from "mongoose";

const highlightSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    text: {
      type: String,
      trim: true,
      maxlength: 100,
    },
  },
  { _id: false },
);

const reviewSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    date: {
      type: String,
      required: true,
      trim: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    avatar: {
      type: String,
      default: "",
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 5,
    },
  },
  { _id: false, timestamps: true },
);

const tripSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    longDescription: {
      type: String,
      trim: true,
      default: "",
    },
    location: { type: String, required: true },
    price: { type: Number, required: true },
    duration: { type: String, required: true }, // e.g., "3 hours", "Full Day"
    image: { type: String, default: "" },
    guide: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: String,
      enum: ["History", "Adventure", "Culture", "Food"],
      required: true,
    },
    status: {
      type: String,
      enum: ["draft", "reviewing", "active"],
      default: "draft",
    },
    groupSize: {
      type: Number,
      min: 1,
      default: 12,
    },
    schedule: {
      type: Object,
      default: { dates: [], slots: [] },
    },
    gallery: {
      type: [String],
      default: [],
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    reviewsCount: {
      type: Number,
      min: 0,
      default: 0,
    },
    highlights: {
      type: [highlightSchema],
      default: [],
    },
    reviews: {
      type: [reviewSchema],
      default: [],
    },
  },
  { timestamps: true },
);

export const Trip = mongoose.model("Trip", tripSchema);
