import styles from "./AvailableToday.module.css";
import { useNavigate } from "react-router-dom";

import pyramids from "../../../../../../assets/images/explore/pyramids.jpg";
import museum from "../../../../../../assets/images/explore/the_grand_museum.webp";
import oldCairo from "../../../../../../assets/images/explore/old-cairo.jpg";

const defaultTours = [
  {
    id: 1,
    image: pyramids,
    title: "Giza Sunset Experience",
    location: "Giza",
    time: "09:00 AM - 01:00 PM",
    price: "$65",
  },
  {
    id: 2,
    image: museum,
    title: "Museum Highlights Tour",
    location: "Cairo",
    time: "02:00 PM - 05:00 PM",
    price: "$40",
  },
  {
    id: 3,
    image: oldCairo,
    title: "Old Cairo Walking Tour",
    location: "Old Cairo",
    time: "04:00 PM - 08:00 PM",
    price: "$35",
  },
  {
    id: 4,
    image: pyramids,
    title: "Old Cairo Walking Tour",
    location: "Old Cairo",
    time: "04:00 PM - 08:00 PM",
    price: "$35",
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

        {/* Bug #7 fixed: View All button now navigates */}
        <button onClick={() => navigate("/user/discover")}>View All</button>
      </div>

      <div className={styles.cards}>
        {displayTours.map((tour) => (
          <div
            key={tour.id}
            className={styles.card}
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

              {/* Bug #7 fixed: Book Now navigates to discover */}
              <button onClick={() => navigate("/user/discover")}>
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
