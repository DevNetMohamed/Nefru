import { Router } from 'express';
import userRouter from './user.routes.js';
import tripRouter from './trip.routes.js';
import bookingRouter from './booking.routes.js';
import authUserRoutes from "./authUser.routes.js";
import adminRoutes from "./admin.routes.js";

const apiRouter = Router();

apiRouter.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'NEFRU API is running',
  });
});

apiRouter.use('/auth', authUserRoutes);
apiRouter.use('/users', userRouter);
apiRouter.use('/trips', tripRouter);
apiRouter.use('/bookings', bookingRouter);
apiRouter.use('/admin',adminRoutes);

export default apiRouter;
