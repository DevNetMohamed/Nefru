import mongoose from "mongoose";

import { env } from "../config/env.js";
import { User } from "../models/user.model.js";
import { Trip } from "../models/trip.model.js";
import { Booking } from "../models/booking.model.js";
import { TouristProfile } from "../models/tourist.model.js";
import { GuideProfile } from "../models/guide.model.js";

const seedDatabase = async () => {
  try {
    await mongoose.connect(env.mongoUri);
    console.log("MongoDB connected for seeding");

    // 1. Remove only our demo data, not the whole database
    const seedEmails = [env.emailAdmin, env.emailTourist, env.emailGuide];

    const oldSeedUsers = await User.find({ email: { $in: seedEmails } });
    const oldSeedUserIds = oldSeedUsers.map((user) => user._id);

    await Booking.deleteMany({
      $or: [
        { tourist: { $in: oldSeedUserIds } },
        { guide: { $in: oldSeedUserIds } },
      ],
    });

    await Trip.deleteMany({
      $or: [
        { guide: { $in: oldSeedUserIds } },
        {
          title: {
            $in: [
              "Historic Cairo Walking Trip",
              "Pyramids Half-Day Experience",
              "Alexandria Coastal Trip",
            ],
          },
        },
      ],
    });

    await TouristProfile.deleteMany({
      user: { $in: oldSeedUserIds },
    });

    await GuideProfile.deleteMany({
      user: { $in: oldSeedUserIds },
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
      avatar: "",
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

    const users = [];

    for (let i = 101; i <= 200; i++) {
      User.create({
        fullName: `Demo GuideProfile ${i}`,
        email: `guide${i}@test.com`,
        password: "$2b$10$Lvv6O4uv2YFsdNQMx43GhufhpqiK761pfbexdubNhHqLqc0o5o2US",
        role: "guide",
        avatar: "",
        isActive: true,
        verificationStatus: "approved",
      });
    }

 
    const guideUser = await User.create({
      fullName: "Demo GuideProfile",
      email: env.emailGuide,
      password: env.passwordGuide,
      role: "guide",
      verificationStatus: "approved",
      isActive: true,
      avatar: "",
    });

    console.log("Demo users created");

    // 3. Create profile documents for demo users
    await TouristProfile.create({
      user: tourist._id,
      phoneNumber: "+20 100 123 4567",
      gender: "male",
      nationality: "Egyptian",
      dateOfBirth: new Date("1998-01-01"),
      preferredLanguage: "en",
    });

    // await GuideProfile.create({
    //   user: guideUser._id,
    //   title: "Certified Local GuideProfile",
    //   headline: "Explore Egypt with a trusted local guide",
    //   location: "Cairo, Egypt",
    //   about:
    //     "Passionate local guide helping travelers discover Egypt safely, clearly, and without hidden surprises.",
    //   yearsExperience: 3,
    //   languages: ["English", "Arabic"],
    //   specialties: ["History & Culture", "Food & Culinary"],
    //   heroImage: "",
    //   gallery: [],
    //   rating: 4.8,
    //   reviewsCount: 24,
    // });





    const guide = await GuideProfile.create({
  user: guideUser._id,
  title: "Certified Local GuideProfile",
  headline: "Explore Egypt with a trusted local guide",
  location: "Cairo, Egypt",
  about:
    "Passionate local guide helping travelers discover Egypt safely, clearly, and without hidden surprises.",
  yearsExperience: 3,
  languages: ["English", "Arabic"],
  specialties: ["History & Culture", "Food & Culinary"],
  heroImage: "",
  gallery: [],
  rating: 4.8,
  reviewsCount: 24,
});




    console.log("Demo profiles created");

    // 4. Create dummy trips for guide
    const cairoTrip = await Trip.create({
      title: "Historic Cairo Walking Trip",
      description:
        "Explore Al-Muizz Street, Khan El-Khalili, and historic Islamic Cairo with a local guide.",
      longDescription:
        "A guided walking experience through the heart of old Cairo, focused on culture, history, local stories, and safe navigation.",
      location: "Cairo",
      price: 600,
      duration: "3 hours",
      image: "trips/historic-cairo.jpg",
      guide: guide._id,
      category: "History",
      status: "active",
      groupSize: 10,
      rating: 4.8,
      reviewsCount: 18,
      highlights: [
        {
          title: "Old Cairo",
          text: "Walk through historic streets and landmarks.",
        },
        {
          title: "Local GuideProfile",
          text: "Clear explanation and no hidden fees.",
        },
      ],
    });
    console.log("cairo");

    await Trip.create({
      title: "Pyramids Half-Day Experience",
      description:
        "Visit the Giza Pyramids and Sphinx with a verified local guide.",
      longDescription:
        "A half-day trip around Giza with a trusted local guide, clear pricing, and a structured route.",
      location: "Giza",
      price: 900,
      duration: "Half Day",
      image: "trips/pyramids.webp",
      guide: guide._id,
      category: "Culture",
      status: "active",
      groupSize: 12,
      rating: 4.9,
      reviewsCount: 32,
      highlights: [
        {
          title: "Pyramids",
          text: "Visit Egypt's most iconic landmark.",
        },
        {
          title: "Sphinx",
          text: "Learn the stories behind the monument.",
        },
      ],
    });
    console.log("2");

    await Trip.create({
      title: "Alexandria Coastal Trip",
      description:
        "Discover the beauty of Alexandria's coastline and historic sites with a local guide.",
      longDescription:
        "A full-day coastal and cultural experience in Alexandria with organized stops and clear trip details.",
      location: "Alexandria",
      price: 800,
      duration: "Full Day",
      image: "trips/alexandria.jpg",
      guide: guide._id,
      category: "Culture",
    });

    const alexandTrip = await Trip.create({
      title: "Alexandria Coastal Trip",
      description:
        "Discover the beauty of Alexandria's coastline and historic sites with a local guide.",
      location: "Alexandria",
      price: 800,
      duration: "Full Day",
      image: "trips/alexandria.jpg",
      guide: guide._id,
      category: "Culture",
      status: "active",
      groupSize: 8,
      rating: 4.7,
      reviewsCount: 14,
      highlights: [
        {
          title: "Coastline",
          text: "Enjoy Alexandria's Mediterranean views.",
        },
        {
          title: "Culture",
          text: "Explore the city's historical identity.",
        },
      ],
    });

    console.log("Dummy trips created");

    // TODO:
    // Booking seed is disabled for now because booking.model.js currently has:
    // date: Date + enum ["Morning", "Afternoon", "Event"]
    // This should be fixed by the booking owner before creating demo bookings.
    //
    // await Booking.create({
    //   trip: cairoTrip._id,
    //   tourist: tourist._id,
    //   guide: guideUser._id,
    //   date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    //   status: "confirmed",
    //   totalPrice: cairoTrip.price,
    // });

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
    console.log("GuideProfile:");
    console.log(`Email: ${env.emailGuide}`);
    console.log(`Password: ${env.passwordGuide}`);
    console.log("-----------------------------------");
  } catch (error) {
    console.error("Seed failed:", error.message, error);
  } finally {
    await mongoose.connection.close();
    console.log("Database connection closed");
    process.exit(0);
  }
};

seedDatabase();