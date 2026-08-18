import { Booking } from "../models/booking.model.js";
import { GuideProfile } from "../models/guide.model.js";
import { Trip } from "../models/trip.model.js";
import { AppError } from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const CreateBooking = async (data, tourist) => {
  if (!tourist) {
    throw new AppError("Unauthorized", 401);
  }

  const { trip_id, timeSlot, groupSize } = data;

  if (!trip_id || !timeSlot || !groupSize) {
    throw new AppError("Please provide all required fields", 400);
  }

  const trip = await Trip.findById(trip_id);

  if (!trip) {
    throw new AppError("Trip not found", 404);
  }

  const slot = trip.schedule.slots[timeSlot];

  if (!slot) {
    throw new AppError("Time slot not found.", 404);
  }

  // Make sure groupSize is a valid number
  if (!Number.isInteger(groupSize) || groupSize < 1) {
    throw new AppError("Group size must be at least 1.", 400);
  }

  // Maximum people allowed
  const maxGroupSize = slot.availableSpots;

  if (groupSize > maxGroupSize) {
    throw new AppError(`Maximum available group size is ${maxGroupSize}.`, 400);
  }

  const existingBooking = await Booking.findOne({
    tourist_id: tourist._id,
    trip_id,
    timeSlot,
    status: { $in: ["pending_payment", "Confirmed"] },
  });

  if (existingBooking) {
    throw new AppError("You already booked this trip.", 400);
  }

  // Recalculate price based on current group size
  const totalPrice = trip.price * groupSize;

  const booking = await Booking.create({
    tourist_id: tourist._id,
    guide_id: trip.guide_id,
    trip_id,
    timeSlot,
    groupSize,
    totalPrice,
    status: "Pending",
  });

  // Reduce available spots
  slot.availableSpots -= groupSize;

  await trip.save();

  return booking;
};

export const getBookingByID = async (Booking_id) => {
  const Book_id = await Booking.findById(Booking_id)
    .populate("tourist_id")
    .populate("guide_id")
    .populate("trip_id");
  if (!Book_id) {
    throw new AppError("Can Not Found Booking Id", 404);
  }
  return Book_id;
};

export const getAllBooking = async () => {
  const bookings = await Booking.find()
    .populate("tourist_id", "fullName email")
    .populate("guide_id", "fullName")
    .populate("trip_id", "title location price");

  return bookings;
};

export const updateBooking = async (Booking_id, data) => {
  if (!Booking_id) {
    throw new AppError("Not Found Book_id", 404);
  }
  const { trip_id, timeSlot, groupSize } = data;

  if (!trip_id || !timeSlot || !groupSize) {
    throw new AppError("Please provide all required fields", 400);
  }

  const booking = await Booking.findById(booking_id);
  if (!booking) {
    throw new AppError("Booking not found", 404);
  }

  const updateBooking = await Booking.findByIdAndUpdate(Booking_id, data, {
    new: true,
    runValidators: true,
  });
  return updateBooking;
};

export const cancelBooking = async (booking_id) => {
  if (!booking_id) {
    throw new AppError("Booking ID is required", 400);
  }

  const booking = await Booking.findById(booking_id);

  if (!booking) {
    throw new AppError("Booking not found", 404);
  }

  if (booking.status === "Cancelled") {
    throw new AppError("Booking is already cancelled", 400);
  }

  const trip = await Trip.findById(booking.trip_id);

  if (trip) {
    const slot = trip.schedule.slots.id(booking.timeSlot);

    if (slot) {
      slot.availableSpots += booking.groupSize;
      await trip.save();
    }
  }

  booking.status = "Cancelled";
  await booking.save();

  return booking;
};

export const deleteBooking = async (booking_id) => {
  if (!booking_id) {
    throw new AppError("Booking ID is required", 400);
  }

  const booking = await Booking.findById(booking_id);

  if (!booking) {
    throw new AppError("Booking not found", 404);
  }

  const trip = await Trip.findById(booking.trip_id);

  if (trip) {
    const slot = trip.schedule.slots.id(booking.timeSlot);

    if (slot) {
      slot.availableSpots += booking.groupSize;
      await trip.save();
    }
  }

  const deleteBooking = await Booking.findByIdAndDelete(booking_id);

  return deleteBooking;
};
