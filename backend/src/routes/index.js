import { Router } from "express";
import userRouter from "./user.routes.js";
import tripRouter from "./trip.routes.js";
import bookingRouter from "./booking.routes.js";
import guideRouter from "./guide.routes.js";
import authUserRoutes from "./authUser.routes.js";
import adminRoutes from "./admin.routes.js";
import homeRouter from "./home.routes.js";
import paymentRouter from "./payment.routes.js";

const apiRouter = Router();

apiRouter.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "NEFRU API is running",
  });
});

apiRouter.use('/auth', authUserRoutes);
apiRouter.use('/users', userRouter);
apiRouter.use('/trips', tripRouter);
apiRouter.use('/bookings', bookingRouter);
apiRouter.use('/payments', paymentRouter);
apiRouter.use('/admin',adminRoutes);
apiRouter.use("/home", homeRouter);
apiRouter.use("/guides", guideRouter);

export default apiRouter;
