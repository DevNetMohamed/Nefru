import styles from "./ToursNearYou.module.css";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";

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

const getImgSrc = (img, fallback) => {
  if (!img) return fallback;
  if (typeof img === "string" && (img.startsWith("http://") || img.startsWith("https://") || img.startsWith("data:"))) {
    return img;
  }
  return `http://localhost:5000/uploads/${img}`;
};

const getRealCairoCoordinates = (title = "") => {
  const t = title.toLowerCase();
  if (t.includes("pyramid") || t.includes("sphinx") || t.includes("giza")) return [29.9792, 31.1342];
  if (t.includes("grand") && t.includes("museum")) return [29.9948, 31.1206];
  if (t.includes("museum")) return [30.0478, 31.2336]; // Tahrir Museum
  if (t.includes("old cairo") || t.includes("hanging")) return [30.0058, 31.2300];
  if (t.includes("khan") || t.includes("bazaar")) return [30.0477, 31.2623];
  if (t.includes("citadel") || t.includes("saladin")) return [30.0299, 31.2611];
  if (t.includes("tower")) return [30.0459, 31.2243];
  
  // Fallback to random coordinate in central Cairo area
  const lat = 30.01 + (Math.random() * 0.04);
  const lng = 31.20 + (Math.random() * 0.06);
  return [lat, lng];
};

function ToursNearYou({ tours }) {
  const displayPlaces = tours && tours.length > 0
    ? tours.map((t, idx) => ({
        id: t._id || idx,
        title: t.title,
        distance: t.location ? `📍 ${t.location}` : "12 km away",
        rating: t.rating ? `${t.rating} (${t.reviewsCount || 0})` : "4.8 (127)",
        image: getImgSrc(t.image, [oldCairo, museum, pyramids][idx % 3]),
        description: t.description || "Ancient treasures and guided exploration.",
        position: t.coordinates || getRealCairoCoordinates(t.title),
      }))
    : defaultPlaces;

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

          <button>
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

              <button>
                View Trip
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ToursNearYou;
