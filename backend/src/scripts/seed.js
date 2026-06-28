

// require("dotenv").config();

// const mongoose = require("mongoose");
// const Admin = require("../models/admin.model");

// const seedSuperAdmin = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URI);
//     console.log("Connected to MongoDB for seeding Super Admin");

//     const existingAdmin = await Admin.findOne({
//       email: process.env.EMAIL_ADMIN,
//     });

//     if (existingAdmin) {
//       console.log("Super Admin already exists. Skipping seeding.");
//     }
//     // Create New Admin

//     const superAdminData = {
//       userfullName: "Super Admin",
//       email: process.env.EMAIL_ADMIN,
//       password: process.env.PASSWORD_ADMIN,
//     };

//     const admin = await Admin.create(superAdminData);

//     console.log(`Super Admin created successfully: ${admin.email}`);
//   } catch (error) {
//     console.error("Error creating Super Admin:", error.message);
//   } finally {
//     await mongoose.connection.close();
//     console.log("Database connection closed");
//     process.exit(0);
//   }
// };

// seedSuperAdmin();


import mongoose from "mongoose";

import { env } from "../config/env.js";
import { User } from "../models/user.model.js";
import { Trip } from "../models/trip.model.js";
import { Booking } from "../models/booking.model.js";
import { TouristProfile } from "../models/tourist.model.js";
import { Guide } from "../models/guide.model.js";
const seedDatabase = async () => {
  try {
    await mongoose.connect(env.mongoUri);
    console.log("MongoDB connected for seeding");

    // 1. Remove only our demo data, not the whole database
    const seedEmails = [env.emailAdmin, env.emailTourist, env.emailGuide];

    const oldSeedUsers = await User.find({ email: { $in: seedEmails } });
    const oldSeedUserIds = oldSeedUsers.map((user) => user._id);

    await Booking.deleteMany({
      tourist: { $in: oldSeedUserIds },
    });

    await Trip.deleteMany({
      title: {
        $in: [
          "Historic Cairo Walking Tour",
          "Pyramids Half-Day Experience",
          "Alexandria Coastal Tour",
        ],
      },
    });

    await User.deleteMany({
      email: { $in: seedEmails },
    });

    console.log("Old seed data removed");

    // 2. Create demo users
    const admin = await User.create({
      fullName: "Nefru Admin",
      email: env.emailAdmin,
      password: env.passwordAdmin,
      role: "admin",
      verificationStatus: "approved",
      isActive: true,
    });

    const tourist = await User.create({
      fullName: "Demo Tourist",
      email: env.emailTourist,
      password: env.passwordTourist,
      role: "tourist",
      verificationStatus: "approved",
      isActive: true,
      avatar: "",
    });

    const guide = await User.create({
      fullName: "Demo Guide",
      email: env.emailGuide,
      password: env.passwordGuide,
      role: "guide",
      verificationStatus: "approved",
      isActive: true,
      avatar: "",
    });

    console.log("Demo users created");


    // please Edit " الناس اللي هتعمل الmodel تعدلها للكل هنا"
    // 3. Create dummy trips for guide
    const cairoTrip = await Trip.create({
      title: "Historic Cairo Walking Tour",
      description:
        "Explore Al-Muizz Street, Khan El-Khalili, and historic Islamic Cairo with a local guide.",
      location: "Cairo",
      price: 600,
      duration: "3 hours",
      image: "",
      guide: guide._id,
      category: "History",
    });

    const pyramidsTrip = await Trip.create({
      title: "Pyramids Half-Day Experience",
      description:
        "Visit the Giza Pyramids and Sphinx with a verified local guide.",
      location: "Giza",
      price: 900,
      duration: "Half Day",
      image: "",
      guide: guide._id,
      category: "Culture",
    });

    const alexandriaTrip = await Trip.create({
      title: "Alexandria Coastal Tour",
      description:
        "Discover the beauty of Alexandria's coastline and historic sites with a local guide.",
      location: "Alexandria",
      price: 800,
      duration: "Full Day",
      image: "",
      guide: guide._id,
      category: "Culture",
    });

    console.log("Dummy trips created");

    // 4. Create dummy booking for tourist
    await Booking.create({
      trip: cairoTrip._id,
      tourist: tourist._id,
      guide: guide._id,
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      status: "confirmed",
      totalPrice: cairoTrip.price,
    });

    console.log("Dummy booking created");

    console.log("-----------------------------------");
    console.log("Seed completed successfully");
    console.log("-----------------------------------");
    console.log("Admin:");
    console.log(`Email: ${env.emailAdmin}`);
    console.log(`Password: ${env.passwordAdmin}`);
    console.log("-----------------------------------");
    console.log("Tourist:");
    console.log(`Email: ${env.emailTourist}`);
    console.log(`Password: ${env.passwordTourist}`);
    console.log("-----------------------------------");
    console.log("Guide:");
    console.log(`Email: ${env.emailGuide}`);
    console.log(`Password: ${env.passwordGuide}`);
    console.log("-----------------------------------");
  } catch (error) {
    console.error("Seed failed:", error.message);
  } finally {
    await mongoose.connection.close();
    console.log("Database connection closed");
    process.exit(0);
  }
};

seedDatabase();