/* 

// If the user is a guide:
// - Add guide-specific information (license, bio, etc.)
// - Add social media links if needed
// - Add other guide-related fields in the future

// Future: GuideProfile document verification
// - Allow guides to upload verification documents
// - Store document URL and storage ID
// - Store document file type (image/pdf)
// - Store document type (passport/national ID/guide license)
// - Add document verification status if needed later

*/
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

const guideProfileSchema = new mongoose.Schema(
  {
    // firstName:{
    //   type: String,
    //   trim: true,
    //   maxlength: 15,
    //   required:true,
    // },
    // lastName:{
    //   type: String,
    //   trim: true,
    //   maxlength: 15,
    //   required:true,
    // },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    fullName: {
      type: String,
      required: true,
    },

    verificationStatus: {
      type: String,
      enum: ["draft", "pending", "approved", "rejected"],
      default: "draft",
      index: true,
    },

    rejectionReason: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
      select: false,
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
    avatar: {
      type: String,
      trim: true,
      default: "",
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
  { timestamps: true },
);

const GuideProfile = mongoose.model("GuideProfile", guideProfileSchema);

export { GuideProfile, GUIDE_SPECIALTIES };
