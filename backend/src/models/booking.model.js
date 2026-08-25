import mongoose from "mongoose";

const BOOKING_STATUSES = [
  "pending_payment",
  "confirmed",
  "completed",
  "cancelled",
  "expired",
  "refunded",
  "no_show",
];

const PAYMENT_STATUSES = [
  "unpaid",
  "paid",
  "failed",
  "refunded",
  "partially_refunded",
];

const bookingSchema = new mongoose.Schema(
  {
    trip: { type: mongoose.Schema.Types.ObjectId, ref: "Trip", required: true, index: true },
    tourist: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    guide: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    occurrenceKey: { type: String, required: true, trim: true, index: true },
    slotDate: { type: String, required: true, match: /^\d{4}-\d{2}-\d{2}$/, index: true },
    date: { type: Date, required: true, index: true },
    endAt: { type: Date, required: true, index: true },
    timeSlot: { type: String, required: true, trim: true, maxlength: 50 },
    numberOfGuests: { type: Number, required: true, min: 1, max: 1, default: 1 },
    pricePerPerson: { type: Number, required: true, min: 0 },
    totalPrice: { type: Number, required: true, min: 0 },
    platformFee: { type: Number, required: true, min: 0, default: 0 },
    guideEarnings: { type: Number, required: true, min: 0, default: 0 },
    currency: { type: String, enum: ["USD"], default: "USD" },
    status: { type: String, enum: BOOKING_STATUSES, default: "pending_payment", index: true },
    paymentStatus: { type: String, enum: PAYMENT_STATUSES, default: "unpaid", index: true },
    paymentMethod: { type: String, enum: ["card", "none"], default: "none" },
    paymentReference: { type: String, trim: true, default: "" },
    stripePaymentIntentId: { type: String, trim: true, default: "", index: true },
    specialRequests: { type: [String], default: [] },
    bookingSource: { type: String, enum: ["web", "mobile", "admin", "seed"], default: "web" },
    holdExpiresAt: { type: Date, default: null, index: true },
    cancellationReason: { type: String, trim: true, maxlength: 500, default: "" },
    cancelledBy: { type: String, enum: ["tourist", "guide", "admin", "system", ""], default: "" },
    cancelledAt: { type: Date, default: null },
    completedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

bookingSchema.index({ trip: 1, occurrenceKey: 1, status: 1 });
bookingSchema.index({ tourist: 1, createdAt: -1 });
bookingSchema.index({ guide: 1, date: 1 });
bookingSchema.index({ status: 1, holdExpiresAt: 1 });

export const Booking = mongoose.model("Booking", bookingSchema);
export { BOOKING_STATUSES, PAYMENT_STATUSES };
