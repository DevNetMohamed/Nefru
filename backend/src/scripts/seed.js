import mongoose from "mongoose";

import { env } from "../config/env.js";
import { User } from "../models/user.model.js";
import { Trip } from "../models/trip.model.js";
import { Booking } from "../models/booking.model.js";
import { TouristProfile } from "../models/tourist.model.js";
import { GuideProfile } from "../models/guide.model.js";
import { Notification } from "../models/notification.model.js";
import { Review } from "../models/review.model.js";
import { Interaction } from "../models/interaction.model.js";

const DAY_MS = 24 * 60 * 60 * 1000;
const PLATFORM_FEE_RATE = 0.12;
const SEED_EMAIL_SUFFIX = "@nefru.com";

function dateAt(daysFromNow, hour = 9, minute = 0) {
  const date = new Date(Date.now() + daysFromNow * DAY_MS);
  date.setHours(hour, minute, 0, 0);
  return date;
}

function dateOnly(daysFromNow) {
  return dateAt(daysFromNow).toISOString().slice(0, 10);
}

function roundMoney(value) {
  return Math.round(value * 100) / 100;
}

function average(values) {
  if (!values.length) return 0;
  return Math.round((values.reduce((sum, value) => sum + value, 0) / values.length) * 10) / 10;
}

function createRng(seed = 20260715) {
  let state = seed >>> 0;
  return () => {
    state = (1664525 * state + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

const random = createRng();

function pick(items) {
  return items[Math.floor(random() * items.length)];
}

function randomInt(min, max) {
  return Math.floor(random() * (max - min + 1)) + min;
}

const guideSeedData = [
  {
    fullName: "Mohamed Hassan",
    email: env.emailGuide,
    verificationStatus: "approved",
    isActive: true,
    avatar: "https://i.pravatar.cc/300?img=12",
    title: "Licensed Egyptologist GuideProfile",
    headline: "History-rich tours with clear plans and local stories",
    location: "Cairo, Egypt",
    about:
      "Licensed guide specializing in Cairo and Giza. I focus on accurate history, organized meeting points, and a relaxed experience without surprise costs.",
    yearsExperience: 8,
    languages: ["Arabic", "English"],
    specialties: ["History & Culture", "Food & Culinary"],
  },
  {
    fullName: "Mariam El-Sayed",
    email: `mariamguide${SEED_EMAIL_SUFFIX}`,
    verificationStatus: "approved",
    isActive: true,
    avatar: "https://i.pravatar.cc/300?img=47",
    title: "Cultural Trip GuideProfile",
    headline: "Cairo neighborhoods, local food, and everyday Egyptian culture",
    location: "Cairo, Egypt",
    about:
      "I design small-group cultural and food experiences for travelers who want to understand modern local life as well as history.",
    yearsExperience: 6,
    languages: ["Arabic", "English", "French"],
    specialties: ["Food & Culinary", "History & Culture"],
  },
  {
    fullName: "Omar Khalil",
    email: `omarguide${SEED_EMAIL_SUFFIX}`,
    verificationStatus: "approved",
    isActive: true,
    avatar: "https://i.pravatar.cc/300?img=15",
    title: "Upper Egypt Specialist",
    headline: "Luxor and Aswan experiences for curious travelers",
    location: "Luxor, Egypt",
    about:
      "Upper Egypt guide focused on temples, archaeology, and practical trip logistics for solo travelers and small groups.",
    yearsExperience: 10,
    languages: ["Arabic", "English", "German"],
    specialties: ["History & Culture", "Nile Cruise"],
  },
  {
    fullName: "Salma Nassar",
    email: `salmaguide${SEED_EMAIL_SUFFIX}`,
    verificationStatus: "pending",
    isActive: true,
    avatar: "https://i.pravatar.cc/300?img=44",
    title: "Desert Adventure GuideProfile",
    headline: "Responsible desert trips and authentic oasis experiences",
    location: "Siwa, Egypt",
    about:
      "Adventure guide building safe and responsible desert experiences. My profile is still under admin review.",
    yearsExperience: 4,
    languages: ["Arabic", "English", "Italian"],
    specialties: ["Adventure", "Desert Safari"],
  },
  {
    fullName: "Youssef Farouk",
    email: `youssefguide${SEED_EMAIL_SUFFIX}`,
    verificationStatus: "approved",
    isActive: false,
    avatar: "https://i.pravatar.cc/300?img=11",
    title: "Alexandria Local GuideProfile",
    headline: "Mediterranean history and coastal city walks",
    location: "Alexandria, Egypt",
    about:
      "Alexandria-based guide. This account is intentionally inactive to test hidden and suspended guide scenarios.",
    yearsExperience: 5,
    languages: ["Arabic", "English", "Spanish"],
    specialties: ["History & Culture", "Food & Culinary"],
  },
];

const touristSeedData = [
  ["John Carter", env.emailTourist, "American", "en", "male", "1993-04-12"],
  ["Laura Martinez", `laura${SEED_EMAIL_SUFFIX}`, "Spanish", "es", "female", "1995-08-09"],
  ["Thomas Becker", `thomas${SEED_EMAIL_SUFFIX}`, "German", "de", "male", "1988-11-21"],
  ["Sophie Anderson", `sophie${SEED_EMAIL_SUFFIX}`, "British", "en", "female", "1997-02-16"],
  ["Piotr Kowalski", `piotr${SEED_EMAIL_SUFFIX}`, "Polish", "pl", "male", "1991-07-03"],
  ["Camille Dubois", `camille${SEED_EMAIL_SUFFIX}`, "French", "fr", "female", "1994-05-29"],
  ["Luca Rossi", `luca${SEED_EMAIL_SUFFIX}`, "Italian", "it", "male", "1989-09-18"],
  ["Ana Silva", `ana${SEED_EMAIL_SUFFIX}`, "Portuguese", "pt", "female", "1996-01-11"],
  ["Daniel Kim", `daniel${SEED_EMAIL_SUFFIX}`, "South Korean", "ko", "male", "1992-10-05"],
  ["Emma Wilson", `emma${SEED_EMAIL_SUFFIX}`, "Canadian", "en", "female", "1998-06-22"],
  ["Carlos Rivera", `carlos${SEED_EMAIL_SUFFIX}`, "Mexican", "es", "male", "1990-12-14"],
  ["Nora Jensen", `nora${SEED_EMAIL_SUFFIX}`, "Danish", "en", "female", "1987-03-30"],
  ["Hiro Tanaka", `hiro${SEED_EMAIL_SUFFIX}`, "Japanese", "en", "male", "1995-09-02"],
  ["Maya Patel", `maya${SEED_EMAIL_SUFFIX}`, "Indian", "en", "female", "1999-05-17"],
  ["Adam Novak", `adam${SEED_EMAIL_SUFFIX}`, "Czech", "en", "male", "1993-01-27"],
].map(([fullName, email, nationality, preferredLanguage, gender, dateOfBirth], index) => ({
  fullName,
  email,
  nationality,
  preferredLanguage,
  gender,
  dateOfBirth,
  isActive: index !== 14,
  verificationStatus: "approved",
  avatar: `https://i.pravatar.cc/300?img=${20 + index}`,
}));

const tripSeedData = [
  {
    guideIndex: 0,
    title: "Pyramids Sunrise & Sphinx Experience",
    description: "Visit the Giza Pyramids and Sphinx early with a licensed local guide.",
    longDescription:
      "A structured early-morning experience with clear meeting instructions, historical context, photo stops, and no forced shopping detours.",
    location: "Giza",
    price: 1200,
    duration: "4 hours",
    image: "trips/pyramids.webp",
    category: "History",
    status: "active",
    groupSize: 12,
    dateOffsets: [-35, -12, 1, 8, 20],
    slots: [{ startTime: "09:30 AM", endTime: "01:30 PM", maxGuests: 12 }],
    highlights: [
      { title: "Early Entry", text: "Start before the busiest visitor period." },
      { title: "Licensed GuideProfile", text: "Historical explanations in simple English." },
    ],
  },
  {
    guideIndex: 0,
    title: "Historic Cairo Walking Trip",
    description: "Explore Al-Muizz Street, Khan El-Khalili, and Islamic Cairo.",
    longDescription:
      "A walking trip through historic Cairo focused on architecture, local stories, safe navigation, and transparent pricing.",
    location: "Cairo",
    price: 700,
    duration: "3 hours",
    image: "trips/historic-cairo.jpg",
    category: "History",
    status: "active",
    groupSize: 10,
    dateOffsets: [-22, -5, 2, 10, 17],
    slots: [{ startTime: "04:00 PM", endTime: "07:00 PM", maxGuests: 10 }],
    highlights: [
      { title: "Al-Muizz Street", text: "Walk through one of Cairo's richest historic areas." },
      { title: "Local Context", text: "Understand traditions, markets, and daily life." },
    ],
  },
  {
    guideIndex: 4,
    title: "Alexandria Coastal & Heritage Trip",
    description: "Discover Alexandria's coastline, library district, and historic landmarks.",
    longDescription:
      "A full-day coastal experience with organized stops, Mediterranean views, and stories from ancient and modern Alexandria.",
    location: "Alexandria",
    price: 1500,
    duration: "Full Day",
    image: "trips/alexandria.jpg",
    category: "Culture",
    status: "active",
    groupSize: 8,
    dateOffsets: [-30, 4, 14],
    slots: [{ startTime: "08:00 AM", endTime: "05:00 PM", maxGuests: 8 }],
    highlights: [
      { title: "Mediterranean Coast", text: "See Alexandria's waterfront and landmarks." },
      { title: "City Heritage", text: "Connect ancient history with modern Alexandria." },
    ],
  },
  {
    guideIndex: 2,
    title: "Luxor East & West Banks",
    description: "A full-day journey through Luxor's major temples and royal sites.",
    longDescription:
      "Visit selected East and West Bank landmarks with an Upper Egypt specialist, with time for questions and practical breaks.",
    location: "Luxor",
    price: 1900,
    duration: "Full Day",
    image: "trips/Luxor.jpg",
    category: "History",
    status: "active",
    groupSize: 14,
    dateOffsets: [-28, -15, -3, 6, 18],
    slots: [{ startTime: "08:00 AM", endTime: "05:00 PM", maxGuests: 14 }],
    highlights: [
      { title: "Temple Route", text: "A balanced route across major Luxor sites." },
      { title: "Archaeology", text: "Clear explanations without overwhelming jargon." },
    ],
  },
  {
    guideIndex: 1,
    title: "Nile Sunset Felucca",
    description: "Relax on a traditional felucca during sunset in Cairo.",
    longDescription:
      "A calm small-group Nile sailing experience with a clear meeting point, bottled water, and sunset photo opportunities.",
    location: "Cairo",
    price: 500,
    duration: "2 hours",
    image: "trips/alexandria.jpg",
    category: "Culture",
    status: "active",
    groupSize: 8,
    dateOffsets: [-18, -4, 3, 9, 15],
    slots: [{ startTime: "05:00 PM", endTime: "07:00 PM", maxGuests: 8 }],
    highlights: [
      { title: "Sunset Sailing", text: "Enjoy a calm Nile view at golden hour." },
      { title: "Small Group", text: "Limited capacity for a relaxed experience." },
    ],
  },
  {
    guideIndex: 1,
    title: "Cairo Street Food Evening",
    description: "Taste Egyptian street food with a local cultural guide.",
    longDescription:
      "An evening food walk covering selected trusted vendors, food stories, and options for common dietary preferences.",
    location: "Cairo",
    price: 850,
    duration: "3 hours",
    image: "trips/historic-cairo.jpg",
    category: "Food",
    status: "active",
    groupSize: 8,
    dateOffsets: [-16, -6, 5, 12],
    slots: [{ startTime: "06:00 PM", endTime: "09:00 PM", maxGuests: 8 }],
    highlights: [
      { title: "Local Tastings", text: "Try selected Egyptian dishes and drinks." },
      { title: "Dietary Notes", text: "Share dietary requests before the trip." },
    ],
  },
  {
    guideIndex: 3,
    title: "Siwa Desert Safari & Sunset",
    description: "A planned desert safari with oasis stops and sunset views.",
    longDescription:
      "A desert experience currently waiting for admin review. It is useful for testing reviewing-state behavior and hidden public listings.",
    location: "Siwa",
    price: 2200,
    duration: "6 hours",
    image: "trips/pyramids.webp",
    category: "Adventure",
    status: "reviewing",
    groupSize: 6,
    dateOffsets: [12, 26],
    slots: [{ startTime: "01:00 PM", endTime: "07:00 PM", maxGuests: 6 }],
    highlights: [{ title: "Desert Route", text: "Planned stops with safety considerations." }],
  },
  {
    guideIndex: 0,
    title: "Coptic Cairo & Civilization Museum",
    description: "Explore Coptic Cairo and the National Museum of Egyptian Civilization.",
    longDescription:
      "A new cultural itinerary submitted for admin review, with an organized route between Old Cairo and Fustat.",
    location: "Cairo",
    price: 1100,
    duration: "5 hours",
    image: "trips/historic-cairo.jpg",
    category: "Culture",
    status: "reviewing",
    groupSize: 10,
    dateOffsets: [11, 21],
    slots: [{ startTime: "09:00 AM", endTime: "02:00 PM", maxGuests: 10 }],
    highlights: [{ title: "Two Eras", text: "Connect Coptic heritage with Egyptian civilization." }],
  },
  {
    guideIndex: 2,
    title: "Abu Simbel Day Trip",
    description: "A draft full-day itinerary from Aswan to Abu Simbel.",
    longDescription:
      "A partially completed draft used to test continue-editing and incomplete schedule scenarios.",
    location: "Aswan",
    price: 2600,
    duration: "Full Day",
    image: "trips/Luxor.jpg",
    category: "History",
    status: "draft",
    groupSize: 10,
    dateOffsets: [],
    slots: [],
    highlights: [],
  },
  {
    guideIndex: 4,
    title: "Islamic Cairo Night Photography Walk",
    description: "A draft night photography and architecture walk.",
    longDescription:
      "A draft trip owned by an inactive guide, useful for admin visibility and access-control testing.",
    location: "Cairo",
    price: 950,
    duration: "3 hours",
    image: "trips/historic-cairo.jpg",
    category: "Culture",
    status: "draft",
    groupSize: 6,
    dateOffsets: [],
    slots: [],
    highlights: [],
  },
];

const bookingSeedData = [
  // Upcoming confirmed bookings: 13 unique tourists appear across the total booking set.
  [0, 0, 1, 9, 30, 2, "confirmed", "paid", ["Hotel pickup information requested"]],
  [1, 0, 1, 9, 30, 1, "confirmed", "paid", []],
  [2, 1, 2, 16, 0, 2, "confirmed", "paid", ["Vegetarian food preference"]],
  [3, 2, 4, 8, 0, 1, "confirmed", "paid", []],
  [4, 4, 3, 17, 0, 2, "confirmed", "paid", []],
  [5, 5, 5, 18, 0, 1, "pending_payment", "unpaid", ["No spicy food"]],
  [6, 0, 8, 9, 30, 1, "confirmed", "paid", []],
  [7, 1, 10, 16, 0, 1, "confirmed", "paid", []],
  [8, 3, 6, 8, 0, 2, "confirmed", "paid", ["Wheelchair assistance requested"]],
  [9, 4, 9, 17, 0, 1, "pending_payment", "unpaid", []],
  [10, 5, 12, 18, 0, 2, "confirmed", "paid", []],
  [11, 2, 14, 8, 0, 2, "confirmed", "paid", []],
  [12, 3, 18, 8, 0, 1, "pending_payment", "unpaid", []],

  // Past completed bookings used for reviews, history, earnings, and recommendations.
  [0, 4, -18, 17, 0, 1, "completed", "paid", []],
  [1, 1, -22, 16, 0, 2, "completed", "paid", []],
  [2, 3, -28, 8, 0, 1, "completed", "paid", []],
  [3, 5, -16, 18, 0, 2, "completed", "paid", ["Vegetarian food preference"]],
  [4, 0, -35, 9, 30, 2, "completed", "paid", []],
  [5, 3, -15, 8, 0, 1, "completed", "paid", []],
  [6, 1, -5, 16, 0, 1, "completed", "paid", []],
  [7, 4, -4, 17, 0, 2, "completed", "paid", []],

  // Negative and edge scenarios.
  [8, 0, 20, 9, 30, 1, "cancelled", "refunded", [], "Changed travel dates", "tourist"],
  [9, 2, 14, 8, 0, 1, "cancelled", "refunded", [], "Flight schedule changed", "tourist"],
  [10, 5, -6, 18, 0, 1, "no_show", "paid", []],
  [11, 0, -12, 9, 30, 2, "refunded", "refunded", [], "Trip cancelled by platform due to site closure", "system"],
];

const reviewSeedData = [
  {
    bookingIndex: 13,
    rating: 5,
    title: "Peaceful sunset experience",
    comment: "The boat was clean, the meeting point was easy to find, and Mariam made the group feel comfortable. The sunset timing was perfect.",
  },
  {
    bookingIndex: 14,
    rating: 4,
    title: "Great historical walk",
    comment: "Mohamed explained the architecture clearly and helped us avoid the confusing parts of the market. The trip started around ten minutes late, but the experience was very good.",
  },
  {
    bookingIndex: 15,
    rating: 5,
    title: "Excellent Luxor guide",
    comment: "Omar had deep knowledge and kept the long day organized. We had enough breaks and never felt rushed.",
  },
  {
    bookingIndex: 16,
    rating: 4,
    title: "Tasty and friendly trip",
    comment: "The food choices were interesting and the vegetarian alternatives were handled well. A few streets were crowded, but the guide managed the group professionally.",
  },
  {
    bookingIndex: 17,
    rating: 5,
    title: "Best start to our Egypt trip",
    comment: "Clear instructions, no surprise fees, and enough time for photos. Mohamed answered every question without making the explanation too complicated.",
  },
  {
    bookingIndex: 18,
    rating: 3,
    title: "Informative but a long day",
    comment: "The temples were amazing and the guide was knowledgeable. The day felt longer than expected and the lunch stop could have been better organized.",
  },
  {
    bookingIndex: 19,
    rating: 3,
    title: "Good route, crowded timing",
    comment: "The historic area was worth visiting and the explanations were useful. We arrived during a very busy period, so some parts felt rushed.",
  },
  {
    bookingIndex: 20,
    rating: 2,
    title: "Nice view but communication can improve",
    comment: "The Nile view was beautiful, but the meeting instructions changed late and the update was not very clear. The guide was polite and apologized.",
  },
];

async function removeOldSeedData() {
  const seedEmails = [env.emailAdmin, env.emailGuide, env.emailTourist];
  const oldUsers = await User.find({
    $or: [
      { email: { $in: seedEmails } },
      { email: { $regex: `${SEED_EMAIL_SUFFIX.replace(".", "\\.")}$`, $options: "i" } },
    ],
  }).select("_id");

  const oldUserIds = oldUsers.map((user) => user._id);
  const oldGuideProfiles = await GuideProfile.find({ user: { $in: oldUserIds } }).select("_id");
  const oldGuideProfileIds = oldGuideProfiles.map((guide) => guide._id);
  const seedTitles = tripSeedData.map((trip) => trip.title).concat([
    "Pyramids Half-Day Experience",
    "Alexandria Coastal Trip",
  ]);

  const oldTrips = await Trip.find({
    $or: [
      { guide: { $in: [...oldUserIds, ...oldGuideProfileIds] } },
      { title: { $in: seedTitles } },
    ],
  }).select("_id");
  const oldTripIds = oldTrips.map((trip) => trip._id);

  await Promise.all([
    Notification.deleteMany({ user: { $in: oldUserIds } }),
    Interaction.deleteMany({
      $or: [{ tourist: { $in: oldUserIds } }, { trip: { $in: oldTripIds } }],
    }),
    Review.deleteMany({
      $or: [
        { tourist: { $in: oldUserIds } },
        { guide: { $in: oldUserIds } },
        { trip: { $in: oldTripIds } },
      ],
    }),
    Booking.deleteMany({
      $or: [
        { tourist: { $in: oldUserIds } },
        { guide: { $in: oldUserIds } },
        { trip: { $in: oldTripIds } },
      ],
    }),
  ]);

  await Trip.deleteMany({ _id: { $in: oldTripIds } });
  await TouristProfile.deleteMany({ user: { $in: oldUserIds } });
  await GuideProfile.deleteMany({ user: { $in: oldUserIds } });
  await User.deleteMany({ _id: { $in: oldUserIds } });
}

async function createUsersAndProfiles() {
  const admin = await User.create({
    fullName: "Nefru Admin",
    email: env.emailAdmin,
    password: env.passwordAdmin,
    role: "admin",
    verificationStatus: "approved",
    isActive: true,
  });

  const guideUsers = await User.create(
    guideSeedData.map((guide) => ({
      fullName: guide.fullName,
      email: guide.email,
      password: env.passwordGuide,
      role: "guide",
      verificationStatus: guide.verificationStatus,
      isActive: guide.isActive,
      avatar: guide.avatar,
    })),
  );

  const guideProfiles = await GuideProfile.create(
    guideSeedData.map((guide, index) => ({
      user: guideUsers[index]._id,
      fullName: guide.fullName,
      title: guide.title,
      headline: guide.headline,
      location: guide.location,
      about: guide.about,
      yearsExperience: guide.yearsExperience,
      languages: guide.languages,
      specialties: guide.specialties,
      heroImage: "",
      gallery: [],
      rating: 0,
      reviewsCount: 0,
    })),
  );

  const touristUsers = await User.create(
    touristSeedData.map((tourist) => ({
      fullName: tourist.fullName,
      email: tourist.email,
      password: env.passwordTourist,
      role: "tourist",
      verificationStatus: tourist.verificationStatus,
      isActive: tourist.isActive,
      avatar: tourist.avatar,
    })),
  );

  await TouristProfile.create(
    touristSeedData.map((tourist, index) => ({
      user: touristUsers[index]._id,
      fullName: tourist.fullName,
      phoneNumber: `+20 100 555 ${String(1000 + index).slice(-4)}`,
      gender: tourist.gender,
      nationality: tourist.nationality,
      dateOfBirth: new Date(tourist.dateOfBirth),
      language: tourist.preferredLanguage,
    })),
  );

  return { admin, guideUsers, guideProfiles, touristUsers };
}

async function createTrips(guideUsers) {
  const defaultCoordinates = {
    Giza: { lat: 29.9792, lng: 31.1342 },
    Cairo: { lat: 30.0444, lng: 31.2357 },
    Alexandria: { lat: 31.2001, lng: 29.9187 },
    Luxor: { lat: 25.6872, lng: 32.6396 },
    Siwa: { lat: 29.2032, lng: 25.5186 },
    Aswan: { lat: 22.3372, lng: 31.6258 },
  };

  return Trip.create(
    tripSeedData.map((trip) => ({
      title: trip.title,
      description: trip.description,
      longDescription: trip.longDescription,
      location: trip.location,
      coordinates: trip.coordinates || defaultCoordinates[trip.location] || { lat: 30.0444, lng: 31.2357 },
      price: trip.price,
      duration: trip.duration,
      image: trip.image,
      guide: guideUsers[trip.guideIndex]._id,
      category: trip.category,
      status: trip.status,
      groupSize: trip.groupSize,
      schedule: {
        dates: trip.dateOffsets.map((offset) => dateOnly(offset)),
        slots: trip.slots,
      },
      gallery: [],
      rating: 0,
      reviewsCount: 0,
      highlights: trip.highlights,
      reviews: [],
    })),
  );
}

async function createBookings(trips, guideUsers, touristUsers) {
  const bookingDocs = bookingSeedData.map(
    (
      [
        touristIndex,
        tripIndex,
        dayOffset,
        hour,
        minute,
        numberOfGuests,
        status,
        paymentStatus,
        specialRequests,
        cancellationReason = "",
        cancelledBy = "",
      ],
      index,
    ) => {
      const trip = trips[tripIndex];
      const totalPrice = trip.price * numberOfGuests;
      const earnsRevenue = paymentStatus === "paid" && !["cancelled", "refunded"].includes(status);
      const platformFee = earnsRevenue ? roundMoney(totalPrice * PLATFORM_FEE_RATE) : 0;
      const guideEarnings = earnsRevenue ? roundMoney(totalPrice - platformFee) : 0;
      const date = dateAt(dayOffset, hour, minute);
      const isPastFinal = ["completed", "no_show", "refunded"].includes(status);
      const isCancelled = ["cancelled", "refunded"].includes(status);


      return {
        trip: trip._id,
        tourist: touristUsers[touristIndex]._id,
        guide: guideUsers[tripSeedData[tripIndex].guideIndex]._id,
        date,
        timeSlot: date.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        numberOfGuests,
        pricePerPerson: trip.price,
        totalPrice,
        platformFee,
        guideEarnings,
        currency: "EGP",
        status,
        paymentStatus,
        paymentMethod: paymentStatus === "unpaid" ? "none" : index % 3 === 0 ? "wallet" : "card",
        paymentReference: paymentStatus === "unpaid" ? "" : `NEFRU-SEED-${String(index + 1).padStart(4, "0")}`,
        specialRequests,
        bookingSource: index % 4 === 0 ? "web" : "mobile",
        cancellationReason,
        cancelledBy,
        cancelledAt: isCancelled ? new Date(date.getTime() - 2 * DAY_MS) : null,
        completedAt: isPastFinal ? new Date(date.getTime() + 6 * 60 * 60 * 1000) : null,
        createdAt: new Date(date.getTime() - randomInt(2, 30) * DAY_MS),
      };
    },
  );

  return Booking.create(bookingDocs);
}

async function createReviews(bookings, trips, guideUsers, touristUsers, dayOffset,hour, minute) {
  const reviewDocs = reviewSeedData.map((review, index) => {
    const booking = bookings[review.bookingIndex];
    const tripIndex = bookingSeedData[review.bookingIndex][1];
    const touristIndex = bookingSeedData[review.bookingIndex][0];
    
    const date = dateAt(dayOffset, hour, minute);
    console.log(Date(bookings[review.bookingIndex]))
    // console.log(date.getTime())
    return {
      booking: booking._id,
      trip: booking.trip,
      tourist: booking.tourist,
      guide: booking.guide,
      rating: review.rating,
      title: review.title,
      comment: review.comment,
      language: touristSeedData[touristIndex].preferredLanguage === "en" ? "en" : "en",
      isVerifiedBooking: true,
      isVisible: true,
      guideResponse:
        index % 3 === 0
          ? "Thank you for the thoughtful feedback. I am glad you enjoyed the experience."
          : "",
      // createdAt: new Date(bookings[review.bookingIndex],date.getTime() + DAY_MS),
    };
  });

  const reviews = await Review.create(reviewDocs);

  for (let tripIndex = 0; tripIndex < trips.length; tripIndex += 1) {
    const tripReviews = reviews.filter(
      (review) => review.trip.toString() === trips[tripIndex]._id.toString(),
    );

    const embeddedReviews = tripReviews.map((review) => {
      const touristIndex = touristUsers.findIndex(
        (tourist) => tourist._id.toString() === review.tourist.toString(),
      );
      return {
        name: touristSeedData[touristIndex]?.fullName || "Verified Tourist",
        date: review.createdAt.toISOString().slice(0, 10),
        text: review.comment,
        avatar: touristUsers[touristIndex]?.avatar || "",
        rating: review.rating,
      };
    });

    await Trip.findByIdAndUpdate(trips[tripIndex]._id, {
      rating: average(tripReviews.map((review) => review.rating)),
      reviewsCount: tripReviews.length,
      reviews: embeddedReviews,
    });
  }

  for (let guideIndex = 0; guideIndex < guideUsers.length; guideIndex += 1) {
    const guideReviews = reviews.filter(
      (review) => review.guide.toString() === guideUsers[guideIndex]._id.toString(),
    );

    await GuideProfile.findOneAndUpdate(
      { user: guideUsers[guideIndex]._id },
      {
        rating: average(guideReviews.map((review) => review.rating)),
        reviewsCount: guideReviews.length,
      },
    );
  }

  return reviews;
}

async function createNotifications({ admin, guideUsers, touristUsers, trips, bookings, reviews }) {
  const notifications = [];

  for (let index = 0; index < bookings.length; index += 1) {
    const booking = bookings[index];
    const trip = trips.find((item) => item._id.toString() === booking.trip.toString());
    const tourist = touristUsers.find((item) => item._id.toString() === booking.tourist.toString());

    if (["confirmed", "completed"].includes(booking.status)) {
      notifications.push(
        {
          user: booking.tourist,
          type: "booking",
          title: "Booking confirmed",
          message: `Your booking for ${trip.title} is confirmed for.`,
          isRead: index % 3 === 0,
          link: "/user/profile/bookings",
          entityType: "booking",
          entityId: booking._id,
          metadata: { tripTitle: trip.title, status: booking.status },
          createdAt: booking.createdAt,
        },
        {
          user: booking.guide,
          type: "booking",
          title: "New confirmed booking",
          message: `${tourist.fullName} booked ${booking.numberOfGuests} guest(s) for ${trip.title}.`,
          isRead: index % 4 === 0,
          link: `/guide/bookings/${booking._id}`,
          entityType: "booking",
          entityId: booking._id,
          metadata: { numberOfGuests: booking.numberOfGuests },
          createdAt: booking.createdAt,
        },
      );
    }

    if (booking.paymentStatus === "paid") {
      notifications.push({
        user: booking.tourist,
        type: "payment",
        title: "Payment completed",
        message: `Your payment of ${booking.totalPrice} EGP for ${trip.title} was completed.`,
        isRead: index % 2 === 0,
        link: "/user/profile/payments",
        entityType: "payment",
        entityId: booking._id,
        metadata: { amount: booking.totalPrice, currency: booking.currency },
        createdAt: new Date(booking.createdAt.getTime() + 5 * 60 * 1000),
      });
    }

    if (booking.status === "pending_payment") {
      notifications.push({
        user: booking.tourist,
        type: "payment",
        title: "Payment pending",
        message: `Complete payment to confirm your ${trip.title} booking.`,
        isRead: false,
        link: `/booking/${booking._id}/payment`,
        entityType: "booking",
        entityId: booking._id,
        createdAt: booking.createdAt,
      });
    }

    if (["cancelled", "refunded"].includes(booking.status)) {
      notifications.push({
        user: booking.tourist,
        type: "booking",
        title: booking.status === "refunded" ? "Booking refunded" : "Booking cancelled",
        message: `${trip.title}: ${booking.cancellationReason || "The booking was cancelled."}`,
        isRead: false,
        link: "/user/profile/bookings",
        entityType: "booking",
        entityId: booking._id,
        createdAt: booking.cancelledAt || booking.updatedAt,
      });
    }

    if (booking.specialRequests.length > 0) {
      notifications.push({
        user: booking.guide,
        type: "reminder",
        title: "Guest special request",
        message: `${tourist.fullName} added: ${booking.specialRequests.join(", ")}.`,
        isRead: false,
        link: `/guide/tours/${trip._id}/guests?filter=special-requests`,
        entityType: "booking",
        entityId: booking._id,
        createdAt: booking.createdAt,
      });
    }
  }

  for (const review of reviews) {
    const trip = trips.find((item) => item._id.toString() === review.trip.toString());
    notifications.push({
      user: review.guide,
      type: "review",
      title: "New review received",
      message: `${review.rating}-star review received for ${trip.title}.`,
      isRead: false,
      link: "/guide/reviews",
      entityType: "review",
      entityId: review._id,
      metadata: { rating: review.rating },
      createdAt: review.createdAt,
    });
  }

  const tomorrowTrip = trips[0];
  notifications.push(
    {
      user: guideUsers[0]._id,
      type: "reminder",
      title: "Trip tomorrow",
      message: `${tomorrowTrip.title} starts tomorrow at 09:30 AM.`,
      isRead: false,
      link: `/guide/tours/${tomorrowTrip._id}`,
      entityType: "trip",
      entityId: tomorrowTrip._id,
      createdAt: new Date(),
    },
    {
      user: guideUsers[3]._id,
      type: "trip",
      title: "Trip under review",
      message: "Siwa Desert Safari & Sunset is waiting for admin review.",
      isRead: false,
      link: `/guide/tours/${trips[6]._id}`,
      entityType: "trip",
      entityId: trips[6]._id,
      createdAt: new Date(),
    },
    {
      user: admin._id,
      type: "trip",
      title: "Trip review required",
      message: "Two guide tours are currently waiting for review.",
      isRead: false,
      link: "/admin/tours?status=reviewing",
      entityType: "trip",
      entityId: trips[6]._id,
      createdAt: new Date(),
    },
  );

  return Notification.create(notifications);
}

async function createInteractions(touristUsers, trips, bookings, reviews) {
  const interactions = [];
  const devices = ["mobile", "mobile", "desktop", "tablet"];
  const sources = ["home", "search", "tour_details", "saved", "notification"];
  const searchTerms = [
    "pyramids trip",
    "Cairo history",
    "food trip",
    "Luxor temples",
    "Nile sunset",
    "Alexandria day trip",
    "small group trip",
  ];

  for (let touristIndex = 0; touristIndex < touristUsers.length; touristIndex += 1) {
    const tourist = touristUsers[touristIndex];
    const sessionCount = randomInt(3, 6);

    for (let session = 0; session < sessionCount; session += 1) {
      const sessionId = `seed-${touristIndex + 1}-${session + 1}`;
      const sessionDate = dateAt(-randomInt(1, 55), randomInt(8, 22), randomInt(0, 59));
      const viewedTrips = new Set();
      const viewCount = randomInt(2, 5);

      interactions.push({
        tourist: tourist._id,
        trip: null,
        eventType: "search",
        value: 0.5,
        sessionId,
        source: "search",
        device: pick(devices),
        metadata: {
          query: pick(searchTerms),
          category: pick(["History", "Culture", "Food", "Adventure"]),
          location: pick(["Cairo", "Giza", "Luxor", "Alexandria", "Aswan"]),
          position: 0,
          dwellTimeSeconds: randomInt(5, 30),
        },
        eventAt: sessionDate,
      });

      for (let position = 1; position <= viewCount; position += 1) {
        let tripIndex = randomInt(0, 7);
        while (viewedTrips.has(tripIndex)) tripIndex = randomInt(0, 7);
        viewedTrips.add(tripIndex);
        const eventAt = new Date(sessionDate.getTime() + position * randomInt(1, 5) * 60 * 1000);

        interactions.push(
          {
            tourist: tourist._id,
            trip: trips[tripIndex]._id,
            eventType: "impression",
            value: 0.1,
            sessionId,
            source: pick(sources),
            device: pick(devices),
            metadata: {
              category: trips[tripIndex].category,
              location: trips[tripIndex].location,
              position,
              dwellTimeSeconds: 0,
            },
            eventAt,
          },
          {
            tourist: tourist._id,
            trip: trips[tripIndex]._id,
            eventType: "view",
            value: 1,
            sessionId,
            source: "tour_details",
            device: pick(devices),
            metadata: {
              category: trips[tripIndex].category,
              location: trips[tripIndex].location,
              position,
              dwellTimeSeconds: randomInt(20, 240),
            },
            eventAt: new Date(eventAt.getTime() + 30 * 1000),
          },
        );

        if (random() < 0.28) {
          interactions.push({
            tourist: tourist._id,
            trip: trips[tripIndex]._id,
            eventType: "save",
            value: 3,
            sessionId,
            source: "tour_details",
            device: pick(devices),
            metadata: {
              category: trips[tripIndex].category,
              location: trips[tripIndex].location,
              position,
              dwellTimeSeconds: 0,
            },
            eventAt: new Date(eventAt.getTime() + 2 * 60 * 1000),
          });
        }

        if (random() < 0.15) {
          interactions.push({
            tourist: tourist._id,
            trip: trips[tripIndex]._id,
            eventType: "map_opened",
            value: 1.2,
            sessionId,
            source: "tour_details",
            device: pick(devices),
            metadata: {
              category: trips[tripIndex].category,
              location: trips[tripIndex].location,
              position,
              dwellTimeSeconds: randomInt(10, 60),
            },
            eventAt: new Date(eventAt.getTime() + 3 * 60 * 1000),
          });
        }
      }
    }
  }

  bookings.forEach((booking, index) => {
    const startedAt = new Date(booking.createdAt.getTime() - 10 * 60 * 1000);
    const sessionId = `booking-${index + 1}`;
    interactions.push({
      tourist: booking.tourist,
      trip: booking.trip,
      eventType: "booking_started",
      value: 4,
      sessionId,
      source: "tour_details",
      device: index % 3 === 0 ? "desktop" : "mobile",
      metadata: { position: 0, dwellTimeSeconds: 120 },
      eventAt: startedAt,
    });

    if (["confirmed", "completed", "refunded", "no_show"].includes(booking.status)) {
      interactions.push({
        tourist: booking.tourist,
        trip: booking.trip,
        eventType: "booking_completed",
        value: 6,
        sessionId,
        source: "tour_details",
        device: index % 3 === 0 ? "desktop" : "mobile",
        metadata: { position: 0, dwellTimeSeconds: 0 },
        eventAt: booking.createdAt,
      });
    }

    if (booking.status === "cancelled") {
      interactions.push({
        tourist: booking.tourist,
        trip: booking.trip,
        eventType: "booking_cancelled",
        value: -3,
        sessionId,
        source: "notification",
        device: "mobile",
        metadata: { position: 0, dwellTimeSeconds: 0 },
        eventAt: booking.cancelledAt || booking.updatedAt,
      });
    }
  });

  reviews.forEach((review, index) => {
    interactions.push({
      tourist: review.tourist,
      trip: review.trip,
      eventType: "review_submitted",
      value: review.rating,
      sessionId: `review-${index + 1}`,
      source: "notification",
      device: index % 2 === 0 ? "mobile" : "desktop",
      metadata: { position: 0, dwellTimeSeconds: randomInt(30, 180) },
      eventAt: review.createdAt,
    });
  });

  return Interaction.create(interactions);
}

async function printSummary({ guideUsers, touristUsers, trips, bookings, notifications, reviews, interactions }) {
  const bookingStatusSummary = bookings.reduce((result, booking) => {
    result[booking.status] = (result[booking.status] || 0) + 1;
    return result;
  }, {});

  const tripStatusSummary = trips.reduce((result, trip) => {
    result[trip.status] = (result[trip.status] || 0) + 1;
    return result;
  }, {});

  const touristsWithBookings = new Set(bookings.map((booking) => booking.tourist.toString())).size;

  console.log("\n-----------------------------------");
  console.log("Nefru scenario seed completed");
  console.log("-----------------------------------");
  console.log(`Guides: ${guideUsers.length}`);
  console.log(`Tourists: ${touristUsers.length}`);
  console.log(`Tourists with bookings: ${touristsWithBookings}`);
  console.log(`Cold-start tourists: ${touristUsers.length - touristsWithBookings}`);
  console.log(`Trips: ${trips.length}`, tripStatusSummary);
  console.log(`Bookings: ${bookings.length}`, bookingStatusSummary);
  console.log(`Reviews: ${reviews.length}`);
  console.log(`Notifications: ${notifications.length}`);
  console.log(`ML interactions: ${interactions.length}`);
  console.log("-----------------------------------");
  console.log(`Admin login: ${env.emailAdmin} / ${env.passwordAdmin}`);
  console.log(`GuideProfile login: ${env.emailGuide} / ${env.passwordGuide}`);
  console.log(`Tourist login: ${env.emailTourist} / ${env.passwordTourist}`);
  console.log(`Other seed users use the same role password and end with ${SEED_EMAIL_SUFFIX}`);
  console.log("-----------------------------------\n");
}

async function seedDatabase() {
  try {
    await mongoose.connect(env.mongoUri);
    console.log("MongoDB connected for scenario seeding");

    await removeOldSeedData();
    console.log("Old Nefru seed data removed");

    const { admin, guideUsers, guideProfiles, touristUsers } = await createUsersAndProfiles();
    const trips = await createTrips(guideUsers);
    const bookings = await createBookings(trips, guideUsers, touristUsers);
    const reviews = await createReviews(bookings, trips, guideUsers, touristUsers);
    const notifications = await createNotifications({
      admin,
      guideUsers,
      touristUsers,
      trips,
      bookings,
      reviews,
    });
    const interactions = await createInteractions(touristUsers, trips, bookings, reviews);

    await printSummary({
      guideUsers,
      guideProfiles,
      touristUsers,
      trips,
      bookings,
      notifications,
      reviews,
      interactions,
    });
  } catch (error) {
    console.error("Seed failed:", error.message, error);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
    console.log("Database connection closed");
  }
}

seedDatabase();
