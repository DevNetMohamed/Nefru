import styles from "./TrustedGuides.module.css";

import guide1 from "../../../../../../assets/images/guiders/guide1.webp";
import guide2 from "../../../../../../assets/images/guiders/guide3.webp";
import guide3 from "../../../../../../assets/images/guiders/guide4.webp";
const guides = [
  {
    id: 1,
    name: "Ahmed Kamal",
    rating: "4.9",
    languages: "Arabic • English",
    experience: "8 Years Experience",
    image: guide1,
  },
  {
    id: 2,
    name: "Sara Hassan",
    rating: "4.8",
    languages: "English • French",
    experience: "6 Years Experience",
    image: guide2,
  },
  {
    id: 3,
    name: "Mohamed Adel",
    rating: "4.9",
    languages: "Arabic • German",
    experience: "10 Years Experience",
    image: guide3,
  },
  {
    id: 4,
    name: "Nour Ramadan",
    rating: "4.7",
    languages: "Arabic • English",
    experience: "5 Years Experience",
    image: guide1,
  },
];

function TrustedGuides() {
  return (
    <section
      id="top-guides"
      className={styles.section}
    >
      <div className={styles.header}>
        <div>
          <h2>Trusted Local Guides</h2>

          <p>
            Meet experienced guides ready to
            help you discover Egypt.
          </p>
        </div>

        <button>
          View All Guides
        </button>
      </div>

      <div className={styles.grid}>
        {guides.map((guide) => (
          <div
            key={guide.id}
            className={styles.card}
          >
            <img
              src={guide.image}
              alt={guide.name}
            />

            <h3>{guide.name}</h3>

            <div className={styles.rating}>
              ⭐ {guide.rating}
            </div>

            <p>{guide.languages}</p>

            <span>
              {guide.experience}
            </span>

            <button>
              View Profile
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

export default TrustedGuides;