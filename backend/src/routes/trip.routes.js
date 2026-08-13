import { Router } from "express";
import {
  getAllTrips,
  createTrip,
  getTripById,
  getMyGuideTrips,
  updateMyTrip,
  changeTripStatus,
  updateTripMedia,
} from "../controllers/trip.controller.js";
import { protect } from "../middlewares/authMiddleware.js";
import { upload } from "../config/upload.js";

const tripRouter = Router();

tripRouter.get("/guide/me", protect, getMyGuideTrips);
tripRouter.route("/").get(getAllTrips).post(protect, createTrip);
tripRouter.route("/:id").get(getTripById).patch(protect, updateMyTrip);
tripRouter.patch("/:id/status", protect, changeTripStatus);
tripRouter.patch("/:id/media", protect, updateTripMedia);
tripRouter.post("/:id/upload-media", protect, upload.fields([{ name: "coverImage", maxCount: 1 }, { name: "galleryImages", maxCount: 6 }]), async (req, res) => {
  try {
    const files = req.files || {};
    const coverImage = files.coverImage?.[0];
    const galleryImages = files.galleryImages || [];

    const uploadedFiles = {
      coverImage: coverImage ? `/uploads/${coverImage.filename}` : "",
      galleryImages: galleryImages.map((file) => `/uploads/${file.filename}`),
    };

    res.status(200).json({
      success: true,
      message: "Images uploaded successfully",
      data: uploadedFiles,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default tripRouter;
