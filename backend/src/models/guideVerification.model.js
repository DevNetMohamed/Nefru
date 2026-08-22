import mongoose from "mongoose";

const DOCUMENT_TYPES = ["national_id", "passport", "guide_license"];

const requestedChangeSchema = new mongoose.Schema(
  {
    documentType: {
      type: String,
      enum: DOCUMENT_TYPES,
      required: true,
    },
    message: {
      type: String,
      trim: true,
      maxlength: 500,
      required: true,
    },
    resolvedAt: {
      type: Date,
      default: null,
    },
  },
  { _id: true },
);

const verificationDocumentSchema = new mongoose.Schema(
  {
    documentType: {
      type: String,
      enum: DOCUMENT_TYPES,
      required: true,
    },
    storageKey: {
      type: String,
      required: true,
      select: false,
    },
    originalName: {
      type: String,
      required: true,
      trim: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
    replacedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

const reviewHistorySchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      required: true,
    },
    reason: {
      type: String,
      trim: true,
      default: "",
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    reviewedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true },
);

const guideVerificationSchema = new mongoose.Schema(
  {
    guideProfile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GuideProfile",
      required: true,
      unique: true,
      index: true,
    },
    documents: {
      type: [verificationDocumentSchema],
      default: [],
      select: false,
    },
    requestedChanges: {
      type: [requestedChangeSchema],
      default: [],
      select: false,
    },
    reviewHistory: {
      type: [reviewHistorySchema],
      default: [],
      select: false,
    },
    submittedAt: {
      type: Date,
      default: null,
    },
    reviewedAt: {
      type: Date,
      default: null,
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true },
);

export const GuideVerification = mongoose.model(
  "GuideVerification",
  guideVerificationSchema,
);

export { DOCUMENT_TYPES };
