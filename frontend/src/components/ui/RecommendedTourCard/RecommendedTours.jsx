import styles from "./RecommendedTours.module.css";
import RecommendedTourCard from "./RecommendedTourCard";

import pyramids from "../../../assets/images/explore/pyramids.webp";
import oldCairo from "../../../assets/images/explore/old-cairo.jpg";
import museum from "../../../assets/images/explore/the_grand_museum.webp";

const tours = [
  {
    id: 1,
    image: oldCairo,
    badge: "Highly Rated",
    title: "Old Cairo Walking Tour",
    location: "Old Cairo",
    duration: "3.5 hrs",
    rating: "4.8 (263)",
    guide: "Ahmed Kamal",
    price: 45,
  },
  {
    id: 2,
    image: pyramids,
    badge: "Best Seller",
    title: "Giza Sunset Experience",
    location: "Giza Plateau",
    duration: "4 hrs",
    rating: "4.9 (582)",
    guide: "Sara Hassan",
    price: 65,
  },
  {
    id: 3,
    image: museum,
    badge: "Food Experience",
    title: "Khan El-Khalili Food Walk",
    location: "Khan El-Khalili",
    duration: "3 hrs",
    rating: "4.7 (189)",
    guide: "Mohamed Adel",
    price: 40,
  },
  {
    id: 4,
    image: oldCairo,
    badge: "Hidden Gems",
    title: "Islamic Cairo Hidden Gems",
    location: "Islamic Cairo",
    duration: "4 hrs",
    rating: "4.8 (215)",
    guide: "Nour Ramadan",
    price: 55,
  },
];

function RecommendedTours() {
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <div>
          <h2>
            Recommended for your trip
          </h2>

          <p>
            Hand-picked experiences based on
            traveler preferences.
          </p>
        </div>

        <button>
          View all tours
        </button>
      </div>

      <div className={styles.grid}>
        {tours.map((tour) => (
          <RecommendedTourCard
            key={tour.id}
            {...tour}
          />
        ))}
      </div>
    </section>
  );
}

export default RecommendedTours;