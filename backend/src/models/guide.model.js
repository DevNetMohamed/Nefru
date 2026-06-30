import mongoose from "mongoose";

const GUIDE_SPECIALTIES = [
  "History & Culture",
  "Food & Culinary",
  "Adventure",
  "Luxury",
  "Nile Cruise",
  "Desert Safari",
];

const galleryItemSchema = new mongoose.Schema(
  {
    src: {
      type: String,
      required: true,
      trim: true,
    },
    alt: {
      type: String,
      trim: true,
      maxlength: 150,
      default: "",
    },
    publicId: {
      type: String,
      trim: true,
      default: "",
      select: false,
    },
  },
  { timestamps: true },
);

const guideSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    title: {
      type: String,
      trim: true,
      maxlength: 100,
      default: "",
    },
    headline: {
      type: String,
      trim: true,
      maxlength: 120,
      default: "",
    },
    location: {
      type: String,
      trim: true,
      maxlength: 100,
      default: "",
    },
    about: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: "",
    },
    yearsExperience: {
      type: Number,
      min: 0,
      max: 60,
      default: 0,
    },
    languages: {
      type: [String],
      default: [],
    },
    specialties: {
      type: [String],
      enum: GUIDE_SPECIALTIES,
      default: [],
    },
    heroImage: {
      type: String,
      trim: true,
      default: "",
    },
    heroImagePublicId: {
      type: String,
      trim: true,
      default: "",
      select: false,
    },
    gallery: {
      type: [galleryItemSchema],
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
  },
  {
    timestamps: true,
  },
);

const Guide = mongoose.model("Guide", guideSchema);

export { Guide, GUIDE_SPECIALTIES };
