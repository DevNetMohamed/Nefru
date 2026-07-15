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

const places = [
  {
    id: 1,
    title: "Old Cairo",
    distance: "12 km away",
    rating: "4.8 (127)",
    image: oldCairo,
    description:
      "Historic streets, mosques and architecture.",
  },
  {
    id: 2,
    title: "Egyptian Museum",
    distance: "24 km away",
    rating: "4.7 (312)",
    image: museum,
    description:
      "Ancient treasures and world-famous artifacts.",
  },
];



const nearbyTours = [
  {
    name: "Giza Pyramids",
    lat: 29.9792,
    lng: 31.1342,
  },
  {
    name: "Egyptian Museum",
    lat: 30.0478,
    lng: 31.2336,
  },
  {
    name: "Khan El Khalili",
    lat: 30.0477,
    lng: 31.2620,
  },
];

function ToursNearYou() {
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

            <Marker position={[30.0444, 31.2357]}>
                <Popup>Cairo</Popup>
            </Marker>

            <Marker position={[29.9792, 31.1342]}>
                <Popup>Giza Pyramids</Popup>
            </Marker>
            </MapContainer>

          <button>
            Open Interactive Map
          </button>
        </div>

        <div className={styles.places}>
          {places.map((place) => (
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
                  📍 {place.distance}
                </span>

                <p>
                  {place.description}
                </p>

                <div className={styles.rating}>
                  ⭐ {place.rating}
                </div>
              </div>

              <button>
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