import { Router } from "express";

import * as BookController from "../controllers/Book.controller.js";
import { authorizeRoles, protect } from "../middlewares/authMiddleware.js";

const bookingRouter = Router();

bookingRouter.use(protect);
bookingRouter.get("/trips/:tripId/availability", authorizeRoles("tourist"), BookController.getTripAvailability);
bookingRouter.post("/", authorizeRoles("tourist"), BookController.createBooking);
bookingRouter.get("/me", authorizeRoles("tourist"), BookController.getMyBookings);
bookingRouter.patch("/:bookingId/cancel", authorizeRoles("tourist"), BookController.cancelMyBooking);
bookingRouter.get("/guide/me", authorizeRoles("guide"), BookController.getGuideBookings);
bookingRouter.patch("/guide/occurrences/complete", authorizeRoles("guide"), BookController.completeOccurrence);
bookingRouter.patch("/guide/occurrences/cancel", authorizeRoles("guide"), BookController.cancelGuideOccurrence);
bookingRouter.get("/:bookingId", BookController.getBookingById);

export default bookingRouter;
