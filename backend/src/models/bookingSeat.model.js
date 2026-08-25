import mongoose from "mongoose";

const bookingSeatSchema = new mongoose.Schema(
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
    occurrenceKey: { type: String, required: true, trim: true, index: true },
    seatNumber: { type: Number, required: true, min: 1 },
    expiresAt: { type: Date, default: null },
  },
  { timestamps: true },
);

bookingSeatSchema.index(
  { trip: 1, occurrenceKey: 1, seatNumber: 1 },
  { unique: true },
);
bookingSeatSchema.index(
  { trip: 1, occurrenceKey: 1, tourist: 1 },
  { unique: true },
);
bookingSeatSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const BookingSeat = mongoose.model("BookingSeat", bookingSeatSchema);
