import styles from "./FeaturedExperiences.module.css";


import pyramids from "../../../../../../assets/images/explore/pyramids.jpg";
import oldCairo from "../../../../../../assets/images/explore/Sphinx.jpg";
import museum from "../../../../../../assets/images/explore/khan-el-khalili.jpg";

const featuredTours = [
  {
    id: 1,
    title: "Private Dahabiya Suite",
    description:
      "Luxury Nile experience with private guide.",
    image: pyramids,
    large: true,
  },
  {
    id: 2,
    title: "Sphinx Moonlit Gala",
    image: oldCairo,
  },
  {
    id: 3,
    title: "Private Temple Access",
    image: museum ,
  },
];

const FeaturedExperiences = () => {
  return (
    <section id="popular-tours" className={styles.section}>
      <div className={styles.header}>
        <div>
          <h2>Trending Tours</h2>
          <p>
            Discover Egypt's most popular experiences.
          </p>
        </div>

        <button>View All</button>
      </div>

      <div className={styles.grid}>
        <div className={styles.largeCard}>
          <img
            src={featuredTours[0].image}
            alt=""
          />

          <div className={styles.overlay}>
            <h3>{featuredTours[0].title}</h3>

            <p>
              {featuredTours[0].description}
            </p>
          </div>
        </div>

        <div className={styles.rightColumn}>
          {featuredTours.slice(1).map((tour) => (
            <div
              key={tour.id}
              className={styles.smallCard}
            >
              <img
                src={tour.image}
                alt=""
              />

              <div className={styles.overlay}>
                <h3>{tour.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedExperiences;