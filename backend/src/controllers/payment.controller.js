import Stripe from "stripe";

import { env } from "../config/env.js";
import { Booking } from "../models/booking.model.js";
import { BookingSeat } from "../models/bookingSeat.model.js";
import { Notification } from "../models/notification.model.js";
import { User } from "../models/user.model.js";
import { expirePendingBookings } from "../services/Booking.service.js";
import { AppError } from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const stripe = env.stripeSecretKey ? new Stripe(env.stripeSecretKey) : null;
const CANCELLABLE_PAYMENT_STATUSES = new Set([
  "requires_payment_method",
  "requires_confirmation",
  "requires_action",
  "requires_capture",
  "processing",
]);

function requireStripe() {
  if (!stripe) {
    throw new AppError(
      "Stripe is not configured. Add STRIPE_SECRET_KEY to the backend environment.",
      503,
      "STRIPE_NOT_CONFIGURED",
    );
  }
  return stripe;
}

async function getStripeUser(userId) {
  const user = await User.findById(userId).select("+stripeCustomerId");
  if (!user) throw new AppError("User not found", 404, "USER_NOT_FOUND");
  return user;
}

async function ensureCustomer(userId) {
  const client = requireStripe();
  const user = await getStripeUser(userId);
  if (user.stripeCustomerId) return { user, customerId: user.stripeCustomerId };
  const customer = await client.customers.create({
    email: user.email,
    metadata: { nefruUserId: user._id.toString() },
  });
  user.stripeCustomerId = customer.id;
  await user.save({ validateBeforeSave: false });
  return { user, customerId: customer.id };
}

async function getPayableBooking(bookingId, touristId) {
  await expirePendingBookings({ _id: bookingId });
  const booking = await Booking.findOne({
    _id: bookingId,
    tourist: touristId,
    status: "pending_payment",
    paymentStatus: "unpaid",
  }).populate("trip");
  if (!booking) throw new AppError("Active payment booking not found", 404, "BOOKING_NOT_PAYABLE");
  const seat = await BookingSeat.findOne({ booking: booking._id });
  if (!seat || (seat.expiresAt && seat.expiresAt <= new Date())) {
    throw new AppError("Your booking hold expired", 409, "HOLD_EXPIRED");
  }
  return { booking, seat };
}

async function finalizeSuccessfulPayment(paymentIntent) {
  const bookingId = paymentIntent.metadata?.bookingId;
  if (!bookingId) return null;
  const booking = await Booking.findById(bookingId).populate("trip");
  if (!booking) return null;
  if (booking.status === "confirmed" && booking.paymentStatus === "paid") return booking;
  if (booking.status === "cancelled") {
    if (booking.paymentStatus !== "paid") {
      booking.paymentStatus = "paid";
      booking.paymentMethod = "card";
      booking.paymentReference = paymentIntent.id;
      booking.stripePaymentIntentId = paymentIntent.id;
      await booking.save();
      await Notification.create({
        user: booking.tourist,
        type: "payment",
        title: "Payment received after cancellation",
        message: "Your card payment completed while this booking was being cancelled. Please contact support for assistance.",
        link: "/user/profile/support",
        entityType: "booking",
        entityId: booking._id,
      });
    }
    return booking;
  }
  if (booking.status !== "pending_payment") return booking;

  const seat = await BookingSeat.findOne({ booking: booking._id });
  if (!seat) return booking;
  booking.paymentStatus = "paid";
  booking.status = "confirmed";
  booking.paymentMethod = "card";
  booking.paymentReference = paymentIntent.id;
  booking.stripePaymentIntentId = paymentIntent.id;
  booking.holdExpiresAt = null;
  seat.expiresAt = null;
  await Promise.all([booking.save(), seat.save()]);

  if (paymentIntent.metadata?.saveCard === "true" && paymentIntent.customer && paymentIntent.payment_method) {
    await requireStripe().customers.update(paymentIntent.customer, {
      invoice_settings: { default_payment_method: paymentIntent.payment_method },
    });
  }

  await Notification.insertMany([
    {
      user: booking.tourist,
      type: "payment",
      title: "Payment completed",
      message: `Your ${booking.trip.title} booking is confirmed.`,
      link: "/user/profile/bookings",
      entityType: "booking",
      entityId: booking._id,
      metadata: { amount: booking.totalPrice, currency: "USD" },
    },
    {
      user: booking.guide,
      type: "booking",
      title: "New confirmed booking",
      message: `A traveler booked ${booking.trip.title} for ${booking.slotDate}.`,
      link: "/guide/bookings",
      entityType: "booking",
      entityId: booking._id,
    },
  ]);
  return booking;
}

export const createPaymentIntent = asyncHandler(async (req, res) => {
  const client = requireStripe();
  const { bookingId, saveCard = true } = req.body;
  if (!bookingId) throw new AppError("bookingId is required", 400, "BOOKING_ID_REQUIRED");
  const { booking } = await getPayableBooking(bookingId, req.user._id);

  if (booking.stripePaymentIntentId) {
    const existing = await client.paymentIntents.retrieve(booking.stripePaymentIntentId);
    if (existing.status === "succeeded") {
      await finalizeSuccessfulPayment(existing);
      return res.status(200).json({
        success: true,
        data: {
          status: "succeeded",
          clientSecret: existing.client_secret,
          paymentIntentId: existing.id,
          amount: booking.totalPrice,
          currency: "USD",
        },
      });
    }
    if (
      existing.status !== "canceled"
      && existing.metadata?.checkoutMethod === "new_card"
    ) {
      return res.status(200).json({
        success: true,
        data: {
          clientSecret: existing.client_secret,
          paymentIntentId: existing.id,
          status: existing.status,
          amount: booking.totalPrice,
          currency: "USD",
        },
        });
    }
    if (CANCELLABLE_PAYMENT_STATUSES.has(existing.status)) {
      await client.paymentIntents.cancel(existing.id);
    }
  }

  const customer = saveCard ? await ensureCustomer(req.user._id) : null;
  const paymentIntent = await client.paymentIntents.create(
    {
      amount: Math.round(booking.totalPrice * 100),
      currency: "usd",
      payment_method_types: ["card"],
      customer: customer?.customerId,
      setup_future_usage: saveCard ? "off_session" : undefined,
      metadata: {
        bookingId: booking._id.toString(),
        touristId: req.user._id.toString(),
        saveCard: saveCard ? "true" : "false",
        checkoutMethod: "new_card",
      },
    },
    {
      idempotencyKey: `nefru-booking-${booking._id}-new-${booking.stripePaymentIntentId || "first"}`,
    },
  );
  booking.stripePaymentIntentId = paymentIntent.id;
  await booking.save();
  res.status(200).json({
    success: true,
    data: {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      status: paymentIntent.status,
      amount: booking.totalPrice,
      currency: "USD",
    },
  });
});

export const payWithSavedCard = asyncHandler(async (req, res) => {
  const client = requireStripe();
  const { bookingId, paymentMethodId } = req.body;
  const { booking } = await getPayableBooking(bookingId, req.user._id);
  const { customerId } = await ensureCustomer(req.user._id);
  const method = await client.paymentMethods.retrieve(paymentMethodId);
  if (method.customer !== customerId) throw new AppError("Saved card not found", 404, "CARD_NOT_FOUND");

  const previousIntentId = booking.stripePaymentIntentId;
  if (previousIntentId) {
    const previousIntent = await client.paymentIntents.retrieve(previousIntentId);
    if (previousIntent.status === "succeeded") {
      await finalizeSuccessfulPayment(previousIntent);
      return res.status(200).json({
        success: true,
        data: {
          status: "succeeded",
          clientSecret: previousIntent.client_secret,
          paymentIntentId: previousIntent.id,
        },
      });
    }
    if (CANCELLABLE_PAYMENT_STATUSES.has(previousIntent.status)) {
      await client.paymentIntents.cancel(previousIntent.id);
    }
  }

  const intent = await client.paymentIntents.create(
    {
      amount: Math.round(booking.totalPrice * 100),
      currency: "usd",
      customer: customerId,
      payment_method: paymentMethodId,
      payment_method_types: ["card"],
      confirm: true,
      use_stripe_sdk: true,
      metadata: {
        bookingId: booking._id.toString(),
        touristId: req.user._id.toString(),
        saveCard: "true",
        checkoutMethod: "saved_card",
      },
    },
    {
      idempotencyKey: `nefru-booking-${booking._id}-saved-${paymentMethodId}-${previousIntentId || "first"}`,
    },
  );
  booking.stripePaymentIntentId = intent.id;
  await booking.save();
  if (intent.status === "succeeded") await finalizeSuccessfulPayment(intent);
  res.status(200).json({
    success: true,
    data: { status: intent.status, clientSecret: intent.client_secret, paymentIntentId: intent.id },
  });
});

export const verifyPayment = asyncHandler(async (req, res) => {
  const client = requireStripe();
  const booking = await Booking.findOne({ _id: req.body?.bookingId, tourist: req.user._id });
  if (!booking?.stripePaymentIntentId) throw new AppError("Payment not found", 404, "PAYMENT_NOT_FOUND");
  const intent = await client.paymentIntents.retrieve(booking.stripePaymentIntentId);
  if (intent.status !== "succeeded") {
    throw new AppError("Payment has not completed", 409, "PAYMENT_NOT_COMPLETED");
  }
  const confirmed = await finalizeSuccessfulPayment(intent);
  if (confirmed.status !== "confirmed" || confirmed.paymentStatus !== "paid") {
    throw new AppError(
      "Payment completed, but this booking is no longer active. Please contact support.",
      409,
      "BOOKING_NOT_ACTIVE",
    );
  }
  res.status(200).json({ success: true, message: "Payment verified", data: { bookingId: confirmed._id } });
});

export const listPaymentMethods = asyncHandler(async (req, res) => {
  const client = requireStripe();
  const user = await getStripeUser(req.user._id);
  if (!user.stripeCustomerId) return res.status(200).json({ success: true, data: { methods: [] } });
  const [methods, customer] = await Promise.all([
    client.paymentMethods.list({ customer: user.stripeCustomerId, type: "card" }),
    client.customers.retrieve(user.stripeCustomerId),
  ]);
  const defaultId = customer.deleted ? "" : customer.invoice_settings?.default_payment_method;
  res.status(200).json({
    success: true,
    data: {
      methods: methods.data.map((method) => ({
        id: method.id,
        brand: method.card.brand,
        last4: method.card.last4,
        expMonth: method.card.exp_month,
        expYear: method.card.exp_year,
        holderName: method.billing_details?.name || "Nefru Traveler",
        isDefault: method.id === defaultId,
      })),
    },
  });
});

export const createSetupIntent = asyncHandler(async (req, res) => {
  const client = requireStripe();
  const { customerId } = await ensureCustomer(req.user._id);
  const intent = await client.setupIntents.create({
    customer: customerId,
    payment_method_types: ["card"],
    usage: "off_session",
    metadata: { touristId: req.user._id.toString() },
  });
  res.status(200).json({ success: true, data: { clientSecret: intent.client_secret } });
});

export const setDefaultPaymentMethod = asyncHandler(async (req, res) => {
  const client = requireStripe();
  const { customerId } = await ensureCustomer(req.user._id);
  const method = await client.paymentMethods.retrieve(req.params.paymentMethodId);
  if (method.customer !== customerId) throw new AppError("Saved card not found", 404, "CARD_NOT_FOUND");
  await client.customers.update(customerId, {
    invoice_settings: { default_payment_method: method.id },
  });
  res.status(200).json({ success: true, message: "Default card updated" });
});

export const deletePaymentMethod = asyncHandler(async (req, res) => {
  const client = requireStripe();
  const user = await getStripeUser(req.user._id);
  if (!user.stripeCustomerId) throw new AppError("Saved card not found", 404, "CARD_NOT_FOUND");
  const method = await client.paymentMethods.retrieve(req.params.paymentMethodId);
  if (method.customer !== user.stripeCustomerId) throw new AppError("Saved card not found", 404, "CARD_NOT_FOUND");
  await client.paymentMethods.detach(method.id);
  const remaining = await client.paymentMethods.list({ customer: user.stripeCustomerId, type: "card", limit: 1 });
  const customer = await client.customers.retrieve(user.stripeCustomerId);
  if (!customer.deleted && customer.invoice_settings?.default_payment_method === method.id) {
    await client.customers.update(user.stripeCustomerId, {
      invoice_settings: { default_payment_method: remaining.data[0]?.id || null },
    });
  }
  res.status(200).json({ success: true, message: "Saved card removed" });
});

export const handleStripeWebhook = async (req, res, next) => {
  try {
    const client = requireStripe();
    const signature = req.headers["stripe-signature"];
    let event;
    if (env.stripeWebhookSecret) {
      event = client.webhooks.constructEvent(req.body, signature, env.stripeWebhookSecret);
    } else if (env.nodeEnv !== "production") {
      event = JSON.parse(Buffer.isBuffer(req.body) ? req.body.toString("utf8") : JSON.stringify(req.body));
    } else {
      throw new AppError("Stripe webhook secret is not configured", 503, "WEBHOOK_NOT_CONFIGURED");
    }
    if (event.type === "payment_intent.succeeded") {
      await finalizeSuccessfulPayment(event.data.object);
    }
    res.status(200).json({ received: true });
  } catch (error) {
    next(error);
  }
};
