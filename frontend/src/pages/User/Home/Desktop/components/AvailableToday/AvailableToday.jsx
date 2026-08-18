import styles from "./AvailableToday.module.css";
import { useNavigate } from "react-router-dom";

import pyramids from "../../../../../../assets/images/explore/pyramids.jpg";
import museum from "../../../../../../assets/images/explore/the_grand_museum.webp";
import oldCairo from "../../../../../../assets/images/explore/old-cairo.jpg";

const defaultTours = [
  {
    id: 1,
    image: pyramids,
    title: "Pyramids Sunrise & Sphinx Experience",
    location: "Giza",
    time: "09:30 AM - 01:30 PM",
    price: "$45",
  },
  {
    id: 2,
    image: oldCairo,
    title: "Historic Cairo Walking Trip",
    location: "Cairo",
    time: "04:00 PM - 07:00 PM",
    price: "$35",
  },
  {
    id: 3,
    image: pyramids,
    title: "Nile Sunset Felucca",
    location: "Cairo",
    time: "05:00 PM - 07:00 PM",
    price: "$25",
  },
  {
    id: 4,
    image: oldCairo,
    title: "Cairo Street Food Evening",
    location: "Cairo",
    time: "06:00 PM - 09:00 PM",
    price: "$30",
  },
];

// Handle Vite bundled asset paths that start with "/"
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

function AvailableToday({ tours }) {
  const navigate = useNavigate();
  const displayTours = tours && tours.length > 0
    ? tours.map((t, idx) => ({
        id: t._id || idx,
        image: getImgSrc(t.image, [pyramids, museum, oldCairo][idx % 3]),
        title: t.title,
        location: t.location,
        time: t.duration || "Available Today",
        price: typeof t.price === "number" ? `$${t.price}` : t.price,
      }))
    : defaultTours;

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <div>
          <h2>Tours Available Today</h2>
          <p>
            Last-minute experiences ready for booking.
          </p>
        </div>

        <button onClick={() => navigate("/user/discover")}>View All</button>
      </div>

      <div className={styles.cards}>
        {displayTours.map((tour) => (
          <div
            key={tour.id}
            className={styles.card}
            onClick={() => navigate("/user/discover")}
          >
            <img
              src={tour.image}
              alt={tour.title}
            />

            <div className={styles.content}>
              <span className={styles.badge}>
                Available Today
              </span>

              <h3>{tour.title}</h3>

              <p>{tour.location}</p>

              <div className={styles.footer}>
                <span>{tour.time}</span>

                <strong>{tour.price}</strong>
              </div>

              <button onClick={(e) => {
                e.stopPropagation();
                navigate("/user/trips/book", { state: { tour, trip: tour } });
              }}>
                Book Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default AvailableToday;
