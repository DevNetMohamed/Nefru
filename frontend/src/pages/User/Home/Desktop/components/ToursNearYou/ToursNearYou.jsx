import styles from "./ToursNearYou.module.css";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";
import L from "leaflet";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

import pyramids from "../../../../../../assets/images/explore/pyramids.jpg";
import museum from "../../../../../../assets/images/explore/the_grand_museum.webp";
import oldCairo from "../../../../../../assets/images/explore/old-cairo.jpg";

// Custom Leaflet marker pin icon
const createMapPinIcon = (color = "#003D5B") => {
  return L.divIcon({
    className: "custom-map-pin",
    html: `
      <div style="
        background-color: ${color};
        width: 30px;
        height: 30px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 3px 10px rgba(0,0,0,0.3);
        border: 2px solid white;
        cursor: pointer;
      ">
        <div style="transform: rotate(45deg); color: white; display: flex; align-items: center; justify-content: center;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
        </div>
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
  });
};

const defaultPlaces = [
  {
    id: 1,
    title: "Old Cairo",
    distance: "12 km away",
    rating: "4.8 (127)",
    image: oldCairo,
    description:
      "Historic streets, mosques and architecture.",
    position: [30.0444, 31.2357],
  },
  {
    id: 2,
    title: "Egyptian Museum",
    distance: "24 km away",
    rating: "4.7 (312)",
    image: museum,
    description:
      "Ancient treasures and world-famous artifacts.",
    position: [30.0454, 31.2336],
  },
];

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

const FALLBACK_COORDS = [
  [30.0444, 31.2357],
  [29.9792, 31.1342],
  [30.0478, 31.2336],
  [30.0058, 31.2300],
];

const getRealCairoCoordinates = (title = "", idx = 0) => {
  const t = title.toLowerCase();
  if (t.includes("pyramid") || t.includes("sphinx") || t.includes("giza")) return [29.9792, 31.1342];
  if (t.includes("grand") && t.includes("museum")) return [29.9948, 31.1206];
  if (t.includes("museum")) return [30.0478, 31.2336];
  if (t.includes("old cairo") || t.includes("hanging")) return [30.0058, 31.2300];
  if (t.includes("khan") || t.includes("bazaar")) return [30.0477, 31.2623];
  if (t.includes("citadel") || t.includes("saladin")) return [30.0299, 31.2611];
  if (t.includes("tower")) return [30.0459, 31.2243];
  return FALLBACK_COORDS[idx % FALLBACK_COORDS.length];
};

const normalizeCoords = (coords, title, idx) => {
  if (Array.isArray(coords) && coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
    return coords;
  }
  if (coords && typeof coords === "object" && coords.lat && coords.lng) {
    return [coords.lat, coords.lng];
  }
  return getRealCairoCoordinates(title, idx);
};

function ToursNearYou({ tours }) {
  const navigate = useNavigate();
  const mapPinIcon = useMemo(() => createMapPinIcon("#003D5B"), []);

  const displayPlaces = useMemo(() => {
    if (tours && tours.length > 0) {
      return tours.map((t, idx) => ({
        id: t._id || idx,
        title: t.title,
        distance: t.location ? `📍 ${t.location}` : "12 km away",
        rating: t.rating ? `${t.rating} (${t.reviewsCount || 0})` : "4.8 (127)",
        image: getImgSrc(t.image, [oldCairo, museum, pyramids][idx % 3]),
        description: t.description || "Ancient treasures and guided exploration.",
        position: normalizeCoords(t.coordinates, t.title, idx),
      }));
    }
    return defaultPlaces;
  }, [tours]);

  return (
    <section className={styles.section} id="tours-near-you">
      <div className={styles.header}>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <h2>Tours Near You</h2>
            <p>
              Experiences close to your current location with live navigation and routing.
            </p>
          </div>
          <button
            onClick={() => navigate("/user/nearby")}
            className="self-start sm:self-auto px-4 py-2 bg-[#003D5B] hover:bg-[#002b40] text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <span>Explore Map View</span>
            <span>→</span>
          </button>
        </div>
      </div>

      <div className={styles.layout}>
        <div className={styles.mapCard}>
          <MapContainer
            center={[30.0444, 31.2357]}
            zoom={11}
            style={{
              height: "350px",
              width: "100%",
            }}
          >
            <TileLayer
              attribution='&copy; OpenStreetMap'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {displayPlaces.map((place) => (
              <Marker
                key={`marker-${place.id}`}
                position={place.position}
                icon={mapPinIcon}
              >
                <Popup>
                  <div>
                    <h4 style={{ margin: 0, fontWeight: 700 }}>{place.title}</h4>
                    <p style={{ margin: "5px 0 0 0", fontSize: "12px", color: "#555" }}>{place.distance}</p>
                    <button
                      onClick={() => navigate("/user/nearby")}
                      style={{
                        marginTop: "8px",
                        background: "#003D5B",
                        color: "white",
                        border: "none",
                        padding: "4px 8px",
                        borderRadius: "4px",
                        fontSize: "11px",
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      Open in Map →
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          <button onClick={() => navigate("/user/nearby")}>
            🗺️ Open Full Interactive Map Experience
          </button>
        </div>

        <div className={styles.places}>
          {displayPlaces.map((place) => (
            <div
              key={place.id}
              className={styles.placeCard}
              onClick={() => navigate("/user/nearby")}
              style={{ cursor: "pointer" }}
            >
              <img
                src={place.image}
                alt={place.title}
              />

              <div className={styles.info}>
                <h3>{place.title}</h3>

                <span>
                  {place.distance}
                </span>

                <p>
                  {place.description}
                </p>

                <div className={styles.rating}>
                  ⭐ {place.rating}
                </div>
              </div>

              <button onClick={(e) => {
                e.stopPropagation();
                navigate("/user/nearby");
              }}>
                View on Map
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ToursNearYou;

