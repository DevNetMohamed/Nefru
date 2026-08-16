import mongoose from "mongoose";
import bcrypt from "bcrypt";

const USER_ROLES = ["tourist", "guide", "admin"];
const REGISTER_ROLES = ["tourist", "guide"];

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    role: {
      type: String,
      enum: ["tourist", "guide", "admin"],
      required: true,
      default: "tourist",
      index: true,
    },
    status: {
      type: String,
      // suspended > temporary block , deactivated > permenant block
      enum: ["active", "suspended", "deactivated"], 
      default: "active",
      index: true,
    },
    profileId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "roleProfile",
      // required: false
    },
    roleProfile: {
      type: String, 
      enum: ["TouristProfile", "GuideProfile"],
      default:"TouristProfile", 
      // required: true
    }
  },
  {timestamps: true,}
);



// export default User;

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (matchedPassword) {
  return await bcrypt.compare(matchedPassword, this.password);
};

export const User = mongoose.model("User", userSchema);
export { USER_ROLES, REGISTER_ROLES };
