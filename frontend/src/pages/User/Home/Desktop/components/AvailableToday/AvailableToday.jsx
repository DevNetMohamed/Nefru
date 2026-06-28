import styles from "./AvailableToday.module.css";

import pyramids from "../../../../../../assets/images/explore/pyramids.jpg";
import museum from "../../../../../../assets/images/explore/the_grand_museum.webp";
import oldCairo from "../../../../../../assets/images/explore/old-cairo.jpg";

const tours = [
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

function AvailableToday() {
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <div>
          <h2>Tours Available Today</h2>
          <p>
            Last-minute experiences ready for booking.
          </p>
        </div>

        <button>View All</button>
      </div>

      <div className={styles.cards}>
        {tours.map((tour) => (
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

              <button>
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