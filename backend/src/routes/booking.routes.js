import { Router } from "express";
import * as BookController from "../controllers/Book.controller.js";
import { protect } from "../middlewares/authMiddleware.js";
const bookingRouter = Router();

bookingRouter.post("/create",
    protect,
    BookController.CreateBooking);
bookingRouter.get("/", protect, BookController.getBookingByID);
bookingRouter.get("/all-booking", protect, BookController.getAllBooking)
bookingRouter.patch("/:Book_id", protect, BookController.updateBooking)
bookingRouter.delete("/:Book_id", protect, BookController.deleteBooking)
bookingRouter.patch(
    "/cancel/:Book_id",
    protect,
    BookController.cancelBooking
);


export default bookingRouter;
