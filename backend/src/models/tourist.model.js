import mongoose from "mongoose";
const touristProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    phoneNumber: {
      type: String,
      trim: true,
      default: "",
    },

    gender: {
      type: String,
      enum: ["male", "female", "other"],
      default: "other",
    },

    nationality: {
      type: String,
      trim: true,
      default: "",
    },

    dateOfBirth: {
      type: Date,
      default: null,
    },

    preferredLanguage: {
      type: String,
      default: "en",
    },
    //  paymentMethods: {
    //       type: [String],
    //       default: [],
    //     },

    //  verificationStatus: {
    //       type: String,
    //       enum: ["pending", "approved", "rejected"],
    //       default: "pending",
    //     },
  },
  { timestamps: true },
);
const TouristProfile = mongoose.model("TouristProfile", touristProfileSchema);

export { TouristProfile };

//  phoneNumber: {
//       type: String,
//       trim: true,
//       default: "",
//     },
//     gender: {
//       type: String,
//       enum: ["male", "female", "other"],
//       default: "other",
//     },
//     Nationality: {
//       type: String,
//       trim: true,
//       default: "",
//     },
//     DoB: {
//       type: Date,
//       default: null,
//     },
//     paymentMethods: {
//       type: [String],
//       default: [],
//     },

//     verificationStatus: {
//       type: String,
//       enum: ["pending", "approved", "rejected"],
//       default: "pending",
//     },

// if user is a guide, we can add more fields like:
// guideLicense: {
//   type: String,
//   default: "",
// },
// bio: {
//   type: String,
//   default: "",
// }
// Future: we can add more fields like:
// social media links, etc.

// if guide

// Future document verification
// We are not uploading files now.
// Later we can add:
// document: {
//   url: { type: String , default: ""},
//   publicId: { type: String , default: ""},
//   fileType: { type: String ,enum: ["image", "pdf", ""], default: ""},
//   type: {
//     type: String,
//     enum: ["passport", "national_id", "guide_license"],
//   },
// },
