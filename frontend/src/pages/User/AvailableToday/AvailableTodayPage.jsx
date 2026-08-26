import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  MapPin,
  Clock,
  Star,
  Heart,
  Search,
  ChevronDown,
  ArrowRight,
  ShieldCheck,
  Zap,
  Sparkles,
  Users,
  RotateCcw,
  Calendar,
  Flame,
  Home,
  Briefcase,
  User,
  X,
} from "lucide-react";

import { apiRequest, resolveUploadsUrl } from "../../../services/api";
import useIsMobile from "../../../hooks/useIsMobile";
import MobilePageHeader from "../../../shared/components/MobilePageHeader/MobilePageHeader";
import styles from "./AvailableTodayPage.module.css";
import DesktopNavbar from "../Home/components/DesktopNavbar/DesktopNavbar";
import Footer from "../Home/Desktop/components/Footer/Footer";
import { useSavedTrips } from "../../../context/useSavedTrips";

// Image assets
import pyramidsImg from "../../../assets/images/explore/pyramids.jpg";
import sphinxImg from "../../../assets/images/explore/Sphinx.jpg";
import museumImg from "../../../assets/images/explore/the_grand_museum.webp";
import oldCairoImg from "../../../assets/images/explore/old-cairo.jpg";
import khanImg from "../../../assets/images/explore/khan-el-khalili.jpg";
import nileImg from "../../../assets/images/explore/nile-felucca.jpg";
import safariImg from "../../../assets/images/explore/desert-safari.jpg";
import luxorImg from "../../../assets/images/tours/Luxor.jpg";
import userAvatar from "../../../assets/images/user/user1.png";

const getImgSrc = (img, fallback) => {
  if (!img) return fallback;
  return resolveUploadsUrl(img) || fallback;
};

const DEFAULT_AVAILABLE_TODAY = [
  {
    _id: "today-1",
    title: "Pyramids Sunrise & Sphinx Guided Walk",
    category: "History",
    location: "Giza Plateau",
    city: "Giza",
    timeWindow: "morning",
    timeSlot: "09:30 AM - 01:30 PM",
    startsIn: "Starts in 1.5 hrs",
    duration: "4 Hours",
    price: 45,
    rating: 4.95,
    reviewsCount: 582,
    spotsLeft: 4,
    groupSize: "Small Group (Max 8)",
    image: pyramidsImg,
    badge: "Starting Soon",
    description:
      "Skip-the-line morning access to the Giza Plateau, panoramic viewpoints, and great photo opportunities with a licensed Egyptologist.",
    guide: {
      name: "Mohamed Hassan",
      role: "Licensed Guide • Ready Today",
      avatar: userAvatar,
    },
  },
  {
    _id: "today-2",
    title: "Historic Old Cairo & Hidden Alleys Walk",
    category: "Walking",
    location: "Islamic & Coptic Cairo",
    city: "Cairo",
    timeWindow: "afternoon",
    timeSlot: "03:30 PM - 06:30 PM",
    startsIn: "Departing at 3:30 PM",
    duration: "3 Hours",
    price: 35,
    rating: 4.88,
    reviewsCount: 340,
    spotsLeft: 2,
    groupSize: "Small Group (Max 6)",
    image: oldCairoImg,
    badge: "Only 2 Spots Left",
    description:
      "Walk the oldest streets in Cairo, explore the Hanging Church, Sultan Hassan Mosque, and discover ancient craft workshops.",
    guide: {
      name: "Ahmed Tawfik",
      role: "Heritage Specialist • On Duty",
      avatar: userAvatar,
    },
  },
  {
    _id: "today-3",
    title: "Nile River Sunset Felucca with Mint Tea",
    category: "Nile",
    location: "Zamalek, Cairo",
    city: "Cairo",
    timeWindow: "evening",
    timeSlot: "05:00 PM - 07:00 PM",
    startsIn: "Today at 5:00 PM",
    duration: "2 Hours",
    price: 25,
    rating: 4.92,
    reviewsCount: 420,
    spotsLeft: 5,
    groupSize: "Max 10",
    image: nileImg,
    badge: "Sunset Special",
    description:
      "Peaceful evening sail across the Nile as the sun dips below Cairo's skyline, with fresh authentic mint tea and local music.",
    guide: {
      name: "Captain Ibrahim",
      role: "Nile Skipper • Ready",
      avatar: userAvatar,
    },
  },
  {
    _id: "today-4",
    title: "Khan El-Khalili Bazaar & Night Food Crawl",
    category: "Food",
    location: "El-Gamaleya, Cairo",
    city: "Cairo",
    timeWindow: "evening",
    timeSlot: "06:30 PM - 09:30 PM",
    startsIn: "Today at 6:30 PM",
    duration: "3 Hours",
    price: 30,
    rating: 4.89,
    reviewsCount: 295,
    spotsLeft: 3,
    groupSize: "Max 8",
    image: khanImg,
    badge: "Evening Tour",
    description:
      "Experience Cairo at night: shimmering lantern alleys, aromatic spice markets, authentic street foods, and traditional tea houses.",
    guide: {
      name: "Kareem Zaki",
      role: "Local Host • Available",
      avatar: userAvatar,
    },
  },
  {
    _id: "today-5",
    title: "Grand Egyptian Museum Highlights Tour",
    category: "Culture",
    location: "Giza / Cairo",
    city: "Giza",
    timeWindow: "afternoon",
    timeSlot: "01:00 PM - 05:00 PM",
    startsIn: "Today at 1:00 PM",
    duration: "4 Hours",
    price: 55,
    rating: 4.94,
    reviewsCount: 380,
    spotsLeft: 6,
    groupSize: "Max 12",
    image: museumImg,
    badge: "Instant Entry",
    description:
      "Same-day entry and curated highlights walk through the Grand Egyptian Museum, Ramses II statue atrium, and main galleries.",
    guide: {
      name: "Mariam El-Sayed",
      role: "Museum Guide • Onsite",
      avatar: userAvatar,
    },
  },
  {
    _id: "today-6",
    title: "Luxor Karnak Temple Afternoon Immersion",
    category: "History",
    location: "Karnak, Luxor",
    city: "Luxor",
    timeWindow: "afternoon",
    timeSlot: "02:30 PM - 06:00 PM",
    startsIn: "Today at 2:30 PM",
    duration: "3.5 Hours",
    price: 50,
    rating: 4.97,
    reviewsCount: 410,
    spotsLeft: 4,
    groupSize: "Max 10",
    image: luxorImg,
    badge: "Upper Egypt",
    description:
      "Explore the vast hypostyle hall and sacred lake of Karnak during optimal golden hour photography lighting with an expert Egyptologist.",
    guide: {
      name: "Youssef Mansour",
      role: "Egyptologist • In Luxor",
      avatar: userAvatar,
    },
  },
  {
    _id: "today-7",
    title: "Aswan Nile Boat to Elephantine Island",
    category: "Nile",
    location: "Aswan Corniche",
    city: "Aswan",
    timeWindow: "morning",
    timeSlot: "10:30 AM - 01:30 PM",
    startsIn: "Today at 10:30 AM",
    duration: "3 Hours",
    price: 35,
    rating: 4.9,
    reviewsCount: 180,
    spotsLeft: 3,
    groupSize: "Max 6",
    image: sphinxImg,
    badge: "Aswan Scenic",
    description:
      "Scenic morning boat trip around Elephantine Island, botanical gardens, and the ancient Nilometer on the calm waters of Aswan.",
    guide: {
      name: "Fatima Nour",
      role: "Local Navigator • On Duty",
      avatar: userAvatar,
    },
  },
  {
    _id: "today-8",
    title: "Pyramids Quad Bike & Desert Sunset Safari",
    category: "Safari",
    location: "Giza Desert",
    city: "Giza",
    timeWindow: "evening",
    timeSlot: "04:30 PM - 07:00 PM",
    startsIn: "Today at 4:30 PM",
    duration: "2.5 Hours",
    price: 40,
    rating: 4.91,
    reviewsCount: 320,
    spotsLeft: 2,
    groupSize: "Max 6",
    image: safariImg,
    badge: "High Demand",
    description:
      "Adrenaline packed quad bike ride over the Sahara dunes overlooking the Great Pyramids at sunset with safety gear and guide.",
    guide: {
      name: "Tarek Safari Guide",
      role: "Adventure Lead • Ready",
      avatar: userAvatar,
    },
  },
];

const TIME_WINDOWS = [
  { label: "All Departure Times", value: "all" },
  { label: "🌅 Morning (8 AM - 12 PM)", value: "morning" },
  { label: "☀️ Afternoon (12 PM - 5 PM)", value: "afternoon" },
  { label: "🌇 Evening & Sunset (5 PM - 9 PM)", value: "evening" },
];

const CATEGORIES = [
  "All",
  "History",
  "Walking",
  "Nile",
  "Food",
  "Culture",
  "Safari",
];

const CITIES = [
  "All Cities",
  "Cairo",
  "Giza",
  "Luxor",
  "Aswan",
  "Alexandria",
];

const SORT_OPTIONS = [
  { label: "⚡ Starting Soonest", value: "soonest" },
  { label: "⭐ Highest Rated", value: "rating" },
  { label: "💵 Price: Low to High", value: "price_asc" },
  { label: "💎 Price: High to Low", value: "price_desc" },
  { label: "🔥 Fewest Spots Left", value: "spots" },
];

export default function AvailableTodayPage() {
  const isMobile = useIsMobile(992);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [tours, setTours] = useState(DEFAULT_AVAILABLE_TODAY);
  const [loading, setLoading] = useState(true);
  const { savedIds, toggleSaved } = useSavedTrips();

  // Filter states initialized from URL
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );
  const [selectedTime, setSelectedTime] = useState(
    searchParams.get("time") || "all"
  );
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || "All"
  );
  const [selectedCity, setSelectedCity] = useState(
    searchParams.get("city") || "All Cities"
  );
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "soonest");

  // Fetch API available tours
  useEffect(() => {
    const fetchAvailableTours = async () => {
      try {
        const [homeRes, tripsRes] = await Promise.allSettled([
          apiRequest("/home"),
          apiRequest("/trips"),
        ]);

        let combined = [...DEFAULT_AVAILABLE_TODAY];

        if (
          homeRes.status === "fulfilled" &&
          homeRes.value?.data?.availableToday?.length > 0
        ) {
          const apiAvailable = homeRes.value.data.availableToday.map(
            (t, idx) => ({
              _id: t._id || t.id || `api-today-${idx}`,
              title: t.title,
              category: t.category || "History",
              location: t.location || "Cairo, Egypt",
              city: t.location?.includes("Luxor")
                ? "Luxor"
                : t.location?.includes("Aswan")
                ? "Aswan"
                : t.location?.includes("Giza")
                ? "Giza"
                : "Cairo",
              timeWindow: idx % 2 === 0 ? "afternoon" : "evening",
              timeSlot: t.duration || "Available Today (Flexible)",
              startsIn: "Ready for Today",
              duration: t.duration || "3 Hours",
              price: Number(t.price) || 40,
              rating: 4.9,
              reviewsCount: 180,
              spotsLeft: (idx % 4) + 2,
              groupSize: "Small Group",
              image: t.image ? getImgSrc(t.image, pyramidsImg) : pyramidsImg,
              badge: "Available Now",
              description:
                t.description ||
                "Instant confirmation tour departing today with licensed local guides.",
              guide: {
                name: t.guide?.fullName || "Licensed Egyptologist",
                role: "Local Guide • On Duty Today",
                avatar: userAvatar,
              },
            })
          );

          const existingIds = new Set(apiAvailable.map((item) => item._id));
          const filteredDefaults = DEFAULT_AVAILABLE_TODAY.filter(
            (item) => !existingIds.has(item._id)
          );
          combined = [...apiAvailable, ...filteredDefaults];
        }

        setTours(combined);
      } catch (err) {
        console.error("Error fetching available today data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableTours();
  }, []);

  // Sync params to URL
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (selectedTime !== "all") params.set("time", selectedTime);
    if (selectedCategory !== "All") params.set("category", selectedCategory);
    if (selectedCity !== "All Cities") params.set("city", selectedCity);
    if (sortBy !== "soonest") params.set("sort", sortBy);
    setSearchParams(params, { replace: true });
  }, [searchQuery, selectedTime, selectedCategory, selectedCity, sortBy, setSearchParams]);

  const toggleSave = async (id, e) => {
    e.stopPropagation();
    if (!/^[a-f0-9]{24}$/i.test(String(id || ""))) return;
    await toggleSaved(id);
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedTime("all");
    setSelectedCategory("All");
    setSelectedCity("All Cities");
    setSortBy("soonest");
  };

  const filteredTours = useMemo(() => {
    return tours
      .filter((tour) => {
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesTitle = tour.title?.toLowerCase().includes(q);
          const matchesLoc = tour.location?.toLowerCase().includes(q);
          const matchesDesc = tour.description?.toLowerCase().includes(q);
          const matchesGuide = tour.guide?.name?.toLowerCase().includes(q);
          if (!matchesTitle && !matchesLoc && !matchesDesc && !matchesGuide) {
            return false;
          }
        }

        if (selectedTime !== "all" && tour.timeWindow !== selectedTime) {
          return false;
        }

        if (
          selectedCategory !== "All" &&
          !tour.category?.toLowerCase().includes(selectedCategory.toLowerCase())
        ) {
          return false;
        }

        if (
          selectedCity !== "All Cities" &&
          tour.city !== selectedCity &&
          !tour.location?.toLowerCase().includes(selectedCity.toLowerCase())
        ) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
        if (sortBy === "price_asc") return (a.price || 0) - (b.price || 0);
        if (sortBy === "price_desc") return (b.price || 0) - (a.price || 0);
        if (sortBy === "spots") return (a.spotsLeft || 0) - (b.spotsLeft || 0);
        return 0; // Default soonest order
      });
  }, [tours, searchQuery, selectedTime, selectedCategory, selectedCity, sortBy]);

  const hasActiveFilters =
    searchQuery ||
    selectedTime !== "all" ||
    selectedCategory !== "All" ||
    selectedCity !== "All Cities" ||
    sortBy !== "soonest";

  return (
    <div className={styles.container}>
      {/* <DesktopNavbar /> */}

      {/* MAIN SECTION */}
      <main className={styles.main}>
        {/* FILTERS CARD */}
        <div className={styles.filterCard}>
          <div className={styles.searchRow}>
            <div className={styles.dropdowns}>
              {/* Departure Window Filter */}
              <div className={styles.selectWrapper}>
                <select
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className={styles.selectInput}
                  aria-label="Filter by departure window"
                >
                  {TIME_WINDOWS.map((win) => (
                    <option key={win.value} value={win.value}>
                      {win.label}
                    </option>
                  ))}
                </select>
                <ChevronDown size={16} className={styles.selectIcon} />
              </div>

              {/* City Filter */}
              <div className={styles.selectWrapper}>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className={styles.selectInput}
                  aria-label="Filter by City"
                >
                  {CITIES.map((city) => (
                    <option key={city} value={city}>
                      📍 {city}
                    </option>
                  ))}
                </select>
                <ChevronDown size={16} className={styles.selectIcon} />
              </div>

              {/* Sort By */}
              <div className={styles.selectWrapper}>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className={styles.selectInput}
                  aria-label="Sort options"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <ChevronDown size={16} className={styles.selectIcon} />
              </div>
            </div>
          </div>

          {/* Category Pills */}
          <div className={styles.categoryPills}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`${styles.pill} ${
                  selectedCategory === cat ? styles.pillActive : ""
                }`}
              >
                {cat === "All" ? "⚡ All Available Today" : cat}
              </button>
            ))}
          </div>
        </div>

        {/* RESULTS HEADER */}
        <div className={styles.resultsHeader}>
          <div className={styles.resultsCount}>
            Showing {filteredTours.length}{" "}
            <span>
              {filteredTours.length === 1 ? "tour" : "tours"} available today
            </span>
            <span className={styles.liveIndicator}>
              <span className={styles.pulseDot} style={{ width: 6, height: 6 }} />
              Live Available
            </span>
          </div>

          {hasActiveFilters && (
            <button onClick={resetFilters} className={styles.resetBtn}>
              <RotateCcw size={14} /> Reset Filters
            </button>
          )}
        </div>

        {/* TOURS GRID */}
        {filteredTours.length > 0 ? (
          <div className={styles.grid}>
            {filteredTours.map((tour) => {
              const isSaved = savedIds.has(String(tour._id));
              const tourId = tour._id;
              const hasMongoId = tourId && tourId.length === 24;

              return (
                <div
                  key={tour._id}
                  className={styles.card}
                  onClick={() => {
                    navigate(`/user/trips/${tour._id}`);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <div className={styles.cardImageWrapper}>
                    <img
                      src={tour.image}
                      alt={tour.title}
                      className={styles.cardImage}
                      loading="lazy"
                    />

                    <span className={styles.cardBadge}>
                      <Clock size={12} />
                      {tour.startsIn || "Today"}
                    </span>

                    {tour.spotsLeft && (
                      <span className={styles.spotsBadge}>
                        <Flame size={12} style={{ display: "inline", marginRight: 4, color: "#f87171" }} />
                        Only {tour.spotsLeft} spots left
                      </span>
                    )}

                    <button
                      className={styles.favoriteButton}
                      onClick={(e) => toggleSave(tour._id, e)}
                      aria-label="Save trip"
                      disabled={!hasMongoId}
                    >
                      <Heart
                        size={18}
                        fill={isSaved ? "#ef4444" : "none"}
                        color={isSaved ? "#ef4444" : "#475569"}
                      />
                    </button>
                  </div>

                  <div className={styles.cardBody}>
                    <div className={styles.cardMetaRow}>
                      <div className={styles.location}>
                        <MapPin size={14} />
                        <span>{tour.location}</span>
                      </div>

                      <div className={styles.rating}>
                        <Star size={14} fill="#f59e0b" color="#f59e0b" />
                        <span>
                          {tour.rating}{" "}
                          <span style={{ color: "#94a3b8", fontWeight: 400 }}>
                            ({tour.reviewsCount})
                          </span>
                        </span>
                      </div>
                    </div>

                    <h3 className={styles.cardTitle}>{tour.title}</h3>

                    {/* Time Slot Highlight */}
                    <div className={styles.timeSchedule}>
                      <Clock size={14} />
                      <span>{tour.timeSlot}</span>
                    </div>

                    <div className={styles.cardDetails}>
                      <div className={styles.detailItem}>
                        <Clock size={14} color="#059669" />
                        <span>{tour.duration}</span>
                      </div>
                      <div className={styles.detailItem}>
                        <Users size={14} color="#059669" />
                        <span>{tour.groupSize}</span>
                      </div>
                    </div>

                    {tour.guide && (
                      <div className={styles.guideInfo}>
                        <img
                          src={tour.guide.avatar || userAvatar}
                          alt={tour.guide.name}
                          className={styles.guideAvatar}
                        />
                        <div className={styles.guideText}>
                          <span className={styles.guideName}>
                            {tour.guide.name}
                          </span>
                          <span className={styles.guideRole}>
                            {tour.guide.role}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className={styles.cardFooter}>
                      <div className={styles.priceWrapper}>
                        <span className={styles.priceLabel}>Price</span>
                        <div className={styles.priceValue}>
                          ${tour.price} <span>/ person</span>
                        </div>
                      </div>

                      <button
                        className={styles.actionButton}
                        onClick={(e) => {
                          // e.stopPropagation();
                          navigate(`/user/trips/${tour._id}`);
                        }}
                      >
                        <span>{hasMongoId ? "Book Now" : "Preview only"}</span>
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <Clock size={28} />
            </div>
            <h3 className={styles.emptyTitle}>No Tours Found for Today</h3>
            <p className={styles.emptyDesc}>
              No tours matched your selected departure time, city, or category filter. Try clearing filters or checking other times.
            </p>
            <button onClick={resetFilters} className={styles.emptyResetBtn}>
              Reset All Filters
            </button>
          </div>
        )}
      </main>

      <Footer />

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 flex justify-around items-center py-2 px-3 shadow-[0_-2px_10px_rgba(0,0,0,0.06)]">
        <button
          onClick={() => navigate("/user/home")}
          className="flex flex-col items-center gap-1 text-xs font-semibold text-gray-400 hover:text-gray-700"
        >
          <Home size={20} />
          <span>Home</span>
        </button>

        <button
          onClick={() => navigate("/user/trips")}
          className="flex flex-col items-center gap-1 text-xs font-bold text-[#003D5B]"
        >
          <Briefcase size={20} />
          <span>Trips</span>
        </button>

        <button
          onClick={() => navigate("/user/saved")}
          className="flex flex-col items-center gap-1 text-xs font-semibold text-gray-400 hover:text-gray-700"
        >
          <Heart size={20} />
          <span>Saved</span>
        </button>

        <button
          onClick={() => navigate("/user/profile")}
          className="flex flex-col items-center gap-1 text-xs font-semibold text-gray-400 hover:text-gray-700"
        >
          <User size={20} />
          <span>Profile</span>
        </button>
      </nav>
    </div>
  );
}
