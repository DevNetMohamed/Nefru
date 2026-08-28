import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { apiRequest, resolveUploadsUrl } from "../../../../services/api";

import {
  Search,
  Bell,
  MapPin,
  ChevronRight,
  Clock,
  Star,
  Home,
  Briefcase,
  Heart,
  User,
  Anchor,
  Sparkles,
  Calendar,
  Award,
  Ticket,
  Car,
  Lightbulb,
  X,
  ArrowRight,
  Info,
} from "lucide-react";
import logo from "@/assets/images/logo.png";

import SearchModal from "@/components/Search/SearchModal";
import { useSavedTrips } from "@/context/useSavedTrips";

// Local high quality assets matching Egypt destinations
import luxorImg from "@/assets/images/hero/luxor.jpeg";
import cairoImg from "@/assets/images/hero/cairo.jpg";
import alexandriaImg from "@/assets/images/hero/alexandria.jpg";
import aswanImg from "@/assets/images/hero/aswan.jpeg";
import pyramidsImg from "@/assets/images/explore/pyramids.jpg";
import sphinxImg from "@/assets/images/explore/Sphinx.jpg";
import museumImg from "@/assets/images/explore/the_grand_museum.webp";
import oldCairoImg from "@/assets/images/explore/old-cairo.jpg";
import khanImg from "@/assets/images/explore/khan-el-khalili.jpg";
import guide1 from "@/assets/images/guiders/guide1.webp";
import guide2 from "@/assets/images/guiders/guide3.webp";
import guide3 from "@/assets/images/guiders/guide4.webp";

const defaultFeaturedExplores = [
  {
    id: 1,
    title: "Historical Sites: Pyramids & Sphinx",
    shortTitle: "Giza Pyramids & Sphinx",
    badge: "Must Visit #1",
    image: pyramidsImg,
    location: "Giza Plateau",
    description:
      "The last surviving Wonder of the ancient world, built over 4,500 years ago during the 4th Dynasty.",
    tickets: "EGP 540 (Foreigner) / EGP 270 (Student) | EGP 900 (Inside Khufu)",
    hours: "07:00 AM - 05:00 PM (Daily)",
    howToGetThere: "Metro Line 2 to Giza, then 15 min Uber/taxi to Main Gate.",
    tip: "Arrive at 07:30 AM before heat and tour buses arrive.",
    highlights: [
      "Great Pyramid of Khufu interior",
      "Sphinx Enclosure & Valley Temple",
      "Panoramic Viewpoint",
    ],
    searchCity: "Giza",
  },
  {
    id: 2,
    title: "Grand Egyptian Museum (GEM)",
    shortTitle: "Grand Egyptian Museum",
    badge: "World's Largest",
    image: museumImg,
    location: "Pyramids Road, Giza",
    description:
      "Spanning 500,000 square meters housing the complete 5,000+ piece Tutankhamun collection.",
    tickets: "EGP 1,200 (Foreigner Adult) / EGP 600 (Student)",
    hours: "09:00 AM - 06:00 PM (Sat - Thu) | 09:00 AM - 09:00 PM (Fri)",
    howToGetThere: "Direct 25 min Uber/taxi from Downtown Cairo to GEM Plaza.",
    tip: "Book ticket time slots online 3 days ahead in high season.",
    highlights: [
      "Complete Tutankhamun treasure",
      "Ramses II Colossus Atrium",
      "Grand Staircase",
    ],
    searchCity: "Giza",
  },
  {
    id: 3,
    title: "Historic Old Cairo & Citadel",
    shortTitle: "Old Cairo & Citadel",
    badge: "UNESCO Heritage",
    image: oldCairoImg,
    location: "Islamic & Coptic Cairo",
    description:
      "Centuries of medieval Islamic and Coptic heritage, Ottoman domes, and the hilltop fortress built by Saladin.",
    tickets: "Citadel: EGP 450 (Foreigner) / EGP 230 (Student) | Churches: Free",
    hours: "08:00 AM - 04:30 PM (Daily)",
    howToGetThere: "Metro Line 1 to 'Mar Girgis' station for Coptic Cairo.",
    tip: "Dress modestly covering shoulders and knees when visiting historical churches and mosques.",
    highlights: [
      "The Hanging Church",
      "Muhammad Ali Alabaster Mosque",
      "Khan El-Khalili Souk",
    ],
    searchCity: "Cairo",
  },
  {
    id: 4,
    title: "Luxor & Karnak Temples",
    shortTitle: "Luxor Ancient Temples",
    badge: "Ancient Wonders",
    image: luxorImg,
    location: "East Bank, Luxor",
    description:
      "The world's greatest open-air museum featuring 134 colossal columns in the Great Hypostyle Hall.",
    tickets: "Karnak: EGP 450 (Foreigner) / EGP 230 (Student) | Luxor Temple: EGP 400",
    hours: "06:00 AM - 05:30 PM (Daily)",
    howToGetThere: "Walkable or 5-min carriage/taxi from East Bank hotels.",
    tip: "Visit Karnak at sunrise (06:30 AM) and Luxor Temple at night for spectacular illumination.",
    highlights: [
      "Hypostyle Hall 134 columns",
      "Avenue of Sphinxes",
      "Valley of the Kings",
    ],
    searchCity: "Luxor",
  },
];

const defaultBestChoiceTours = [
  {
    id: 1,
    title: "Pyramids Sunrise & Sphinx Experience",
    location: "Giza",
    duration: "4 hours",
    rating: "4.9",
    reviewsCount: "582",
    price: 45,
    image: pyramidsImg,
  },
  {
    id: 2,
    title: "Historic Cairo Walking Trip",
    location: "Cairo",
    duration: "3 hours",
    rating: "4.8",
    reviewsCount: "340",
    price: 35,
    image: cairoImg,
  },
  {
    id: 3,
    title: "Luxor East & West Banks",
    location: "Luxor",
    duration: "Full Day",
    rating: "5.0",
    reviewsCount: "420",
    price: 65,
    image: luxorImg,
  },
  {
    id: 4,
    title: "Alexandria Coastal & Heritage Trip",
    location: "Alexandria",
    duration: "Full Day",
    rating: "4.8",
    reviewsCount: "180",
    price: 55,
    image: alexandriaImg,
  },
];

const defaultAvailableToday = [
  {
    id: 101,
    title: "Pyramids Sunrise & Sphinx Experience",
    timeSlot: "09:30 AM Today",
    location: "Giza Plateau",
    price: 45,
    image: pyramidsImg,
  },
  {
    id: 102,
    title: "Nile Sunset Felucca",
    timeSlot: "05:00 PM Today",
    location: "Cairo Nile",
    price: 25,
    image: cairoImg,
  },
  {
    id: 103,
    title: "Cairo Street Food Evening",
    timeSlot: "06:00 PM Today",
    location: "Old Cairo",
    price: 30,
    image: oldCairoImg,
  },
];

const localGuides = [
  {
    id: 1,
    name: "Mohamed Hassan",
    rating: "4.9",
    languages: "Arabic • English",
    experience: "8 Yrs Exp.",
    image: guide1,
  },
  {
    id: 2,
    name: "Mariam El-Sayed",
    rating: "4.8",
    languages: "Arabic • English • French",
    experience: "6 Yrs Exp.",
    image: guide2,
  },
  {
    id: 3,
    name: "Omar Khalil",
    rating: "5.0",
    languages: "Arabic • English • German",
    experience: "10 Yrs Exp.",
    image: guide3,
  },
];

const topDestinations = [
  { name: "Luxor", toursCount: "42 Tours", image: luxorImg },
  { name: "Giza", toursCount: "38 Tours", image: pyramidsImg },
  { name: "Cairo", toursCount: "54 Tours", image: cairoImg },
  { name: "Alexandria", toursCount: "26 Tours", image: alexandriaImg },
  { name: "Aswan", toursCount: "19 Tours", image: aswanImg },
];



// Bug #4 fixed: handle Vite bundled asset paths that start with "/"
const getImgSrc = (img, fallback) => {
  if (!img) return fallback;
  return resolveUploadsUrl(img) || fallback;
};

// Bug #11 fixed: time-aware greeting helper
function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning ☀️";
  if (hour < 17) return "Good Afternoon 🌤️";
  return "Good Evening 🌙";
}


const MobileHome = () => {
  const navigate = useNavigate();
  const { profile } = useSelector((state) => state.auth || {});
  const notifications = useSelector((state) => state.notifications?.notifications || []);
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const [openSearch, setOpenSearch] = useState(false);
  const { savedIds, toggleSaved } = useSavedTrips();
  const [activeGuideModal, setActiveGuideModal] = useState(null);
  const [bestChoiceTours, setBestChoiceTours] = useState(defaultBestChoiceTours);
  const [availableTodayTours, setAvailableTodayTours] = useState(defaultAvailableToday);
  const [guidesList, setGuidesList] = useState(localGuides);

  const fullName = profile?.fullName
    ? profile.fullName.split(" ")[0]
    : "Traveler";
  const greeting = getGreeting();

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const response = await apiRequest("/home");
        if (response?.data) {
          const { featuredTrips, availableToday, trustedGuides } = response.data;

          if (featuredTrips && featuredTrips.length > 0) {
            const apiTrips = featuredTrips.map((t, idx) => ({
              id: t._id || idx,
              title: t.title,
              location: t.location || "Egypt",
              duration: t.duration ? `${t.duration}` : "4 hrs",
              rating: t.rating ? String(t.rating) : "4.8",
              reviewsCount: t.reviewsCount ? String(t.reviewsCount) : "500+",
              price: t.price || 45,
              image: getImgSrc(t.image, [luxorImg, pyramidsImg, cairoImg, sphinxImg][idx % 4]),
            }));
            setBestChoiceTours(apiTrips);
          }

          if (availableToday && availableToday.length > 0) {
            const apiAvailable = availableToday.map((t, idx) => ({
              id: t._id || idx,
              title: t.title,
              timeSlot: t.duration || "Today Available",
              location: t.location || "Cairo",
              price: typeof t.price === "number" ? t.price : 40,
              image: getImgSrc(t.image, [pyramidsImg, museumImg, cairoImg][idx % 3]),
            }));
            setAvailableTodayTours(apiAvailable);
          }

          if (trustedGuides && trustedGuides.length > 0) {
            const apiGuides = trustedGuides.map((g, idx) => ({
              id: g._id || idx,
              name: g.fullName || g.name || "Local Guide",
              rating: g.rating ? String(g.rating) : "4.9",
              languages: Array.isArray(g.languages) && g.languages.length > 0
                ? g.languages.join(" • ")
                : (typeof g.languages === "string" ? g.languages : "Arabic • English"),
              experience: g.yearsExperience
                ? `${g.yearsExperience} Yrs Exp.`
                : (g.experience || "5 Yrs Exp."),
              image: getImgSrc(g.avatar || g.heroImage, [guide1, guide2, guide3][idx % 3]),
            }));
            setGuidesList(apiGuides);
          }
        }
      } catch (err) {
        console.log("Using default high quality tours data:", err);
      }
    };

    fetchHomeData();
  }, []);

  const toggleSave = async (id, e) => {
    e.stopPropagation();
    if (!/^[a-f0-9]{24}$/i.test(String(id || ""))) return;
    await toggleSaved(id);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-24 font-sans">
      {/* 2. Welcome & Search Banner */}
      <div className="px-4 pt-4 pb-2 bg-white">
        <div className="mb-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#003D5B] uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Welcome back</span>
          </div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight leading-snug">
            {greeting}, {fullName}
          </h1>
          <p className="text-gray-500 text-xs mt-0.5">
            Where would you like to explore in Egypt today?
          </p>
        </div>

        {/* Search bar opens SearchModal */}
        <div
          onClick={() => setOpenSearch(true)}
          className="w-full bg-gray-100/80 border border-gray-200 rounded-2xl py-3 px-4 flex items-center gap-3 cursor-pointer shadow-xs hover:border-[#003D5B]/30 transition-all"
        >
          <Search className="w-5 h-5 text-gray-400 shrink-0" />
          <span className="text-gray-500 text-sm font-medium">
            Search tours, places, or local guides...
          </span>
        </div>
      </div>

      {/* 4. Nearby Exploration Banner */}
      <div className="px-4 py-3">
        <div
          onClick={() => navigate("/user/nearby")}
          className="bg-gradient-to-r from-[#EBF7FA] to-[#d6f0f7] rounded-2xl p-4 flex items-center justify-between cursor-pointer shadow-xs hover:shadow-md transition-all border border-[#bce4ee]"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-full bg-[#003D5B] text-white flex items-center justify-center shrink-0 shadow-xs">
              <MapPin className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <span className="font-extrabold text-gray-900 text-sm leading-tight block">
                Looking for something nearby?
              </span>
              <span className="text-xs text-[#003D5B] font-medium">
                Find experiences close to your location
              </span>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-[#003D5B]" />
        </div>
      </div>

      {/* 5. Discover Egypt / Destination Guides Carousel */}
      <div className="py-3">
        <div className="px-4 mb-3 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold text-[#003D5B] uppercase tracking-wider block">
              Places & Guides
            </span>
            {/* <h2 className="text-lg font-extrabold text-gray-900 tracking-tight">
              Discover Egypt
            </h2> */}
          </div>
          <button
            onClick={() => navigate("/user/discover-egypt")}
            className="text-xs font-bold text-[#003D5B] flex items-center gap-0.5 hover:underline"
          >
            View All Guides <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="flex gap-4 overflow-x-auto px-4 pb-2 no-scrollbar">
          {defaultFeaturedExplores.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveGuideModal(item)}
              className="relative w-64 h-40 rounded-2xl overflow-hidden shrink-0 shadow-xs group cursor-pointer border border-gray-100"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
              <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md text-gray-900 px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-xs">
                {item.badge}
              </div>
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <h3 className="font-extrabold text-sm leading-snug drop-shadow-xs">
                  {item.shortTitle || item.title}
                </h3>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-300 mt-0.5">
                  Explore Guide →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. Best Choice / Top Tours */}
      <div className="py-3">
        <div className="px-4 mb-3 flex items-center justify-between">
          <span className="text-[10px] font-extrabold text-[#003D5B] uppercase tracking-wider block">
              Best Choice Tours
            </span>
          {/* <h2 className="text-lg font-extrabold text-gray-900 tracking-tight">
            Best Choice Tours
          </h2> */}
          <button
            onClick={() => navigate("/user/trips")}
            className="text-xs font-bold text-[#003D5B] flex items-center gap-0.5 hover:underline"
          >
            View All <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="flex gap-4 overflow-x-auto px-4 pb-2 no-scrollbar">
          {bestChoiceTours.map((trip) => {
            const isSaved = savedIds.has(trip.id);
            return (
              <div
                key={trip.id}
                onClick={() => navigate(`/user/trips/${trip.id}`)}
                className="w-64 bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden shrink-0 flex flex-col cursor-pointer hover:shadow-md transition-all"
              >
                <div className="relative w-full h-36">
                  <img
                    src={trip.image}
                    alt={trip.title}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={(e) => toggleSave(trip.id, e)}
                    className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-xs text-gray-700 hover:scale-110 transition-transform"
                    aria-label="Save trip"
                  >
                    <Heart
                      className="w-4 h-4"
                      fill={isSaved ? "#ef4444" : "none"}
                      color={isSaved ? "#ef4444" : "#4b5563"}
                    />
                  </button>
                  <div className="absolute bottom-2.5 left-2.5 bg-black/60 backdrop-blur-sm text-white px-2.5 py-0.5 rounded-md text-[10px] font-semibold flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-red-400" />
                    <span>{trip.location}</span>
                  </div>
                </div>

                <div className="p-3.5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-gray-900 text-xs leading-snug line-clamp-2">
                      {trip.title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-gray-500 text-[11px] mt-2">
                      <Clock className="w-3.5 h-3.5 shrink-0 text-gray-400" />
                      <span>{trip.duration}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-gray-100">
                    <div className="flex items-center gap-1 text-xs text-gray-800 font-bold">
                      <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                      <span>{trip.rating}</span>
                      <span className="text-gray-400 font-normal text-[11px]">
                        ({trip.reviewsCount})
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-gray-400 font-normal block leading-none">From</span>
                      <span className="text-base font-extrabold text-[#003D5B]">
                        ${trip.price}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 7. Available Today Section */}
      <div className="py-3">
        <div className="px-4 mb-3 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600">
              <Calendar className="w-3.5 h-3.5" />
              <span>Same-Day Booking</span>
            </div>
            {/* <h2 className="text-lg font-extrabold text-gray-900 tracking-tight">
              Tours Available Today
            </h2> */}
          </div>
          <button
            onClick={() => navigate("/user/available-today")}
            className="text-xs font-bold text-[#003D5B] hover:underline"
          >
            Book Today
          </button>
        </div>

        <div className="flex gap-4 overflow-x-auto px-4 pb-2 no-scrollbar">
          {availableTodayTours.map((trip) => (
            <div
              key={trip.id}
              onClick={() => navigate(`/user/trips/${trip.id}`)}
              className="w-64 bg-amber-50/50 rounded-2xl border border-amber-200/60 p-3 shrink-0 flex gap-3 items-center cursor-pointer hover:bg-amber-100/50 transition-colors"
            >
              <img
                src={trip.image}
                alt={trip.title}
                className="w-20 h-20 rounded-xl object-cover shrink-0 shadow-xs"
              />
              <div className="flex-1 min-w-0">
                <span className="inline-block bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md mb-1">
                  {trip.timeSlot}
                </span>
                <h3 className="font-bold text-gray-900 text-xs leading-tight truncate">
                  {trip.title}
                </h3>
                <p className="text-gray-500 text-[11px] truncate mt-0.5">
                  📍 {trip.location}
                </p>
                <div className="flex items-center justify-between mt-1.5">
                  <span className="font-extrabold text-xs text-[#003D5B]">
                    ${trip.price}
                  </span>
                  <span className="text-[10px] font-bold text-[#003D5B] underline">
                    Reserve Now →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 8. Top Local Guides Section */}
      <div className="py-3">
        <div className="px-4 mb-3 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1 text-xs font-bold text-emerald-700">
              <Award className="w-3.5 h-3.5" />
              <span>Licensed Experts</span>
            </div>
            {/* <h2 className="text-lg font-extrabold text-gray-900 tracking-tight">
              Trusted Local Guides
            </h2> */}
          </div>
          <button
            onClick={() => navigate("/user/guideprofile")}
            className="text-xs font-bold text-[#003D5B] hover:underline"
          >
            Meet Guides
          </button>
        </div>

        <div className="flex gap-4 overflow-x-auto px-4 pb-2 no-scrollbar">
          {guidesList.map((guide) => (
            <div
              key={guide.id}
              onClick={() => navigate("/user/guideprofile")}
              className="w-48 bg-white rounded-2xl border border-gray-100 p-3.5 flex flex-col items-center text-center shrink-0 shadow-xs cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="relative mb-2.5">
                <img
                  src={guide.image}
                  alt={guide.name}
                  className="w-16 h-16 rounded-full object-cover ring-2 ring-[#003D5B]/20"
                />
                <span className="absolute bottom-0 right-0 bg-emerald-500 border-2 border-white w-4 h-4 rounded-full" />
              </div>
              <h3 className="font-extrabold text-gray-900 text-sm">
                {guide.name}
              </h3>
              <div className="flex items-center gap-1 text-xs text-amber-500 font-bold mt-0.5">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{guide.rating}</span>
              </div>
              <p className="text-gray-500 text-[11px] mt-1 font-medium">
                {guide.languages}
              </p>
              <span className="text-[10px] text-gray-400 mt-0.5">
                {guide.experience}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("/user/guideprofile");
                }}
                className="mt-3 w-full py-1.5 rounded-xl bg-gray-100 hover:bg-[#003D5B] hover:text-white text-[#003D5B] font-bold text-xs transition-colors"
              >
                View Profile
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 9. Top Destinations */}
      <div className="py-3">
        <div className="px-4 mb-3">
          <h2 className="text-lg font-extrabold text-gray-900 tracking-tight">
            Top Egyptian Destinations
          </h2>
        </div>
        <div className="flex gap-4 overflow-x-auto px-4 pb-2 no-scrollbar">
          {topDestinations.map((dest) => (
            <div
              key={dest.name}
              onClick={() => navigate(`/user/discover?location=${encodeURIComponent(dest.name)}`)}
              className="flex flex-col items-center shrink-0 cursor-pointer group"
            >
              <div className="relative w-24 h-24 rounded-2xl overflow-hidden shadow-xs mb-1.5 border border-gray-100">
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <span className="absolute bottom-1.5 left-1.5 text-[10px] font-bold text-white bg-black/40 backdrop-blur-xs px-1.5 py-0.5 rounded-md">
                  {dest.toursCount}
                </span>
              </div>
              <span className="font-extrabold text-gray-900 text-xs">
                {dest.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 11. Search Modal */}
      <SearchModal open={openSearch} onOpenChange={setOpenSearch} />

      {/* 11.5 Destination Guide Modal */}
      {activeGuideModal && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200"
          onClick={() => setActiveGuideModal(null)}
        >
          <div
            className="bg-white rounded-t-3xl sm:rounded-3xl max-w-lg w-full max-h-[85vh] overflow-y-auto shadow-2xl relative flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-48 sm:h-56 shrink-0">
              <img
                src={activeGuideModal.image}
                alt={activeGuideModal.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
              <button
                onClick={() => setActiveGuideModal(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-gray-800 shadow-md font-bold"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute top-3 left-3 bg-[#003D5B] text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">
                {activeGuideModal.badge}
              </div>
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <h2 className="text-lg font-extrabold leading-tight">
                  {activeGuideModal.title}
                </h2>
                <div className="flex items-center gap-1 text-amber-300 text-xs font-semibold mt-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{activeGuideModal.location}</span>
                </div>
              </div>
            </div>

            <div className="p-4 flex flex-col gap-3.5 pb-6">
              <p className="text-xs text-gray-600 leading-relaxed">
                {activeGuideModal.description}
              </p>

              {/* Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-2.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#003D5B] mb-1">
                    <Ticket className="w-3.5 h-3.5" />
                    <span>2026 Ticket Prices</span>
                  </div>
                  <p className="text-[11px] text-gray-700 leading-snug font-medium">
                    {activeGuideModal.tickets}
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-100 rounded-xl p-2.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#003D5B] mb-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Opening Hours</span>
                  </div>
                  <p className="text-[11px] text-gray-700 leading-snug font-medium">
                    {activeGuideModal.hours}
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-100 rounded-xl p-2.5 sm:col-span-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#003D5B] mb-1">
                    <Car className="w-3.5 h-3.5" />
                    <span>How to Get There</span>
                  </div>
                  <p className="text-[11px] text-gray-700 leading-snug font-medium">
                    {activeGuideModal.howToGetThere}
                  </p>
                </div>

                <div className="bg-amber-50/60 border border-amber-200/70 rounded-xl p-2.5 sm:col-span-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 mb-1">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                    <span>Egyptologist Insider Tip</span>
                  </div>
                  <p className="text-[11px] text-amber-900 leading-snug font-medium">
                    {activeGuideModal.tip}
                  </p>
                </div>
              </div>

              {/* Highlights */}
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-2.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#003D5B] mb-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Must-See Highlights</span>
                </div>
                <ul className="list-disc pl-4 text-[11px] text-gray-700 space-y-0.5 font-medium">
                  {activeGuideModal.highlights.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col gap-2 pt-2">
                <button
                  onClick={() => {
                    const city = activeGuideModal.searchCity;
                    setActiveGuideModal(null);
                    navigate(`/user/trips?search=${encodeURIComponent(city)}`);
                  }}
                  className="w-full py-2.5 px-4 bg-[#003D5B] hover:bg-[#002c42] text-white font-bold text-xs rounded-xl shadow-sm flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Find Guided Tours to this Place</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => {
                    setActiveGuideModal(null);
                    navigate("/user/discover-egypt");
                  }}
                  className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-[#003D5B] font-bold text-xs rounded-xl transition-colors text-center"
                >
                  View All Destination Guides
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 12. Bottom Navigation Bar */}
      
    </div>
  );
};

export default MobileHome;
