import { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import {
  Search,
  ArrowLeft,
  Crosshair,
  Clock,
  Navigation,
  Car,
  Footprints,
  SlidersHorizontal,
  Plus,
  Minus,
  Heart,
  Info,
  MapPin,
  Calendar,
  ChevronDown,
  Bell,
  User,
  Sparkles,
  X,
  Check,
  Compass,
  List,
  ArrowRight,
} from "lucide-react";
import axios from "axios";

import logo from "@/assets/images/logo.png";
import profileImage from "@/assets/images/user/user1.png";
import oldCairoImg from "@/assets/images/explore/old-cairo.jpg";
import museumImg from "@/assets/images/explore/the_grand_museum.webp";
import pyramidsImg from "@/assets/images/explore/pyramids.jpg";
import sphinxImg from "@/assets/images/explore/Sphinx.jpg";
import desertSafariImg from "@/assets/images/explore/desert-safari.jpg";
import nileFeluccaImg from "@/assets/images/explore/nile-felucca.jpg";
import NotificationPopover from "../Notifications/components/NotificationPopover";

// Default starting point (Giza / Cairo Downtown)
const DEFAULT_USER_COORDS = [29.9792, 31.1342];

// Popular Egyptian Locations for Quick Switch
const POPULAR_LOCATIONS = [
  { name: "Giza, Egypt", coords: [29.9792, 31.1342] },
  { name: "Downtown Cairo, Egypt", coords: [30.0444, 31.2357] },
  { name: "Old Cairo & Khan, Egypt", coords: [30.0477, 31.2623] },
  { name: "Luxor, Egypt", coords: [25.6872, 32.6396] },
  { name: "Alexandria, Egypt", coords: [31.2001, 29.9187] },
  { name: "Aswan, Egypt", coords: [24.0889, 32.8998] },
];

// Helper to calculate distance in km using Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return d < 1 ? `${Math.round(d * 1000)} m away` : `${d.toFixed(1)} km away`;
}

// Helper to format travel duration in hours and minutes (e.g. 2h 51m, 45m)
function formatTravelTime(mins) {
  if (!mins || isNaN(mins)) return "";
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h > 0 && m > 0) return `${h}h ${m}m`;
  if (h > 0) return `${h}h`;
  return `${m}m`;
}

// Helper for image URLs
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

// Leaflet custom marker for tour locations - matching design pins
const createPinIcon = (tour, isSelected = false) => {
  const color = tour.pinColor || (isSelected ? "#003D5B" : "#ef4444");
  const size = isSelected ? 44 : 34;
  const shadow = isSelected
    ? "0 0 0 6px rgba(0, 61, 91, 0.35), 0 8px 20px rgba(0,0,0,0.4)"
    : "0 4px 12px rgba(0,0,0,0.25)";
  const border = isSelected ? "3px solid #fbbf24" : "2.5px solid white";

  // SVG inner icon based on tour iconType
  let iconSvg = `
    <svg width="${isSelected ? 20 : 15}" height="${isSelected ? 20 : 15}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
      <circle cx="12" cy="13" r="3"/>
    </svg>
  `;

  if (tour.iconType === "boat") {
    iconSvg = `
      <svg width="${isSelected ? 20 : 15}" height="${isSelected ? 20 : 15}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M2 20a2.4 2.4 0 0 0 2 1 2.4 2.4 0 0 0 2-1 2.4 2.4 0 0 1 2-1 2.4 2.4 0 0 1 2 1 2.4 2.4 0 0 0 2 1 2.4 2.4 0 0 0 2-1 2.4 2.4 0 0 1 2-1 2.4 2.4 0 0 1 2 1 2.4 2.4 0 0 0 2 1 2.4 2.4 0 0 0 2-1"/>
        <path d="M4 18 12 3l8 15"/>
        <path d="M12 3v15"/>
      </svg>
    `;
  } else if (tour.iconType === "safari") {
    iconSvg = `
      <svg width="${isSelected ? 20 : 15}" height="${isSelected ? 20 : 15}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="5" cy="17" r="3"/>
        <circle cx="19" cy="17" r="3"/>
        <path d="M9 17h6"/>
        <path d="m19 17-1.5-6H14l-2-4H7L5 17"/>
      </svg>
    `;
  } else if (tour.iconType === "pyramid") {
    iconSvg = `
      <svg width="${isSelected ? 20 : 15}" height="${isSelected ? 20 : 15}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="m2 20 10-16 10 16z"/>
        <path d="m12 4 4 16"/>
      </svg>
    `;
  }

  return L.divIcon({
    className: "custom-leaflet-marker",
    html: `
      <div style="
        background-color: ${isSelected ? "#003D5B" : color};
        width: ${size}px;
        height: ${size}px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg) ${isSelected ? "scale(1.15)" : ""};
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: ${shadow};
        border: ${border};
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
      ">
        <div style="transform: rotate(45deg); color: white; display: flex; align-items: center; justify-content: center;">
          ${iconSvg}
        </div>
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
  });
};

// Leaflet custom animated pulsing pin for user's LIVE location
const createUserPinIcon = () => {
  return L.divIcon({
    className: "user-location-marker",
    html: `
      <div style="position: relative; width: 26px; height: 26px; display: flex; align-items: center; justify-content: center;">
        <div style="
          position: absolute;
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background-color: rgba(14, 165, 233, 0.45);
          animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;
        "></div>
        <div style="
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background-color: #0284c7;
          border: 2.5px solid white;
          box-shadow: 0 2px 10px rgba(0,0,0,0.35);
          z-index: 10;
        "></div>
      </div>
      <style>
        @keyframes ping {
          75%, 100% {
            transform: scale(2.3);
            opacity: 0;
          }
        }
      </style>
    `,
    iconSize: [26, 26],
    iconAnchor: [13, 13],
    popupAnchor: [0, -13],
  });
};

// Custom vehicle / pedestrian icon on the route
const createVehiclePinIcon = (mode = "walking") => {
  const isDrive = mode === "driving";
  return L.divIcon({
    className: "vehicle-route-marker",
    html: `
      <div style="
        background-color: ${isDrive ? "#0284c7" : "#059669"};
        color: white;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 14px rgba(0,0,0,0.35);
        border: 2.5px solid white;
      ">
        <span style="font-size: 16px;">${isDrive ? "🚗" : "🚶"}</span>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

// Rich default nearby tours dataset matching screenshot
const defaultNearbyTours = [
  {
    id: 1,
    title: "Historic Cairo Walking Trip",
    price: 25,
    timeText: "Tomorrow",
    duration: "3 Hours",
    badgeText: "Last seat",
    badgeColor: "bg-red-500",
    position: [30.0477, 31.2623],
    location: "Khan El-Khalili, Cairo",
    image: oldCairoImg,
    pinColor: "#ef4444",
    iconType: "camera",
    category: "History",
    rating: 4.8,
    reviewsCount: 340,
    guide: "Mohamed Hassan",
  },
  {
    id: 2,
    title: "Pyramids Sunrise & Sphinx Experience",
    price: 45,
    timeText: "2 days left",
    duration: "4 Hours",
    badgeText: "4 available",
    badgeColor: "bg-[#0097a7]",
    position: [29.9792, 31.1342],
    location: "Giza Plateau",
    image: pyramidsImg,
    pinColor: "#ef4444",
    iconType: "pyramid",
    category: "History",
    rating: 4.9,
    reviewsCount: 582,
    guide: "Mohamed Hassan",
  },
  {
    id: 3,
    title: "Nile Sunset Felucca",
    price: 20,
    timeText: "Tomorrow",
    duration: "2 Hours",
    badgeText: "Available",
    badgeColor: "bg-emerald-600",
    position: [30.0420, 31.2280],
    location: "River Nile, Cairo",
    image: nileFeluccaImg,
    pinColor: "#0284c7",
    iconType: "boat",
    category: "Culture",
    rating: 4.8,
    reviewsCount: 290,
    guide: "Mariam El-Sayed",
  },
  {
    id: 4,
    title: "Cairo Street Food Evening",
    price: 30,
    timeText: "Today",
    duration: "3 Hours",
    badgeText: "Popular",
    badgeColor: "bg-amber-500",
    position: [30.0460, 31.2400],
    location: "Downtown & Old Cairo",
    image: oldCairoImg,
    pinColor: "#f59e0b",
    iconType: "camera",
    category: "Food",
    rating: 4.9,
    reviewsCount: 215,
    guide: "Mariam El-Sayed",
  },
  {
    id: 5,
    title: "Coptic Cairo & Civilization Museum",
    price: 35,
    timeText: "Tomorrow",
    duration: "5 Hours",
    badgeText: "8 available",
    badgeColor: "bg-[#0097a7]",
    position: [30.0058, 31.2300],
    location: "Old Cairo & NMEC",
    image: museumImg,
    pinColor: "#9333ea",
    iconType: "museum",
    category: "Culture",
    rating: 4.9,
    reviewsCount: 410,
    guide: "Mohamed Hassan",
  },
  {
    id: 6,
    title: "Siwa Desert Safari & Sunset",
    price: 75,
    timeText: "3 days left",
    duration: "6 Hours",
    badgeText: "6 available",
    badgeColor: "bg-[#0097a7]",
    position: [29.2032, 25.5186],
    location: "Siwa Oasis",
    image: desertSafariImg,
    pinColor: "#d97706",
    iconType: "safari",
    category: "Adventure",
    rating: 4.7,
    reviewsCount: 95,
    guide: "Salma Nassar",
  },
  {
    id: 7,
    title: "Alexandria Coastal & Heritage Trip",
    price: 50,
    timeText: "Tomorrow",
    duration: "Full Day",
    badgeText: "Best Seller",
    badgeColor: "bg-purple-600",
    position: [31.2001, 29.9187],
    location: "Alexandria Corniche",
    image: sphinxImg,
    pinColor: "#003D5B",
    iconType: "camera",
    category: "Culture",
    rating: 4.8,
    reviewsCount: 180,
    guide: "Youssef Farouk",
  },
  {
    id: 8,
    title: "Luxor East & West Banks",
    price: 65,
    timeText: "Daily",
    duration: "Full Day",
    badgeText: "Top Rated",
    badgeColor: "bg-emerald-700",
    position: [25.6872, 32.6396],
    location: "Luxor Temples",
    image: oldCairoImg,
    pinColor: "#ef4444",
    iconType: "pyramid",
    category: "History",
    rating: 5.0,
    reviewsCount: 420,
    guide: "Omar Khalil",
  },
];

// Helper component to bind map instance and support programmatic zooming/recentering
function MapController({ center, zoom, onMapReady }) {
  const map = useMap();

  useEffect(() => {
    if (onMapReady) {
      onMapReady(map);
    }
  }, [map, onMapReady]);

  useEffect(() => {
    if (center && center.length === 2) {
      map.flyTo(center, zoom || 13, { duration: 1.2 });
    }
  }, [center, zoom, map]);

  return null;
}

export default function NearbyMap() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth || {});
  const notifications = useSelector((state) => state.notifications?.notifications || []);
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTour, setSelectedTour] = useState(defaultNearbyTours[0]);
  const [userLocation, setUserLocation] = useState(DEFAULT_USER_COORDS);
  const [mapCenter, setMapCenter] = useState(defaultNearbyTours[0].position);
  const [toursList, setToursList] = useState(defaultNearbyTours);
  const [isLocating, setIsLocating] = useState(false);
  const [travelMode, setTravelMode] = useState("walking"); // "walking" | "driving"
  const [routeData, setRouteData] = useState(null);
  const [sortBy, setSortBy] = useState("recommended"); // "recommended" | "price-asc" | "price-desc" | "duration" | "rating"
  const [savedTourIds, setSavedTourIds] = useState(new Set());
  const [currentLocationName, setCurrentLocationName] = useState("Giza, Egypt");
  const [isSheetExpanded, setIsSheetExpanded] = useState(false);
  const touchStartY = useRef(0);

  // Popover States
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [maxPriceFilter, setMaxPriceFilter] = useState(150);

  const markerRefs = useRef({});
  const cardRefs = useRef({});
  const mapRef = useRef(null);
  const actionsRef = useRef(null);

  const avatar = getImgSrc(user?.profileImage || user?.avatar, profileImage);

  // 1. AUTO-DETECT GPS location on page load
  useEffect(() => {
    if (navigator.geolocation) {
      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = [pos.coords.latitude, pos.coords.longitude];
          setUserLocation(coords);
          setIsLocating(false);
        },
        (error) => {
          console.warn("Geolocation fallback:", error.message);
          setUserLocation(DEFAULT_USER_COORDS);
          setIsLocating(false);
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    }
  }, []);

  // 2. Fetch backend trips if available and merge
  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/home");
        if (response.data?.data?.featuredTrips?.length > 0) {
          const apiTrips = response.data.data.featuredTrips.map((t, idx) => {
            const fallback = defaultNearbyTours[idx % defaultNearbyTours.length];
            return {
              id: t._id || idx + 10,
              title: t.title || fallback.title,
              price: t.price || fallback.price,
              timeText: idx % 2 === 0 ? "Tomorrow" : "2 days left",
              duration: t.duration ? `${t.duration}` : fallback.duration,
              badgeText: idx === 0 ? "Last seat" : idx === 1 ? "4 available" : "Available",
              badgeColor: idx === 0 ? "bg-red-500" : idx === 1 ? "bg-[#0097a7]" : "bg-emerald-600",
              position: t.coordinates?.lat ? [t.coordinates.lat, t.coordinates.lng] : fallback.position,
              location: t.location || fallback.location,
              image: getImgSrc(t.image, fallback.image),
              pinColor: fallback.pinColor,
              iconType: fallback.iconType,
              category: fallback.category,
              rating: t.rating || fallback.rating,
              reviewsCount: t.reviewsCount || fallback.reviewsCount,
            };
          });
          // Merge API trips with default rich set to ensure complete variety
          const merged = [...defaultNearbyTours];
          apiTrips.forEach((apiT) => {
            if (!merged.find((m) => m.title.toLowerCase() === apiT.title.toLowerCase())) {
              merged.push(apiT);
            }
          });
          setToursList(merged);
        }
      } catch (err) {
        console.log("Using default nearby tours dataset:", err);
      }
    };
    fetchTrips();
  }, []);

  // 3. FETCH REAL ROAD NETWORK ROUTING (OSRM) FOR BOTH WALKING & DRIVING
  useEffect(() => {
    const activeStart = userLocation || DEFAULT_USER_COORDS;
    if (!selectedTour) {
      setRouteData(null);
      return;
    }

    const fetchRealRoadRoute = async () => {
      try {
        const startLng = activeStart[1];
        const startLat = activeStart[0];
        const endLng = selectedTour.position[1];
        const endLat = selectedTour.position[0];

        const url = `https://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=geojson`;
        const res = await fetch(url);
        const data = await res.json();

        if (data.routes && data.routes.length > 0) {
          const route = data.routes[0];
          const coords = route.geometry.coordinates.map(([lng, lat]) => [lat, lng]);
          const distanceKmVal = route.distance / 1000;
          const distanceKm = distanceKmVal.toFixed(1);

          let durationMins;
          if (travelMode === "walking") {
            durationMins = Math.max(1, Math.round(distanceKmVal * 12.5));
          } else {
            durationMins = Math.max(1, Math.round(route.duration / 60));
          }

          setRouteData({ coords, durationMins, distanceKm, mode: travelMode });
        } else {
          throw new Error("No route found");
        }
      } catch (err) {
        const distKm = parseFloat(
          calculateDistance(
            activeStart[0],
            activeStart[1],
            selectedTour.position[0],
            selectedTour.position[1]
          )
        ) || 3.2;
        const durationMins =
          travelMode === "walking" ? Math.round(distKm * 12.5) : Math.round(distKm * 2.5);
        setRouteData({
          coords: [activeStart, selectedTour.position],
          durationMins: Math.max(1, durationMins),
          distanceKm: distKm.toFixed(1),
          mode: travelMode,
        });
      }
    };

    fetchRealRoadRoute();
  }, [selectedTour, userLocation, travelMode]);

  // 4. Automatically open pin popup when selectedTour changes
  useEffect(() => {
    if (selectedTour && markerRefs.current[selectedTour.id]) {
      markerRefs.current[selectedTour.id].openPopup();
    }
  }, [selectedTour]);

  // 5. Close popovers on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (actionsRef.current && !actionsRef.current.contains(e.target)) {
        setShowNotifications(false);
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // 6. Recalibrate Leaflet size & auto-scroll mobile carousel card into view when selectedTour changes
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.invalidateSize();
    }
    if (selectedTour && cardRefs.current[selectedTour.id] && !isSheetExpanded) {
      cardRefs.current[selectedTour.id].scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [selectedTour, isSheetExpanded]);

  // Touch gesture handlers for swipe up & down on bottom sheet handle
  const handleTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    const touchEndY = e.changedTouches[0].clientY;
    const diffY = touchStartY.current - touchEndY;
    if (diffY > 40) {
      setIsSheetExpanded(true);
    } else if (diffY < -40) {
      setIsSheetExpanded(false);
    }
  };

  // 6. Compute distance, filter and sort tours
  const filteredTours = useMemo(() => {
    const activeStart = userLocation || DEFAULT_USER_COORDS;
    let result = toursList.map((t) => {
      const distanceStr = calculateDistance(
        activeStart[0],
        activeStart[1],
        t.position[0],
        t.position[1]
      );
      return { ...t, distanceStr };
    });

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.location.toLowerCase().includes(q) ||
          (t.category && t.category.toLowerCase().includes(q))
      );
    }

    // Category filter
    if (categoryFilter !== "all") {
      result = result.filter(
        (t) => t.category && t.category.toLowerCase() === categoryFilter.toLowerCase()
      );
    }

    // Max Price filter
    result = result.filter((t) => t.price <= maxPriceFilter);

    // Sorting
    if (sortBy === "price-asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return result;
  }, [searchQuery, toursList, userLocation, categoryFilter, maxPriceFilter, sortBy]);

  // Select tour handler
  const handleSelectTour = (tour) => {
    setSelectedTour(tour);
    setMapCenter(tour.position);
  };

  // Toggle favorite saved
  const toggleSave = (id, e) => {
    e.stopPropagation();
    setSavedTourIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Recenter button click
  const handleRecenter = () => {
    if (userLocation) {
      setMapCenter(userLocation);
      if (mapRef.current) {
        mapRef.current.flyTo(userLocation, 14, { duration: 1 });
      }
    } else if (navigator.geolocation) {
      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = [pos.coords.latitude, pos.coords.longitude];
          setUserLocation(coords);
          setMapCenter(coords);
          setIsLocating(false);
          if (mapRef.current) {
            mapRef.current.flyTo(coords, 14, { duration: 1 });
          }
        },
        () => {
          setMapCenter(DEFAULT_USER_COORDS);
          setIsLocating(false);
        }
      );
    } else {
      setMapCenter(DEFAULT_USER_COORDS);
    }
  };

  // Zoom In / Zoom Out Controls
  const handleZoomIn = () => {
    if (mapRef.current) {
      mapRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (mapRef.current) {
      mapRef.current.zoomOut();
    }
  };

  // Handle Location Switch
  const handleSwitchLocation = (loc) => {
    setCurrentLocationName(loc.name);
    setUserLocation(loc.coords);
    setMapCenter(loc.coords);
    setShowLocationPicker(false);
    if (mapRef.current) {
      mapRef.current.flyTo(loc.coords, 13, { duration: 1.2 });
    }
  };

  // Compute mid point along route for walker/car icon placement
  const routeMidPoint = useMemo(() => {
    if (routeData?.coords && routeData.coords.length > 0) {
      const midIdx = Math.floor(routeData.coords.length / 2);
      return routeData.coords[midIdx];
    }
    return null;
  }, [routeData]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-slate-50 font-sans flex flex-col">
      {/* ========================================================================= */}
      {/* 1. TOP HEADER (DESKTOP NAVBAR)                                           */}
      {/* ========================================================================= */}
      <header className="h-[72px] bg-white border-b border-slate-200/80 px-5 lg:px-8 flex items-center justify-between z-30 shrink-0 shadow-xs">
        {/* Brand Logo */}
        <div
          onClick={() => navigate("/user/home")}
          className="flex items-center gap-2 cursor-pointer select-none group"
        >
          <img
            src={logo}
            alt="Nefru Logo"
            className="h-9 w-auto group-hover:scale-105 transition-transform"
          />
          <span
            className="font-semibold text-[#003D5B] tracking-tight"
            style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: "2.1rem" }}
          >
            Nefru
          </span>
        </div>

        {/* Center Search & Filters (Desktop) */}
        <div className="hidden md:flex items-center gap-3 flex-1 max-w-xl mx-6">
          <div className="flex-1 bg-slate-100/90 hover:bg-slate-100 focus-within:bg-white focus-within:ring-2 focus-within:ring-[#003D5B]/20 rounded-full px-4 py-2.5 flex items-center gap-2.5 border border-slate-200/70 transition-all shadow-xs">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search locations, tours, or activities..."
              className="w-full bg-transparent text-sm font-medium text-slate-800 placeholder-slate-400 outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="text-slate-400 hover:text-slate-600 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filters Button with Popover */}
          <div className="relative">
            <button
              onClick={() => setShowFiltersModal((prev) => !prev)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full border text-xs font-bold transition-all shadow-xs ${
                showFiltersModal || categoryFilter !== "all" || maxPriceFilter < 150
                  ? "bg-[#003D5B] text-white border-[#003D5B]"
                  : "bg-white hover:bg-slate-50 text-slate-700 border-slate-200"
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
            </button>

            {/* Filter Dropdown */}
            {showFiltersModal && (
              <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h4 className="font-extrabold text-sm text-slate-900">Filter Tours</h4>
                  <button
                    onClick={() => {
                      setCategoryFilter("all");
                      setMaxPriceFilter(150);
                    }}
                    className="text-[11px] font-bold text-[#003D5B] hover:underline"
                  >
                    Reset
                  </button>
                </div>

                <div className="py-3 space-y-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">
                      Category
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {["all", "historical", "adventure", "food & culture", "sightseeing"].map(
                        (cat) => (
                          <button
                            key={cat}
                            onClick={() => setCategoryFilter(cat)}
                            className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize transition-colors ${
                              categoryFilter === cat
                                ? "bg-[#003D5B] text-white"
                                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                            }`}
                          >
                            {cat}
                          </button>
                        )
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-bold text-slate-700">Max Price</label>
                      <span className="text-xs font-bold text-[#003D5B]">${maxPriceFilter}</span>
                    </div>
                    <input
                      type="range"
                      min="20"
                      max="150"
                      step="5"
                      value={maxPriceFilter}
                      onChange={(e) => setMaxPriceFilter(Number(e.target.value))}
                      className="w-full accent-[#003D5B] cursor-pointer"
                    />
                  </div>
                </div>

                <button
                  onClick={() => setShowFiltersModal(false)}
                  className="w-full mt-2 py-2 bg-[#003D5B] text-white rounded-xl text-xs font-bold hover:bg-[#002b40] transition-colors"
                >
                  Apply Filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Navigation Items */}
        <div className="flex items-center gap-4 lg:gap-6" ref={actionsRef}>
          <button
            onClick={() => navigate("/user/discover")}
            className="hidden lg:inline-block text-sm font-semibold text-slate-700 hover:text-[#003D5B] transition-colors"
          >
            Explore
          </button>

          <button
            onClick={() => navigate("/user/profile/bookings")}
            className="hidden lg:inline-block text-sm font-semibold text-slate-700 hover:text-[#003D5B] transition-colors"
          >
            My Bookings
          </button>

          <button
            onClick={() => navigate("/user/saved")}
            className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-slate-700 hover:text-[#003D5B] transition-colors"
          >
            <span>Favorites</span>
            <Heart className="w-4 h-4 text-slate-500 stroke-[2]" />
          </button>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications((prev) => !prev);
                setShowProfileMenu(false);
              }}
              className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 hover:bg-slate-200 transition-colors relative"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white" />
              )}
            </button>

            {showNotifications && (
              <NotificationPopover onClose={() => setShowNotifications(false)} />
            )}
          </div>

          {/* User Avatar / Profile */}
          <div className="relative">
            <button
              onClick={() => {
                setShowProfileMenu((prev) => !prev);
                setShowNotifications(false);
              }}
              className="w-9 h-9 rounded-full overflow-hidden border border-slate-200 hover:ring-2 hover:ring-[#003D5B]/30 transition-all shrink-0"
              aria-label="User Profile"
            >
              <img src={avatar} alt="User Avatar" className="w-full h-full object-cover" />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    navigate("/user/profile");
                  }}
                  className="w-full px-3 py-2 text-left text-xs font-bold text-slate-800 hover:bg-slate-50 rounded-xl flex items-center gap-2"
                >
                  <User className="w-3.5 h-3.5 text-[#003D5B]" />
                  <span>Profile Overview</span>
                </button>
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    navigate("/user/profile/bookings");
                  }}
                  className="w-full px-3 py-2 text-left text-xs font-bold text-slate-800 hover:bg-slate-50 rounded-xl flex items-center gap-2"
                >
                  <Calendar className="w-3.5 h-3.5 text-[#003D5B]" />
                  <span>My Bookings</span>
                </button>
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    navigate("/user/saved");
                  }}
                  className="w-full px-3 py-2 text-left text-xs font-bold text-slate-800 hover:bg-slate-50 rounded-xl flex items-center gap-2"
                >
                  <Heart className="w-3.5 h-3.5 text-[#003D5B]" />
                  <span>Saved Tours</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. MAIN BODY (SPLIT VIEW: MAP LEFT + SIDEBAR RIGHT)                     */}
      {/* ========================================================================= */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* ======================================================================= */}
        {/* 2A. LEFT MAP SECTION                                                    */}
        {/* ======================================================================= */}
        <div className="flex-1 h-full relative overflow-hidden">
          {/* Mobile Top Floating Search Bar (Only shown on small screens < 768px) */}
          <div className="md:hidden absolute top-3 left-3 right-3 z-[1000] flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate("/user/home")}
                className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-slate-700 shadow-md border border-slate-100 hover:bg-slate-50 transition-colors shrink-0"
                aria-label="Back to Home"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              <div className="flex-1 bg-white/95 backdrop-blur-md rounded-2xl shadow-md border border-slate-100 px-3 py-2 flex items-center gap-2">
                <Search className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search locations..."
                  className="w-full bg-transparent text-xs font-medium text-slate-800 placeholder-slate-400 outline-none"
                />
              </div>

              <button
                onClick={handleRecenter}
                className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-md border border-slate-100 text-[#003D5B] hover:bg-slate-50 transition-colors shrink-0"
              >
                <Crosshair className={`w-5 h-5 ${isLocating ? "animate-spin text-sky-600" : ""}`} />
              </button>
            </div>
          </div>

          {/* Floating Pill: Search this area */}
          <div className="absolute top-4 left-4 z-[990] hidden md:block">
            <button
              onClick={() => {
                if (mapRef.current) {
                  const center = mapRef.current.getCenter();
                  setUserLocation([center.lat, center.lng]);
                }
              }}
              className="bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-full shadow-lg border border-slate-200/80 text-xs font-extrabold text-slate-800 flex items-center gap-2 hover:bg-white hover:shadow-xl hover:scale-102 transition-all cursor-pointer"
            >
              <Search className="w-3.5 h-3.5 text-slate-500" />
              <span>Search this area</span>
            </button>
          </div>

          {/* Floating Pill: Mode Selector (Walking vs Driving) - Visible on Mobile & Desktop */}
          <div className="absolute top-16 md:top-4 left-1/2 -translate-x-1/2 z-[990] flex bg-white/95 backdrop-blur-md p-1 rounded-full shadow-xl border border-slate-200/80 items-center gap-1 text-xs font-bold">
            <button
              onClick={() => setTravelMode("walking")}
              className={`px-3.5 py-1.5 rounded-full flex items-center gap-1.5 transition-all cursor-pointer ${
                travelMode === "walking"
                  ? "bg-emerald-600 text-white shadow-xs font-extrabold"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Footprints className="w-3.5 h-3.5" />
              <span>On Foot</span>
            </button>
            <button
              onClick={() => setTravelMode("driving")}
              className={`px-3.5 py-1.5 rounded-full flex items-center gap-1.5 transition-all cursor-pointer ${
                travelMode === "driving"
                  ? "bg-[#003D5B] text-white shadow-xs font-extrabold"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Car className="w-3.5 h-3.5" />
              <span>By Car</span>
            </button>
          </div>

          {/* Floating Bottom-Left Card: Showing tours near */}
          <div className="absolute bottom-6 left-6 z-[990] hidden md:block">
            <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-100 p-3.5 flex items-center gap-3.5 relative">
              <div className="w-10 h-10 rounded-full bg-[#003D5B] text-white flex items-center justify-center shrink-0 shadow-xs">
                <MapPin className="w-5 h-5 text-emerald-400 stroke-[2.4]" />
              </div>
              <div>
                <span className="text-[11px] font-semibold text-slate-400 block leading-tight">
                  Showing tours near
                </span>
                <h4 className="font-extrabold text-slate-900 text-sm leading-tight mt-0.5">
                  {currentLocationName}
                </h4>
                <button
                  onClick={() => setShowLocationPicker((prev) => !prev)}
                  className="text-[11px] font-bold text-[#003D5B] hover:text-emerald-700 underline mt-0.5 block text-left"
                >
                  Change location
                </button>
              </div>

              {/* Location Picker Popover */}
              {showLocationPicker && (
                <div className="absolute bottom-full left-0 mb-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 p-3 z-50 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
                    <span className="font-bold text-xs text-slate-800">Select Region</span>
                    <button
                      onClick={() => setShowLocationPicker(false)}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="space-y-1">
                    {POPULAR_LOCATIONS.map((loc) => (
                      <button
                        key={loc.name}
                        onClick={() => handleSwitchLocation(loc)}
                        className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                          currentLocationName === loc.name
                            ? "bg-[#003D5B] text-white"
                            : "hover:bg-slate-100 text-slate-700"
                        }`}
                      >
                        <span>{loc.name}</span>
                        {currentLocationName === loc.name && <Check className="w-3.5 h-3.5" />}
                      </button>
                    ))}
                    <button
                      onClick={() => {
                        handleRecenter();
                        setShowLocationPicker(false);
                        setCurrentLocationName("Detected GPS Location");
                      }}
                      className="w-full text-left px-2.5 py-2 mt-1 rounded-xl text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 flex items-center gap-1.5"
                    >
                      <Crosshair className="w-3.5 h-3.5" />
                      <span>Use My Exact GPS</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Floating Bottom-Right Map Controls Stack */}
          <div className="absolute bottom-6 right-6 z-[990] hidden md:flex flex-col gap-2">
            <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-100 flex flex-col divide-y divide-slate-100 overflow-hidden">
              <button
                onClick={handleZoomIn}
                className="w-10 h-10 flex items-center justify-center text-slate-700 hover:bg-slate-50 transition-colors font-bold"
                aria-label="Zoom In"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
              </button>
              <button
                onClick={handleZoomOut}
                className="w-10 h-10 flex items-center justify-center text-slate-700 hover:bg-slate-50 transition-colors font-bold"
                aria-label="Zoom Out"
              >
                <Minus className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>

            <button
              onClick={handleRecenter}
              className={`w-10 h-10 rounded-2xl bg-white/95 backdrop-blur-md shadow-xl border border-slate-100 flex items-center justify-center transition-all ${
                isLocating
                  ? "text-sky-600 animate-spin"
                  : "text-[#003D5B] hover:bg-slate-50 hover:scale-105"
              }`}
              aria-label="Recenter Location"
            >
              <Crosshair className="w-5 h-5 stroke-[2.3]" />
            </button>
          </div>

          {/* Map Container */}
          <MapContainer
            center={mapCenter}
            zoom={12}
            zoomControl={false}
            className="w-full h-full z-0"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <MapController
              center={mapCenter}
              zoom={13}
              onMapReady={(instance) => {
                mapRef.current = instance;
              }}
            />

            {/* Real Street Road Polyline Route */}
            {selectedTour && routeData?.coords && (
              <Polyline
                key={`${travelMode}-${selectedTour.id}`}
                positions={routeData.coords}
                pathOptions={{
                  color: travelMode === "walking" ? "#059669" : "#0284c7",
                  weight: travelMode === "walking" ? 5 : 6,
                  dashArray: travelMode === "walking" ? "6, 10" : undefined,
                  opacity: 0.95,
                  lineCap: "round",
                }}
              />
            )}

            {/* Pedestrian / Car Icon on Real Road Route */}
            {routeMidPoint && (
              <Marker position={routeMidPoint} icon={createVehiclePinIcon(travelMode)}>
                <Popup className="custom-leaflet-popup">
                  <div className="p-1 text-center font-bold text-xs">
                    {travelMode === "walking" ? "🚶 On Walking Route" : "🚗 On Driving Route"}
                  </div>
                </Popup>
              </Marker>
            )}

            {/* User GPS Location Marker */}
            {userLocation && (
              <Marker position={userLocation} icon={createUserPinIcon()}>
                <Popup className="custom-leaflet-popup">
                  <div className="p-1 text-center font-bold text-xs text-sky-700">
                    🎯 Your Location
                  </div>
                </Popup>
              </Marker>
            )}

            {/* Tour Location Pins */}
            {filteredTours.map((tour) => {
              const isSelected = selectedTour?.id === tour.id;
              return (
                <Marker
                  key={tour.id}
                  ref={(ref) => {
                    if (ref) markerRefs.current[tour.id] = ref;
                  }}
                  position={tour.position}
                  icon={createPinIcon(tour, isSelected)}
                  eventHandlers={{
                    click: () => {
                      handleSelectTour(tour);
                    },
                  }}
                >
                  <Popup className="custom-leaflet-popup">
                    <div className="p-1 max-w-[210px]">
                      <img
                        src={tour.image}
                        alt={tour.title}
                        className="w-full h-24 rounded-lg object-cover mb-2 shadow-xs"
                      />
                      <span className="bg-[#003D5B] text-white text-[9px] font-bold px-2 py-0.5 rounded-full inline-block mb-1">
                        {tour.category || "Selected Tour"}
                      </span>
                      <h4 className="font-extrabold text-slate-900 text-xs leading-snug mb-1">
                        {tour.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 font-medium mb-1">
                        📍 {tour.location}
                      </p>
                      {routeData && isSelected ? (
                        <p className="text-[11px] text-emerald-800 font-bold mb-1.5 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/80 inline-block whitespace-nowrap">
                          {travelMode === "walking" ? "🚶 Walk:" : "🚗 Drive:"}{" "}
                          {formatTravelTime(routeData.durationMins)} ({routeData.distanceKm} km)
                        </p>
                      ) : (
                        <p className="text-[11px] text-sky-700 font-bold mb-1.5 bg-sky-50 px-2 py-0.5 rounded border border-sky-200/60 inline-block whitespace-nowrap">
                          📏 {tour.distanceStr}
                        </p>
                      )}
                      <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-slate-100">
                        <span className="font-extrabold text-sm text-[#003D5B]">
                          ${tour.price}
                        </span>
                        <button
                          onClick={() => navigate("/user/trips/book", { state: { tour, trip: tour } })}
                          className="text-[11px] font-extrabold text-white bg-[#003D5B] hover:bg-[#002b40] px-3 py-1.5 rounded-lg shadow-xs transition-colors shrink-0 whitespace-nowrap"
                        >
                          Book Now →
                        </button>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>

          {/* ======================================================================= */}
          {/* MOBILE SWIPE-UP EXPANDABLE BOTTOM SHEET OVERLAY                          */}
          {/* ======================================================================= */}
          <div
            className={`md:hidden fixed inset-x-0 bottom-0 z-[1000] bg-white/95 backdrop-blur-md rounded-t-3xl shadow-[0_-8px_30px_rgba(0,0,0,0.2)] border-t border-slate-200/90 transition-all duration-300 ease-out flex flex-col ${
              isSheetExpanded ? "h-[85vh]" : "h-[265px]"
            }`}
          >
            {/* Drag Handle Bar & Header (Swipable area) */}
            <div
              onClick={() => setIsSheetExpanded((prev) => !prev)}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              className="py-2.5 px-4 cursor-pointer select-none shrink-0 flex flex-col items-center bg-white rounded-t-3xl border-b border-slate-200/80 shadow-xs z-10"
            >
              <div className="w-12 h-1.5 bg-slate-300 rounded-full mb-1.5" />
              <div className="w-full flex items-center justify-between">
                <span className="text-xs font-black text-slate-800 tracking-tight flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#003D5B]" />
                  <span>Nearby Experiences ({filteredTours.length})</span>
                </span>
                <span className="text-[10px] font-extrabold text-[#003D5B] bg-[#003D5B]/10 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  {isSheetExpanded ? "Swipe Down 🔽" : "Swipe Up 🔼"}
                </span>
              </div>
            </div>

            {/* Content Area */}
            {isSheetExpanded ? (
              /* EXPANDED STATE: Full vertical scrollable list of tour cards */
              <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-10">
                {filteredTours.map((tour) => {
                  const isSelected = selectedTour?.id === tour.id;
                  const isSaved = savedTourIds.has(tour.id);

                  return (
                    <div
                      key={`mobile-expanded-${tour.id}`}
                      onClick={() => {
                        handleSelectTour(tour);
                        setIsSheetExpanded(false);
                      }}
                      className={`bg-white rounded-2xl border p-3 flex gap-3 cursor-pointer shadow-xs transition-all ${
                        isSelected
                          ? "border-[#003D5B] ring-2 ring-[#003D5B]/20 bg-[#003D5B]/[0.02]"
                          : "border-slate-200/80 hover:border-slate-300"
                      }`}
                    >
                      <img
                        src={tour.image}
                        alt={tour.title}
                        className="w-24 h-24 rounded-xl object-cover shrink-0 shadow-xs"
                      />
                      <div className="flex-1 flex flex-col justify-between min-w-0">
                        <div>
                          <div className="flex items-start justify-between gap-1">
                            <h4 className="font-extrabold text-xs text-slate-900 leading-snug line-clamp-2">
                              {tour.title}
                            </h4>
                            <button
                              onClick={(e) => toggleSave(tour.id, e)}
                              className="text-slate-400 hover:text-red-500 p-0.5 shrink-0"
                            >
                              <Heart className={`w-4 h-4 ${isSaved ? "fill-red-500 text-red-500" : ""}`} />
                            </button>
                          </div>
                          <p className="text-[11px] text-slate-500 font-medium truncate mt-1">
                            📍 {tour.location}
                          </p>
                          <div className="flex items-center gap-2 text-[10px] text-slate-500 font-semibold mt-1">
                            <span>⏱️ {tour.duration}</span>
                            <span>⭐ {tour.rating} ({tour.reviewsCount})</span>
                            {isSelected && routeData && (
                              <span className="text-emerald-800 font-extrabold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/80 whitespace-nowrap">
                                {travelMode === "walking" ? "🚶" : "🚗"} {formatTravelTime(routeData.durationMins)}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-slate-100">
                          <div className="flex items-baseline gap-1 leading-none shrink-0 whitespace-nowrap">
                            <span className="font-black text-sm text-[#003D5B]">${tour.price}</span>
                            <span className="text-[9px] text-slate-400 font-normal">/person</span>
                          </div>
                          <span className="text-[10px] font-extrabold text-white bg-[#003D5B] px-3 py-1.5 rounded-xl shrink-0 whitespace-nowrap">
                            View Map Pin →
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* COLLAPSED STATE: Horizontal scrollable carousel */
              <div className="flex-1 overflow-x-auto px-4 py-3 flex gap-3.5 snap-x snap-mandatory no-scrollbar items-center">
                {filteredTours.map((tour) => {
                  const isSelected = selectedTour?.id === tour.id;
                  const isSaved = savedTourIds.has(tour.id);

                  return (
                    <div
                      key={`mobile-collapsed-${tour.id}`}
                      ref={(el) => {
                        if (el) cardRefs.current[tour.id] = el;
                      }}
                      onClick={() => handleSelectTour(tour)}
                      className={`snap-center shrink-0 w-[320px] sm:w-[340px] h-[148px] bg-white rounded-2xl border p-2.5 flex gap-3 shadow-md transition-all cursor-pointer overflow-hidden ${
                        isSelected
                          ? "border-[#003D5B] ring-2 ring-[#003D5B]/30 shadow-lg"
                          : "border-slate-200/90 hover:border-slate-300"
                      }`}
                    >
                      {/* Thumbnail */}
                      <div className="relative w-24 h-full rounded-xl overflow-hidden shrink-0 shadow-xs">
                        <img src={tour.image} alt={tour.title} className="w-full h-full object-cover" />
                        <span
                          className={`absolute top-1.5 left-1.5 px-2 py-0.5 rounded-full text-[9px] font-extrabold text-white shadow-xs z-10 ${
                            tour.badgeColor || "bg-red-500"
                          }`}
                        >
                          {tour.badgeText || "Nearby"}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="flex-1 flex flex-col justify-between min-w-0 h-full py-0.5">
                        <div>
                          <div className="flex items-start justify-between gap-1">
                            <h4
                              className={`font-extrabold text-xs leading-snug line-clamp-1 ${
                                isSelected ? "text-[#003D5B]" : "text-slate-900"
                              }`}
                            >
                              {tour.title}
                            </h4>
                            <button
                              onClick={(e) => toggleSave(tour.id, e)}
                              className="text-slate-400 hover:text-red-500 p-0.5 shrink-0"
                            >
                              <Heart
                                className={`w-3.5 h-3.5 ${
                                  isSaved ? "fill-red-500 text-red-500" : "text-slate-400"
                                }`}
                              />
                            </button>
                          </div>

                          <p className="text-[10.5px] text-slate-500 font-medium truncate mt-0.5">
                            📍 {tour.location}
                          </p>

                          {/* Travel Time Pill */}
                          {isSelected && routeData ? (
                            <div className="flex items-center mt-1">
                              <span className="text-[9px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-200/80 whitespace-nowrap inline-flex items-center gap-1">
                                {travelMode === "walking" ? "🚶" : "🚗"} {formatTravelTime(routeData.durationMins)} ({routeData.distanceKm} km)
                              </span>
                            </div>
                          ) : (
                            <p className="text-[9.5px] text-slate-400 font-semibold mt-1">
                              ⏱️ {tour.duration} • {tour.distanceStr}
                            </p>
                          )}
                        </div>

                        {/* Bottom Action Row */}
                        <div className="flex items-center justify-between pt-1.5 border-t border-slate-100 mt-auto">
                          <div className="flex items-baseline gap-1 shrink-0 whitespace-nowrap leading-none">
                            <span className="font-black text-sm text-[#003D5B]">${tour.price}</span>
                            <span className="text-[9px] text-slate-400 font-medium">/person</span>
                          </div>
                          {tour.rating && (
                            <div className="flex items-center gap-1 text-[10.5px] font-bold text-slate-700 shrink-0">
                              <span className="text-amber-500 text-xs">⭐</span>
                              <span>{tour.rating}</span>
                              <span className="text-slate-400 font-normal text-[9.5px]">({tour.reviewsCount})</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* ======================================================================= */}
        {/* 2B. RIGHT SIDEBAR SECTION (DESKTOP TOURS EXPLORER)                      */}
        {/* ======================================================================= */}
        <aside className="hidden md:flex w-full md:w-[410px] lg:w-[440px] xl:w-[470px] h-full bg-white border-l border-slate-200/80 flex-col shrink-0 z-20 shadow-md">
          {/* Sidebar Header: Count + Sort By */}
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0">
            <h2 className="text-lg font-black text-slate-900 tracking-tight">
              {filteredTours.length} Tours available
            </h2>

            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-slate-400 font-medium">Sort by</span>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1 pr-6 font-bold text-slate-700 outline-none cursor-pointer text-xs transition-colors"
                >
                  <option value="recommended">Recommended</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Scrollable Tour Cards List */}
          <div className="flex-1 overflow-y-auto px-5 py-3 space-y-3">
            {filteredTours.map((tour) => {
              const isSelected = selectedTour?.id === tour.id;
              const isSaved = savedTourIds.has(tour.id);

              return (
                <div
                  key={tour.id}
                  onClick={() => handleSelectTour(tour)}
                  className={`bg-white rounded-2xl border p-3 flex gap-3.5 cursor-pointer transition-all duration-200 relative group ${
                    isSelected
                      ? "border-[#003D5B] ring-2 ring-[#003D5B]/20 bg-[#003D5B]/[0.02] shadow-md"
                      : "border-slate-200/80 hover:border-slate-300 hover:shadow-sm"
                  }`}
                >
                  {/* Left Thumbnail Image */}
                  <div className="relative w-24 h-24 sm:w-28 sm:h-24 rounded-xl overflow-hidden shrink-0 shadow-xs">
                    <img
                      src={tour.image}
                      alt={tour.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Right Tour Content */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h3
                          className={`font-bold text-xs sm:text-sm leading-snug line-clamp-2 ${
                            isSelected ? "text-[#003D5B] font-extrabold" : "text-slate-900"
                          }`}
                        >
                          {tour.title}
                        </h3>

                        <div className="text-right shrink-0">
                          <span className="text-sm sm:text-base font-black text-slate-900 leading-none">
                            ${tour.price}
                          </span>
                          <span className="text-[10px] text-slate-400 block font-normal leading-tight">
                            per person
                          </span>
                        </div>
                      </div>

                      {/* Date / Time & Duration Row */}
                      <div className="flex items-center gap-3 text-slate-500 text-[11px] font-medium mt-1.5">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
                          {tour.timeText}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                          {tour.duration}
                        </span>
                      </div>
                    </div>

                    {/* Bottom Row: Badge & Heart Button */}
                    <div className="flex items-center justify-between mt-2 pt-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white shadow-xs ${
                            tour.badgeColor || "bg-red-500"
                          }`}
                        >
                          {tour.badgeText}
                        </span>

                        {isSelected && routeData && (
                          <span className="text-emerald-800 font-bold bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full text-[10px]">
                            {travelMode === "walking" ? "🚶" : "🚗"} {formatTravelTime(routeData.durationMins)}
                          </span>
                        )}
                      </div>

                      <button
                        onClick={(e) => toggleSave(tour.id, e)}
                        className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-slate-100 transition-colors text-slate-400 hover:text-red-500"
                        aria-label="Favorite tour"
                      >
                        <Heart
                          className={`w-4 h-4 transition-transform active:scale-125 ${
                            isSaved
                              ? "fill-red-500 text-red-500"
                              : "text-slate-400 hover:text-red-400"
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredTours.length === 0 && (
              <div className="py-12 text-center text-slate-400">
                <Compass className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                <p className="text-sm font-semibold">No tours found matching your search.</p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setCategoryFilter("all");
                    setMaxPriceFilter(150);
                  }}
                  className="mt-3 text-xs font-bold text-[#003D5B] underline"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>

          {/* Bottom Pinned Banner: Can't find what you want? */}
          <div className="p-4 bg-slate-50 border-t border-slate-200/80 flex items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-slate-200/80 flex items-center justify-center text-slate-600 shrink-0">
                <Info className="w-4 h-4 stroke-[2.2]" />
              </div>
              <div>
                <h4 className="font-extrabold text-xs text-slate-900 leading-tight">
                  Can't find what you want?
                </h4>
                <p className="text-[11px] text-slate-500 font-medium leading-tight mt-0.5">
                  Create a custom tour for your group.
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate("/user/discover")}
              className="bg-[#003D5B] hover:bg-[#002b40] text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-xs shrink-0"
            >
              Create Tour
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
