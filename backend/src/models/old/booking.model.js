import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    trip: { type: mongoose.Schema.Types.ObjectId, ref: "Trip", required: true },
    tourist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    guide: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      required: true,
      enum: ["Morning", "Afternoon", "Event"],
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },
    totalPrice: { type: Number, required: true },
  },
  { timestamps: true },
);

export const Booking = mongoose.model("Booking", bookingSchema);
