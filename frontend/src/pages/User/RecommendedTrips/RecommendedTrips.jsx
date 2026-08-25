import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
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
  Compass,
  Home,
  Briefcase,
  User,
  X,
} from "lucide-react";

import useIsMobile from "../../../hooks/useIsMobile";
import MobilePageHeader from "../../../shared/components/MobilePageHeader/MobilePageHeader";
import styles from "./RecommendedTrips.module.css";
import DesktopNavbar from "../Home/components/DesktopNavbar/DesktopNavbar";
import Footer from "../Home/Desktop/components/Footer/Footer";
import { useSavedTrips } from "../../../context/useSavedTrips";

// Fallback image assets
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

const DEFAULT_RECOMMENDED_TRIPS = [
  {
    _id: "rec-1",
    title: "Giza Pyramids, Sphinx & Camel Trek",
    category: "History",
    location: "Giza Plateau",
    city: "Giza",
    duration: "Half Day (4 hrs)",
    durationHours: 4,
    price: 45,
    rating: 4.95,
    reviewsCount: 584,
    groupSize: "Up to 10",
    image: pyramidsImg,
    badge: "Best Seller",
    description:
      "Witness the Great Pyramid of Khufu, explore the enigmatic Sphinx, and enjoy an authentic camel ride across the golden dunes.",
    guide: {
      name: "Dr. Mohamed Hassan",
      role: "Licensed Egyptologist",
      avatar: userAvatar,
    },
  },
  {
    _id: "rec-2",
    title: "Grand Egyptian Museum & Tutankhamun Treasures",
    category: "Culture",
    location: "Giza / Cairo",
    city: "Cairo",
    duration: "Full Day (6 hrs)",
    durationHours: 6,
    price: 60,
    rating: 4.92,
    reviewsCount: 428,
    groupSize: "Up to 12",
    image: museumImg,
    badge: "Must Visit",
    description:
      "Exclusive guided journey through Egypt's newest world-class museum housing King Tut's complete golden collection and colossal statues.",
    guide: {
      name: "Mariam El-Sayed",
      role: "Archaeologist & Guide",
      avatar: userAvatar,
    },
  },
  {
    _id: "rec-3",
    title: "Historic Old Cairo, Citadel & Khan El-Khalili",
    category: "Walking",
    location: "Islamic Cairo",
    city: "Cairo",
    duration: "Full Day (5 hrs)",
    durationHours: 5,
    price: 40,
    rating: 4.88,
    reviewsCount: 365,
    groupSize: "Up to 8",
    image: oldCairoImg,
    badge: "Cultural Walk",
    description:
      "Immerse yourself in centuries of heritage: Saladin's Citadel, the Mosque of Muhammad Ali, and the vibrant alleyways of Khan El-Khalili bazaar.",
    guide: {
      name: "Ahmed Tawfik",
      role: "Cairo Heritage Specialist",
      avatar: userAvatar,
    },
  },
  {
    _id: "rec-4",
    title: "Luxor East & West Banks: Valley of the Kings",
    category: "History",
    location: "Luxor",
    city: "Luxor",
    duration: "Full Day (8 hrs)",
    durationHours: 8,
    price: 85,
    rating: 4.98,
    reviewsCount: 612,
    groupSize: "Up to 10",
    image: luxorImg,
    badge: "Top Rated",
    description:
      "Explore the majestic Karnak and Luxor temples, Hatshepsut's Mortuary Temple, and royal royal tombs in the legendary Valley of the Kings.",
    guide: {
      name: "Youssef Mansour",
      role: "Upper Egypt Specialist",
      avatar: userAvatar,
    },
  },
  {
    _id: "rec-5",
    title: "Nile River Sunset Felucca & Traditional Tea",
    category: "Nile",
    location: "Zamalek, Cairo",
    city: "Cairo",
    duration: "2 Hours",
    durationHours: 2,
    price: 25,
    rating: 4.9,
    reviewsCount: 290,
    groupSize: "Up to 6",
    image: nileImg,
    badge: "Scenic Cruise",
    description:
      "Sail aboard a classic wooden felucca at sunset, catching the gentle breeze and sweeping views of the Cairo skyline with mint tea.",
    guide: {
      name: "Captain Ibrahim",
      role: "Nile Skipper & Guide",
      avatar: userAvatar,
    },
  },
  {
    _id: "rec-6",
    title: "White Desert & Bahariya Oasis 4x4 Safari",
    category: "Safari",
    location: "Western Desert",
    city: "Cairo",
    duration: "2 Days",
    durationHours: 48,
    price: 180,
    rating: 4.96,
    reviewsCount: 198,
    groupSize: "Up to 6",
    image: safariImg,
    badge: "Adventure",
    description:
      "Unreal surreal chalk rock formations, crystal mountain, sand boarding, and magical stargazing by a Bedouin campfire.",
    guide: {
      name: "Salim Bedouin Guide",
      role: "Desert Expedition Leader",
      avatar: userAvatar,
    },
  },
  {
    _id: "rec-7",
    title: "Aswan Philae Temple & Nubian Village Experience",
    category: "Culture",
    location: "Aswan",
    city: "Aswan",
    duration: "Full Day (6 hrs)",
    durationHours: 6,
    price: 75,
    rating: 4.91,
    reviewsCount: 240,
    groupSize: "Up to 8",
    image: sphinxImg,
    badge: "Popular",
    description:
      "Boat ride to the island temple of Isis at Philae and a colorful cultural walk through authentic Nubian villages on the West Bank.",
    guide: {
      name: "Fatima Nour",
      role: "Nubian Culture Expert",
      avatar: userAvatar,
    },
  },
  {
    _id: "rec-8",
    title: "Downtown Cairo Street Food & Culinary Walk",
    category: "Food",
    location: "Downtown Cairo",
    city: "Cairo",
    duration: "3.5 Hours",
    durationHours: 3.5,
    price: 35,
    rating: 4.87,
    reviewsCount: 310,
    groupSize: "Up to 8",
    image: khanImg,
    badge: "Foodie Choice",
    description:
      "Taste authentic Koshary, fresh falafel, shawarma, Egyptian pastries, and freshly squeezed sugarcane juice with a food loving local.",
    guide: {
      name: "Kareem Zaki",
      role: "Culinary Tour Leader",
      avatar: userAvatar,
    },
  },
];

const CATEGORIES = [
  "All",
  "History",
  "Culture",
  "Walking",
  "Nile",
  "Safari",
  "Food",
];

const CITIES = [
  "All Cities",
  "Cairo",
  "Giza",
  "Luxor",
  "Aswan",
  "Alexandria",
];

const DURATIONS = [
  { label: "Any Duration", value: "all" },
  { label: "Half Day (< 5 hrs)", value: "half" },
  { label: "Full Day (5+ hrs)", value: "full" },
  { label: "Multi-Day (1+ days)", value: "multi" },
];

const SORT_OPTIONS = [
  { label: "Recommended", value: "recommended" },
  { label: "Highest Rated", value: "rating" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Most Popular", value: "popularity" },
];

export default function RecommendedTrips() {
  const isMobile = useIsMobile(992);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [trips, setTrips] = useState(DEFAULT_RECOMMENDED_TRIPS);
  const [loading, setLoading] = useState(true);
  const { savedIds, toggleSaved } = useSavedTrips();

  // Filter states initialized from URL if available
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || "All"
  );
  const [selectedCity, setSelectedCity] = useState(
    searchParams.get("city") || "All Cities"
  );
  const [selectedDuration, setSelectedDuration] = useState(
    searchParams.get("duration") || "all"
  );
  const [sortBy, setSortBy] = useState(
    searchParams.get("sort") || "recommended"
  );

  // Fetch backend trips
  useEffect(() => {
    const fetchTripsData = async () => {
      try {
        const [tripsRes, homeRes] = await Promise.allSettled([
          axios.get("http://localhost:5000/api/trips"),
          axios.get("http://localhost:5000/api/home"),
        ]);

        let combined = [...DEFAULT_RECOMMENDED_TRIPS];

        if (tripsRes.status === "fulfilled" && tripsRes.value.data?.data) {
          const apiTrips = tripsRes.value.data.data.map((t) => ({
            _id: t._id || t.id,
            title: t.title,
            category: t.category || "History",
            location: t.location || "Egypt",
            city: t.location?.includes("Luxor")
              ? "Luxor"
              : t.location?.includes("Aswan")
              ? "Aswan"
              : t.location?.includes("Giza")
              ? "Giza"
              : "Cairo",
            duration: t.duration || "Full Day",
            durationHours: 6,
            price: Number(t.price) || 50,
            rating: 4.9,
            reviewsCount: 150,
            groupSize: "Up to 12",
            image: t.image ? getImgSrc(t.image, pyramidsImg) : pyramidsImg,
            badge: "Featured",
            description: t.description || t.longDescription || "Guided tour in Egypt.",
            guide: {
              name: t.guide?.fullName || "Licensed Egyptologist",
              role: "Local Expert Guide",
              avatar: t.guide?.avatar ? getImgSrc(t.guide.avatar, userAvatar) : userAvatar,
            },
          }));

          if (apiTrips.length > 0) {
            // Prepend new active trips from API while retaining our curated rich ones
            const existingIds = new Set(apiTrips.map((item) => item._id));
            const filteredDefaults = DEFAULT_RECOMMENDED_TRIPS.filter(
              (item) => !existingIds.has(item._id)
            );
            combined = [...apiTrips, ...filteredDefaults];
          }
        } else if (homeRes.status === "fulfilled" && homeRes.value.data?.data?.featuredTrips) {
          const homeTrips = homeRes.value.data.data.featuredTrips.map((t) => ({
            _id: t._id || t.id,
            title: t.title,
            category: t.category || "History",
            location: t.location || "Cairo, Egypt",
            city: "Cairo",
            duration: t.duration || "4 Hours",
            durationHours: 4,
            price: Number(t.price) || 45,
            rating: 4.9,
            reviewsCount: 220,
            groupSize: "Up to 10",
            image: t.image ? getImgSrc(t.image, pyramidsImg) : pyramidsImg,
            badge: "Recommended",
            description: t.description || "Curated Egyptian tour.",
            guide: {
              name: t.guide?.fullName || "Licensed Egyptologist",
              role: "Local Expert Guide",
              avatar: userAvatar,
            },
          }));
          combined = [...homeTrips, ...DEFAULT_RECOMMENDED_TRIPS];
        }

        setTrips(combined);
      } catch (err) {
        console.error("Error fetching trips:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTripsData();
  }, []);

  // Update URL search parameters when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (selectedCategory !== "All") params.set("category", selectedCategory);
    if (selectedCity !== "All Cities") params.set("city", selectedCity);
    if (selectedDuration !== "all") params.set("duration", selectedDuration);
    if (sortBy !== "recommended") params.set("sort", sortBy);
    setSearchParams(params, { replace: true });
  }, [searchQuery, selectedCategory, selectedCity, selectedDuration, sortBy, setSearchParams]);

  // Toggle favorite
  const toggleSave = async (id, e) => {
    e.stopPropagation();
    if (!/^[a-f0-9]{24}$/i.test(String(id || ""))) return;
    await toggleSaved(id);
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setSelectedCity("All Cities");
    setSelectedDuration("all");
    setSortBy("recommended");
  };

  // Filter & sort logic
  const filteredTrips = useMemo(() => {
    return trips
      .filter((trip) => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesTitle = trip.title?.toLowerCase().includes(q);
          const matchesLoc = trip.location?.toLowerCase().includes(q);
          const matchesDesc = trip.description?.toLowerCase().includes(q);
          const matchesGuide = trip.guide?.name?.toLowerCase().includes(q);
          if (!matchesTitle && !matchesLoc && !matchesDesc && !matchesGuide) {
            return false;
          }
        }

        // Category filter
        if (
          selectedCategory !== "All" &&
          !trip.category?.toLowerCase().includes(selectedCategory.toLowerCase())
        ) {
          return false;
        }

        // City filter
        if (
          selectedCity !== "All Cities" &&
          trip.city !== selectedCity &&
          !trip.location?.toLowerCase().includes(selectedCity.toLowerCase())
        ) {
          return false;
        }

        // Duration filter
        if (selectedDuration === "half") {
          if (trip.durationHours && trip.durationHours >= 5) return false;
        } else if (selectedDuration === "full") {
          if (trip.durationHours && (trip.durationHours < 5 || trip.durationHours > 12)) return false;
        } else if (selectedDuration === "multi") {
          if (trip.durationHours && trip.durationHours <= 12) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
        if (sortBy === "price_asc") return (a.price || 0) - (b.price || 0);
        if (sortBy === "price_desc") return (b.price || 0) - (a.price || 0);
        if (sortBy === "popularity") return (b.reviewsCount || 0) - (a.reviewsCount || 0);
        return 0; // default order
      });
  }, [trips, searchQuery, selectedCategory, selectedCity, selectedDuration, sortBy]);

  const hasActiveFilters =
    searchQuery ||
    selectedCategory !== "All" ||
    selectedCity !== "All Cities" ||
    selectedDuration !== "all" ||
    sortBy !== "recommended";

  return (
    <div className={styles.container}>
      <DesktopNavbar />

      {/* MAIN CONTENT AREA */}
      <main className={styles.main}>
        {/* FILTERS CARD */}
        <div className={styles.filterCard}>
          <div className={styles.searchRow}>
            <div className={styles.dropdowns}>
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

              {/* Duration Filter */}
              <div className={styles.selectWrapper}>
                <select
                  value={selectedDuration}
                  onChange={(e) => setSelectedDuration(e.target.value)}
                  className={styles.selectInput}
                  aria-label="Filter by Duration"
                >
                  {DURATIONS.map((dur) => (
                    <option key={dur.value} value={dur.value}>
                      ⏱️ {dur.label}
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
                      ✨ {opt.label}
                    </option>
                  ))}
                </select>
                <ChevronDown size={16} className={styles.selectIcon} />
              </div>
            </div>
          </div>

          {/* Category Tabs */}
          <div className={styles.categoryPills}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`${styles.pill} ${
                  selectedCategory === cat ? styles.pillActive : ""
                }`}
              >
                {cat === "All" ? "🌟 All Tours" : cat}
              </button>
            ))}
          </div>
        </div>

        {/* RESULTS HEADER */}
        <div className={styles.resultsHeader}>
          <div className={styles.resultsCount}>
            Showing {filteredTrips.length}{" "}
            <span>
              {filteredTrips.length === 1 ? "tour" : "tours"} available
            </span>
          </div>

          {hasActiveFilters && (
            <button onClick={resetFilters} className={styles.resetBtn}>
              <RotateCcw size={14} /> Reset Filters
            </button>
          )}
        </div>

        {/* TRIPS GRID */}
        {filteredTrips.length > 0 ? (
          <div className={styles.grid}>
            {filteredTrips.map((trip) => {
              const isSaved = savedIds.has(String(trip._id));
              const tripId = trip._id;
              const hasMongoId = tripId && tripId.length === 24;

              return (
                <div
                  key={trip._id}
                  className={styles.card}
                  onClick={() => {
                    if (hasMongoId) {
                      navigate(`/user/trips/${tripId}`);
                    } else navigate("/user/discover-egypt");
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <div className={styles.cardImageWrapper}>
                    <img
                      src={trip.image}
                      alt={trip.title}
                      className={styles.cardImage}
                      loading="lazy"
                    />

                    <span className={styles.cardBadge}>
                      {trip.badge || trip.category || "Recommended"}
                    </span>

                    <button
                      className={styles.favoriteButton}
                      onClick={(e) => toggleSave(trip._id, e)}
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
                        <span>{trip.location}</span>
                      </div>

                      <div className={styles.rating}>
                        <Star size={14} fill="#f59e0b" color="#f59e0b" />
                        <span>
                          {trip.rating}{" "}
                          <span style={{ color: "#94a3b8", fontWeight: 400 }}>
                            ({trip.reviewsCount})
                          </span>
                        </span>
                      </div>
                    </div>

                    <h3 className={styles.cardTitle}>{trip.title}</h3>

                    <p className={styles.cardDescription}>
                      {trip.description}
                    </p>

                    <div className={styles.cardDetails}>
                      <div className={styles.detailItem}>
                        <Clock size={14} color="#003D5B" />
                        <span>{trip.duration}</span>
                      </div>
                      <div className={styles.detailItem}>
                        <Users size={14} color="#003D5B" />
                        <span>{trip.groupSize}</span>
                      </div>
                    </div>

                    {trip.guide && (
                      <div className={styles.guideInfo}>
                        <img
                          src={trip.guide.avatar || userAvatar}
                          alt={trip.guide.name}
                          className={styles.guideAvatar}
                        />
                        <div className={styles.guideText}>
                          <span className={styles.guideName}>
                            {trip.guide.name}
                          </span>
                          <span className={styles.guideRole}>
                            {trip.guide.role}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className={styles.cardFooter}>
                      <div className={styles.priceWrapper}>
                        <span className={styles.priceLabel}>From</span>
                        <div className={styles.priceValue}>
                          ${trip.price} <span>/ person</span>
                        </div>
                      </div>

                      <button
                        className={styles.actionButton}
                        onClick={(e) => {
                          navigate(`/user/trips/${tripId}`);
                        }}
                      >
                        <span>View Details</span>
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
              <Search size={28} />
            </div>
            <h3 className={styles.emptyTitle}>No Matching Trips Found</h3>
            <p className={styles.emptyDesc}>
              We couldn't find any recommended trips matching your current search or filter criteria. Try adjusting your filters.
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
