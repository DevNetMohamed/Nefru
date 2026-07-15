import { useEffect, useState } from "react";
import styles from "./HeroSearch.module.css";

import cairo from "../../../../../assets/images/hero/cairo.jpg";
import luxor from "../../../../../assets/images/hero/luxor.jpeg";
import aswan from "../../../../../assets/images/hero/aswan.jpeg";
import alexandria from "../../../../../assets/images/hero/alexandria.jpg";

const images = [
  cairo,
  luxor,
  aswan,
  alexandria,
];

function HeroSearch() {
  const [currentImage, setCurrentImage] =
    useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) =>
        prev === images.length - 1 ? 0 : prev + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className={styles.hero}>
      <div className={styles.left}>
        <span className={styles.greeting}>
          Good Morning, Traveler ☀️
        </span>

        <h1>
          Where do you want to
          <br />
          explore today?
        </h1>

        <div className={styles.searchBar}>
          <input
            type="text"
            placeholder="Search tours, places, or guides..."
          />

          <button>
            Find Available Tours
          </button>
        </div>

        <div className={styles.destinations}>
          <span>Popular destinations</span>

          <button>Giza Pyramids</button>
          <button>Old Cairo</button>
          <button>Alexandria</button>
          <button>Khan El-Khalili</button>
          <button>Food Tours</button>
        </div>
      </div>

      <div className={styles.right}>
        <img
          src={images[currentImage]}
          alt="Egypt Destination"
        />
      </div>
    </section>
  );
}

export default HeroSearch;