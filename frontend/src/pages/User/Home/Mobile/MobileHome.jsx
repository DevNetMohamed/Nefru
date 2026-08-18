import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

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
} from "lucide-react";
import logo from "@/assets/images/logo.png";

import SearchModal from "@/components/Search/SearchModal";

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
    title: "Beyond the Sphinx",
    badge: "Must Visit",
    image: sphinxImg,
  },
  {
    id: 2,
    title: "Luxor Ancient Temples",
    badge: "Ancient Wonders",
    image: luxorImg,
  },
  {
    id: 3,
    title: "Grand Egyptian Museum",
    badge: "Cultural Marvel",
    image: museumImg,
  },
  {
    id: 4,
    title: "Old Cairo & Khan Bazaar",
    badge: "Historic Walk",
    image: oldCairoImg,
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
  if (
    typeof img === "string" &&
    (img.startsWith("http://") ||
      img.startsWith("https://") ||
      img.startsWith("data:") ||
      img.startsWith("/"))
  ) {
    return img;
  }
  return `http://localhost:5000/uploads/${img}`;
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
  const { user } = useSelector((state) => state.auth || {});
  const notifications = useSelector((state) => state.notifications?.notifications || []);
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const [openSearch, setOpenSearch] = useState(false);
  const [savedIds, setSavedIds] = useState(new Set());
  const [bestChoiceTours, setBestChoiceTours] = useState(defaultBestChoiceTours);
  const [availableTodayTours, setAvailableTodayTours] = useState(defaultAvailableToday);
  const [guidesList, setGuidesList] = useState(localGuides);

  const fullName = user?.fullName ? user.fullName.split(" ")[0] : "Traveler";
  const greeting = getGreeting();

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/home");
        if (response.data?.data) {
          const { featuredTrips, availableToday, trustedGuides } = response.data.data;

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
              name: g.fullName || g.user?.fullName || g.name || "Local Guide",
              rating: g.rating ? String(g.rating) : "4.9",
              languages: Array.isArray(g.languages) && g.languages.length > 0
                ? g.languages.join(" • ")
                : (typeof g.languages === "string" ? g.languages : "Arabic • English"),
              experience: g.yearsExperience
                ? `${g.yearsExperience} Yrs Exp.`
                : (g.experience || "5 Yrs Exp."),
              image: getImgSrc(g.image || g.user?.avatar || g.heroImage, [guide1, guide2, guide3][idx % 3]),
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

  const toggleSave = (id, e) => {
    e.stopPropagation();
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-24 font-sans">
      {/* 1. Header Bar */}
      <div className="bg-white sticky top-0 z-40 px-4 py-3 border-b border-gray-100 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/user/home")}>
          <img src={logo} alt="Nefru Logo" className="h-[38px] w-auto" />
          <span 
            className="font-semibold text-[#003D5B]" 
            style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '2.1rem' }}
          >
            Nefru
          </span>
        </div>
        <button
          onClick={() => navigate("/user/notifications")}
          className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 hover:bg-gray-200 transition-colors relative"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5 text-gray-700" />
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-red-500 ring-2 ring-white" />
          )}
        </button>
      </div>

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

      {/* 5. Featured Explores Carousel */}
      <div className="py-3">
        <div className="px-4 mb-3 flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-gray-900 tracking-tight">
            Featured Explores
          </h2>
          <button
            onClick={() => navigate("/user/discover")}
            className="text-xs font-bold text-[#003D5B] flex items-center gap-0.5 hover:underline"
          >
            See All <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="flex gap-4 overflow-x-auto px-4 pb-2 no-scrollbar">
          {defaultFeaturedExplores.map((item) => (
            <div
              key={item.id}
              onClick={() => navigate("/user/discover")}
              className="relative w-64 h-40 rounded-2xl overflow-hidden shrink-0 shadow-xs group cursor-pointer border border-gray-100"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md text-gray-900 px-3 py-1 rounded-full text-[11px] font-bold shadow-xs">
                {item.badge}
              </div>
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <h3 className="font-extrabold text-sm leading-snug drop-shadow-xs">
                  {item.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. Best Choice / Top Tours */}
      <div className="py-3">
        <div className="px-4 mb-3 flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-gray-900 tracking-tight">
            Best Choice Tours
          </h2>
          <button
            onClick={() => navigate("/user/discover")}
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
                onClick={() => navigate("/user/discover")}
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
            <h2 className="text-lg font-extrabold text-gray-900 tracking-tight">
              Tours Available Today
            </h2>
          </div>
          <button
            onClick={() => navigate("/user/discover")}
            className="text-xs font-bold text-[#003D5B] hover:underline"
          >
            Book Today
          </button>
        </div>

        <div className="flex gap-4 overflow-x-auto px-4 pb-2 no-scrollbar">
          {availableTodayTours.map((trip) => (
            <div
              key={trip.id}
              onClick={() => navigate("/user/discover")}
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
            <h2 className="text-lg font-extrabold text-gray-900 tracking-tight">
              Trusted Local Guides
            </h2>
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

      {/* 12. Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 flex justify-around items-center py-2 px-3 shadow-[0_-2px_10px_rgba(0,0,0,0.06)]">
        <button
          onClick={() => navigate("/user/home")}
          className="flex flex-col items-center gap-1 text-xs font-bold text-[#003D5B]"
        >
          <Home className="w-5 h-5 stroke-[2.4]" />
          <span>Home</span>
        </button>

        <button
          onClick={() => navigate("/user/trips")}
          className="flex flex-col items-center gap-1 text-xs font-semibold text-gray-400 hover:text-gray-700"
        >
          <Briefcase className="w-5 h-5" />
          <span>Trips</span>
        </button>

        <button
          onClick={() => navigate("/user/saved")}
          className="flex flex-col items-center gap-1 text-xs font-semibold text-gray-400 hover:text-gray-700"
        >
          <Heart className="w-5 h-5" />
          <span>Saved</span>
        </button>

        <button
          onClick={() => navigate("/user/profile")}
          className="flex flex-col items-center gap-1 text-xs font-semibold text-gray-400 hover:text-gray-700"
        >
          <User className="w-5 h-5" />
          <span>Profile</span>
        </button>
      </nav>
    </div>
  );
};

export default MobileHome;