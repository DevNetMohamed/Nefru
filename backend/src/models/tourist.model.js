import mongoose from "mongoose";

const touristProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
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
    fullName:{
      type:String,
      required:true
    },
    phoneNumber: {
      type: String,
      trim: true,
      default: "",
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      // default: "other",
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
    language: {
      type: String,
      default: "en",
    }
  },
  { timestamps: true },
);
const TouristProfile = mongoose.model("TouristProfile", touristProfileSchema);

export { TouristProfile };
