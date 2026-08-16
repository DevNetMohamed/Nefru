import mongoose from "mongoose";

const BOOKING_STATUSES = [
  "pending_payment",
  "confirmed",
  "completed",
  "cancelled",
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
    guide: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    timeSlot: {
      type: Date,
      // required: true,
      index: true,
    },
    timeSlot: {
      type: String,
      // required: true,
      trim: true,
      maxlength: 50,
    },
    numberOfGuests: {
      type: Number,
      required: true,
      min: 1,
      max: 50,
    },
    pricePerPerson: {
      type: Number,
      required: true,
      min: 0,
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    platformFee: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    guideEarnings: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    currency: {
      type: String,
      trim: true,
      uppercase: true,
      default: "EGP",
    },
    status: {
      type: String,
      enum: BOOKING_STATUSES,
      default: "pending_payment",
      index: true,
    },
    paymentStatus: {
      type: String,
      enum: PAYMENT_STATUSES,
      default: "unpaid",
      index: true,
    },
    paymentMethod: {
      type: String,
      enum: ["card", "wallet", "cash", "none"],
      default: "none",
    },
    paymentReference: {
      type: String,
      trim: true,
      default: "",
    },
    // رقم المعاملة الخاص بـ Stripe (Stripe Payment Intent ID)
    stripePaymentIntentId: {
      type: String,
      trim: true,
      default: "",
    },
    specialRequests: {
      type: [String],
      default: [],
    },
    bookingSource: {
      type: String,
      enum: ["web", "mobile", "admin", "seed"],
      default: "web",
    },
    cancellationReason: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },
    cancelledBy: {
      type: String,
      enum: ["tourist", "admin", "system", ""],
      default: "",
    },
    cancelledAt: {
      type: Date,
      default: null,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    countPerson: {
      type: Number,
      required: true,
      default: 1,
    },
   

  },
  { timestamps: true },
);

bookingSchema.index({ trip: 1, date: 1, status: 1 });
bookingSchema.index({ tourist: 1, createdAt: -1 });
bookingSchema.index({ guide: 1, date: 1 });

export const Booking = mongoose.model("Booking", bookingSchema);
export { BOOKING_STATUSES, PAYMENT_STATUSES };