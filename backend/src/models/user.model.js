// wil be used for authentication and authorization only
import mongoose from "mongoose";
import bcrypt from "bcrypt";

const USER_ROLES = ["tourist", "guide", "admin"];
const REGISTER_ROLES = ["tourist", "guide"];

const userSchema = new mongoose.Schema(
  {
    authId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
      required: true,
      unique: true,
    },
    role: {
      type: String,
      enum: ["tourist", "guide", "admin"],
      required: true,
      default: "tourist",
      index: true,
    },
    accountStatus: {
      type: String,
      enum: ["active", "suspended", "deactivated"],
      default: "active",
      index: true,
    },
    profileId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "roleProfile",
      required: false
    },
    roleProfile: {
      type: String, 
      enum: ["TouristProfile", "GuideProfile"],
      default:"TouristProfile",
      required: true
    }
  },
  {timestamps: true,}
);


const User = mongoose.model("User", userSchema);

export default User;

// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();
//   this.password = await bcrypt.hash(this.password, 10);
// });

// userSchema.methods.comparePassword = async function (matchedPassword) {
//   return await bcrypt.compare(matchedPassword, this.password);
// };
// const User = mongoose.model("User", userSchema);

export { USER_ROLES, REGISTER_ROLES };
