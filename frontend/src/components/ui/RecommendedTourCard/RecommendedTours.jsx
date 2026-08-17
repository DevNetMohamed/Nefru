import styles from "./RecommendedTours.module.css";
import RecommendedTourCard from "./RecommendedTourCard";
import { useNavigate } from "react-router-dom";

import pyramids from "../../../assets/images/explore/pyramids.jpg";
import oldCairo from "../../../assets/images/explore/old-cairo.jpg";
import museum from "../../../assets/images/explore/the_grand_museum.webp";
import sphinx from "../../../assets/images/explore/Sphinx.jpg";

const defaultTours = [
  {
    _id: "1",
    image: oldCairo,
    badge: "Highly Rated",
    category: "Historical",
    title: "Old Cairo & Khan El-Khalili Walk",
    location: "Old Cairo",
    duration: "3.5 hrs",
    rating: 4.8,
    reviewsCount: 263,
    guide: { name: "Ahmed Kamal" },
    price: 45,
  },
  {
    _id: "2",
    image: pyramids,
    badge: "Best Seller",
    category: "Pyramids",
    title: "Giza Pyramids & Sphinx Sunset",
    location: "Giza Plateau",
    duration: "4 hrs",
    rating: 4.9,
    reviewsCount: 582,
    guide: { name: "Sara Hassan" },
    price: 65,
  },
  {
    _id: "3",
    image: museum,
    badge: "Cultural",
    category: "Museums",
    title: "Grand Egyptian Museum Highlights",
    location: "Giza",
    duration: "4.5 hrs",
    rating: 4.9,
    reviewsCount: 410,
    guide: { name: "Mohamed Adel" },
    price: 50,
  },
  {
    _id: "4",
    image: sphinx,
    badge: "Hidden Gems",
    category: "Exploration",
    title: "Beyond the Sphinx & Secret Tombs",
    location: "Giza Plateau",
    duration: "4 hrs",
    rating: 4.7,
    reviewsCount: 195,
    guide: { name: "Nour Ramadan" },
    price: 55,
  },
];

function RecommendedTours({ trips }) {
  const navigate = useNavigate();
  const displayTrips = trips && trips.length > 0 ? trips : defaultTours;

  return (
    <section className={styles.section} id="popular-tours">
      <div className={styles.header}>
        <div>
          <h2>Recommended for your trip</h2>
          <p>
            Hand-picked experiences based on traveler preferences.
          </p>
        </div>

        <button onClick={() => navigate("/user/discover")}>
          View all tours
        </button>
      </div>

      <div className={styles.grid}>
        {displayTrips.map((trip, idx) => (
          <RecommendedTourCard key={trip._id || idx} {...trip} />
        ))}
      </div>
    </section>
  );
}

export default RecommendedTours;