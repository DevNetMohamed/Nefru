import styles from "./ToursNearYou.module.css";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

import pyramids from "../../../../../../assets/images/explore/pyramids.jpg";
import museum from "../../../../../../assets/images/explore/the_grand_museum.webp";
import oldCairo from "../../../../../../assets/images/explore/old-cairo.jpg";

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

// Bug #13 fixed: deterministic fallback coordinates — no more Math.random() in render
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
  // Bug #13 fixed: use deterministic fallback based on idx instead of Math.random()
  return FALLBACK_COORDS[idx % FALLBACK_COORDS.length];
};

function ToursNearYou({ tours }) {
  const navigate = useNavigate();

  // Bug #13 fixed: useMemo stabilizes computed places so Math.random() equivalent doesn't re-run on every render
  const displayPlaces = useMemo(() => {
    if (tours && tours.length > 0) {
      return tours.map((t, idx) => ({
        id: t._id || idx,
        title: t.title,
        distance: t.location ? `📍 ${t.location}` : "12 km away",
        rating: t.rating ? `${t.rating} (${t.reviewsCount || 0})` : "4.8 (127)",
        image: getImgSrc(t.image, [oldCairo, museum, pyramids][idx % 3]),
        description: t.description || "Ancient treasures and guided exploration.",
        position: t.coordinates || getRealCairoCoordinates(t.title, idx),
      }));
    }
    return defaultPlaces;
  }, [tours]);

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <div>
          <h2>Tours Near You</h2>

          <p>
            Experiences close to your location.
          </p>
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
              <Marker key={`marker-${place.id}`} position={place.position}>
                <Popup>
                  <div>
                    <h4 style={{ margin: 0 }}>{place.title}</h4>
                    <p style={{ margin: "5px 0 0 0", fontSize: "12px" }}>{place.distance}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          {/* Bug #7 fixed: Open Interactive Map button */}
          <button onClick={() => navigate("/user/discover")}>
            Open Interactive Map
          </button>
        </div>

        <div className={styles.places}>
          {displayPlaces.map((place) => (
            <div
              key={place.id}
              className={styles.placeCard}
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

              {/* Bug #7 fixed: View Tour button */}
              <button onClick={() => navigate("/user/discover")}>
                View Tour
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ToursNearYou;
