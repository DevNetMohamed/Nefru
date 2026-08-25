import * as BookingService from "../services/Booking.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getTripAvailability = asyncHandler(async (req, res) => {
  const data = await BookingService.getTripAvailability(req.params.tripId);
  res.status(200).json({ success: true, data });
});

export const createBooking = asyncHandler(async (req, res) => {
  const booking = await BookingService.createBooking(req.body, req.user);
  res.status(201).json({ success: true, message: "Your place is held for 15 minutes", data: { booking } });
});

export const getBookingById = asyncHandler(async (req, res) => {
  const booking = await BookingService.getBookingById(req.params.bookingId, req.user);
  res.status(200).json({ success: true, data: { booking } });
});

export const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await BookingService.getMyBookings(req.user);
  res.status(200).json({ success: true, data: { bookings } });
});

export const getGuideBookings = asyncHandler(async (req, res) => {
  const data = await BookingService.getGuideBookings(req.user);
  res.status(200).json({ success: true, data });
});

export const cancelMyBooking = asyncHandler(async (req, res) => {
  const booking = await BookingService.cancelTouristBooking(
    req.params.bookingId,
    req.user,
    req.body?.reason,
  );
  res.status(200).json({ success: true, message: "Booking cancelled", data: { booking } });
});

export const completeOccurrence = asyncHandler(async (req, res) => {
  const data = await BookingService.completeOccurrence(
    req.body?.tripId,
    req.body?.occurrenceKey,
    req.user,
  );
  res.status(200).json({ success: true, message: "Trip marked as completed", data });
});

export const cancelGuideOccurrence = asyncHandler(async (req, res) => {
  const data = await BookingService.cancelGuideOccurrence(
    req.body?.tripId,
    req.body?.occurrenceKey,
    req.user,
    req.body?.reason,
  );
  res.status(200).json({ success: true, message: "Trip occurrence cancelled", data });
});
