import { asyncHandler } from "../utils/asyncHandler.js";
import * as BookService from "../services/Booking.service.js"


export const CreateBooking = asyncHandler(async (req, res, next) => {
  const newBook = await BookService.CreateBooking(req.body, req.user._id);
  return res.status(201).json({
    message: "Booking Created Successfully",
    deta: newBook,
  });
});

export const getBookingByID = asyncHandler(async (req, res, next) => {
  const booking = await BookService.getBookingByID(req.query.Book_id);
  return res.status(200).json({
    Success: true,
    data: booking
  })
});

export const getAllBooking = asyncHandler(async (req, res, next) => {
  const AllBooking = await BookService.getAllBooking()
  return res.status(200).json({
    Success: true,
    data: AllBooking
  })
});

export const updateBooking = asyncHandler(async (req, res, next) => {
  const { Booking_id } = req.params;
  const { data } = req.body;
  const PatchBooking = await BookService.updateBooking(Booking_id, data);
  return res.status(200).json({
    Success: true,
    data: PatchBooking
  })
});


export const cancelBooking = asyncHandler(async (req, res, next) => {
  const { Book_id } = req.params;
  const booking = await BookService.cancelBooking(Book_id);
  return res.status(200).json({
    Success: true,
    message: "The Booking Trip is Canceled Successfully",
    data: booking
  })
});

export const deleteBooking = asyncHandler(async (req, res, next) => {
  const { Booking_id } = req.query;
  const deleteBook = await BookService.deleteBooking(Booking_id)
  return res.status(200).json({
    message: "Booking deleted successfully",
  })
});