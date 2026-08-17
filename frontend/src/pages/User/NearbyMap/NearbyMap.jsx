import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { Search, ArrowLeft, Crosshair, Clock, MapPin, ChevronRight, Filter } from "lucide-react";
import axios from "axios";

import oldCairoImg from "@/assets/images/explore/old-cairo.jpg";
import museumImg from "@/assets/images/explore/the_grand_museum.webp";
import pyramidsImg from "@/assets/images/explore/pyramids.jpg";
import sphinxImg from "@/assets/images/explore/Sphinx.jpg";
import luxorImg from "@/assets/images/hero/luxor.jpeg";

// Helper for leafet custom SVG/HTML pins matching the reference design
const createPinIcon = (color = "#ef4444") => {
  return L.divIcon({
    className: "custom-leaflet-marker",
    html: `
      <div style="
        background-color: ${color};
        width: 32px;
        height: 32px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 12px rgba(0,0,0,0.25);
        border: 2.5px solid white;
        cursor: pointer;
      ">
        <div style="transform: rotate(45deg); color: white; display: flex; align-items: center; justify-content: center;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
            <circle cx="12" cy="13" r="3"/>
          </svg>
        </div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

const defaultNearbyTours = [
  {
    id: 1,
    title: "Old Cairo & Khan el-Khalili Food Walk",
    price: 30,
    timeText: "Tomorrow",
    duration: "3 Hours",
    badgeText: "Last Seat",
    badgeColor: "bg-red-600",
    position: [30.0477, 31.2623], // Khan El Khalili
    location: "Khan El-Khalili, Cairo",
    image: oldCairoImg,
    pinColor: "#ef4444",
  },
  {
    id: 2,
    title: "Pyramids, Giza",
    price: 110,
    timeText: "3 days left",
    duration: "2 Hours",
    badgeText: "4 seats left",
    badgeColor: "bg-[#0097a7]",
    position: [29.9792, 31.1342], // Pyramids
    location: "Giza Plateau",
    image: pyramidsImg,
    pinColor: "#ef4444",
  },
  {
    id: 3,
    title: "Grand Egyptian Museum Highlights",
    price: 45,
    timeText: "Today",
    duration: "4 Hours",
    badgeText: "Limited Slots",
    badgeColor: "bg-amber-500",
    position: [29.9948, 31.1206], // GEM
    location: "Giza",
    image: museumImg,
    pinColor: "#0284c7",
  },
  {
    id: 4,
    title: "Sphinx Sunset & Light Show",
    price: 55,
    timeText: "Tomorrow",
    duration: "2.5 Hours",
    badgeText: "Best Seller",
    badgeColor: "bg-purple-600",
    position: [29.9753, 31.1376], // Sphinx
    location: "Giza Plateau",
    image: sphinxImg,
    pinColor: "#9333ea",
  },
  {
    id: 5,
    title: "Old Cairo Historic Churches Walk",
    price: 30,
    timeText: "2 days left",
    duration: "3 Hours",
    badgeText: "Must Try",
    badgeColor: "bg-emerald-600",
    position: [30.0058, 31.2300], // Coptic Cairo
    location: "Coptic Cairo",
    image: oldCairoImg,
    pinColor: "#10b981",
  },
];

// Helper component to handle map re-centering
function MapRecenter({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, zoom || 12, { duration: 1.2 });
    }
  }, [center, zoom, map]);
  return null;
}

export default function NearbyMap() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTour, setSelectedTour] = useState(null);
  const [mapCenter, setMapCenter] = useState([30.015, 31.20]);
  const [toursList, setToursList] = useState(defaultNearbyTours);

  // Fetch real database trips if available
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
              timeText: idx % 2 === 0 ? "Tomorrow" : "3 days left",
              duration: t.duration ? `${t.duration}` : fallback.duration,
              badgeText: idx === 0 ? "Last Seat" : idx === 1 ? "4 seats left" : "Available",
              badgeColor: idx === 0 ? "bg-red-600" : idx === 1 ? "bg-[#0097a7]" : "bg-emerald-600",
              position: t.coordinates?.lat ? [t.coordinates.lat, t.coordinates.lng] : fallback.position,
              location: t.location || fallback.location,
              image: fallback.image,
              pinColor: fallback.pinColor,
            };
          });
          setToursList(apiTrips);
        }
      } catch (err) {
        console.log("Using default nearby tours preset:", err);
      }
    };
    fetchTrips();
  }, []);

  // Filter tours by search query
  const filteredTours = useMemo(() => {
    if (!searchQuery.trim()) return toursList;
    const q = searchQuery.toLowerCase();
    return toursList.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.location.toLowerCase().includes(q)
    );
  }, [searchQuery, toursList]);

  // Center map on user or default Cairo location
  const handleRecenter = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setMapCenter([pos.coords.latitude, pos.coords.longitude]);
        },
        () => {
          setMapCenter([30.015, 31.20]);
        }
      );
    } else {
      setMapCenter([30.015, 31.20]);
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-slate-100 font-sans">
      {/* 1. Floating Top Bar with Search & Controls */}
      <div className="absolute top-4 left-4 right-4 z-[1000] flex items-center gap-2">
        <button
          onClick={() => navigate("/user/home")}
          className="w-11 h-11 bg-white rounded-2xl flex items-center justify-center text-slate-700 shadow-lg border border-slate-100 hover:bg-slate-50 transition-colors shrink-0"
          aria-label="Back to Home"
        >
          <ArrowLeft className="w-5 h-5 stroke-[2.2]" />
        </button>

        <div className="flex-1 bg-white/95 backdrop-blur-md rounded-2xl shadow-lg border border-slate-100 px-3.5 py-2.5 flex items-center gap-2.5">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search locations..."
            className="w-full bg-transparent text-sm font-medium text-slate-800 placeholder-slate-400 outline-none"
          />
        </div>

        <button
          onClick={handleRecenter}
          className="w-11 h-11 bg-white rounded-2xl flex items-center justify-center text-[#003D5B] shadow-lg border border-slate-100 hover:bg-slate-50 transition-colors shrink-0"
          aria-label="My Location"
        >
          <Crosshair className="w-5 h-5 stroke-[2.2]" />
        </button>
      </div>

      {/* 2. Interactive Map Container */}
      <MapContainer
        center={mapCenter}
        zoom={11}
        zoomControl={false}
        className="w-full h-full z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapRecenter center={mapCenter} zoom={12} />

        {filteredTours.map((tour) => (
          <Marker
            key={tour.id}
            position={tour.position}
            icon={createPinIcon(tour.pinColor || "#ef4444")}
            eventHandlers={{
              click: () => {
                setSelectedTour(tour);
                setMapCenter(tour.position);
              },
            }}
          >
            <Popup className="custom-leaflet-popup">
              <div className="p-1 max-w-[180px]">
                <h4 className="font-bold text-slate-900 text-xs leading-tight mb-1">
                  {tour.title}
                </h4>
                <p className="text-[11px] text-slate-500 font-medium mb-1.5">
                  📍 {tour.location}
                </p>
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-xs text-[#003D5B]">
                    ${tour.price}
                  </span>
                  <button
                    onClick={() => navigate("/user/discover")}
                    className="text-[10px] font-bold text-[#003D5B] underline"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* 3. Bottom Sliding / Sheet Card Overlay */}
      <div className="absolute bottom-0 left-0 right-0 z-[999] bg-white rounded-t-3xl shadow-[0_-8px_30px_rgba(0,0,0,0.12)] border-t border-slate-100 max-h-[52vh] flex flex-col transition-all duration-300">
        {/* Sheet Handle */}
        <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto my-3 shrink-0" />

        {/* Sheet Title */}
        <div className="px-5 pb-3 border-b border-slate-100 flex items-center justify-between shrink-0">
          <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
            {filteredTours.length} Tours available
          </h2>
          <span className="text-xs font-semibold text-slate-400">
            Near Cairo & Giza
          </span>
        </div>

        {/* Scrollable List of Tours */}
        <div className="overflow-y-auto px-5 py-2 divide-y divide-slate-100/80">
          {filteredTours.map((tour) => {
            const isSelected = selectedTour?.id === tour.id;
            return (
              <div
                key={tour.id}
                onClick={() => {
                  setSelectedTour(tour);
                  setMapCenter(tour.position);
                }}
                className={`py-3.5 flex flex-col gap-2 cursor-pointer transition-colors ${
                  isSelected ? "bg-sky-50/60 -mx-5 px-5" : "hover:bg-slate-50/60"
                }`}
              >
                {/* Title & Price Row */}
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-bold text-slate-900 text-sm leading-snug flex-1">
                    {tour.title}
                  </h3>
                  <span className="font-extrabold text-slate-900 text-base shrink-0">
                    ${tour.price}
                  </span>
                </div>

                {/* Subtitle / Details & Badge Row */}
                <div className="flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-3 text-slate-500 font-medium text-[12px]">
                    <span>{tour.timeText}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400 stroke-[2]" />
                      {tour.duration}
                    </span>
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold text-white shadow-xs ${
                      tour.badgeColor || "bg-red-600"
                    }`}
                  >
                    {tour.badgeText}
                  </span>
                </div>
              </div>
            );
          })}

          {filteredTours.length === 0 && (
            <div className="py-8 text-center text-slate-400 text-sm font-medium">
              No tours found matching your search.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
