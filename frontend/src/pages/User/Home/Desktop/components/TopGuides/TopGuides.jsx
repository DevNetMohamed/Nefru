import styles from "./TopGuides.module.css";

import guide1 from "../../../../../../assets/images/guiders/guide1.webp";
import guide2 from "../../../../../../assets/images/guiders/guide3.webp";
import guide3 from "../../../../../../assets/images/guiders/guide4.webp";
import guide4 from "../../../../../../assets/images/guiders/guide2.avif";


const guides = [
  {
    id: 1,
    name: "Ahmed Kamal",
    rating: 4.9,
    languages: "Arabic • English",
    experience: "8 Years",
    image: guide1,
  },
  {
    id: 2,
    name: "Sara Hassan",
    rating: 4.8,
    languages: "English • French",
    experience: "6 Years",
    image: guide2,
  },
  {
    id: 3,
    name: "Mohamed Adel",
    rating: 4.9,
    languages: "Arabic • German",
    experience: "10 Years",
    image: guide3,
  },
  {
    id: 4,
    name: "Nour Ramadan",
    rating: 4.7,
    languages: "Arabic • English",
    experience: "5 Years",
    image: guide4,
  },
];

const TopGuides = () => {
  return (
    <section id="top-guides" className={styles.section}>
      <div className={styles.header}>
        <h2>Meet Local Experts</h2>
        <p>
          Trusted licensed guides ready to help you
          discover Egypt.
        </p>
      </div>

      <div className={styles.grid}>
        {guides.map((guide) => (
          <div key={guide.id} className={styles.card}>
            <img src={guide.image} alt={guide.name} />

            <div className={styles.content}>
              <h3>{guide.name}</h3>

              <span className={styles.rating}>
                ⭐ {guide.rating}
              </span>

              <p>{guide.languages}</p>

              <span className={styles.exp}>
                {guide.experience} Experience
              </span>

              <button>View Profile</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TopGuides;