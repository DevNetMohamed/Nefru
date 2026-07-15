import styles from "./ExploreEgypt.module.css";

import pyramids from "../../../../../../assets/images/explore/pyramids.jpg";
// import pyramids from "../../../../assets/images/explore/pyramids.jpg";
import museum from "../../../../../../assets/images/explore/khan-el-khalili.jpg";
import oldCairo from "../../../../../../assets/images/explore/old-cairo.jpg";

const categories = [
  {
    title: "Historical Sites",
    subtitle: "32 Places",
    image: pyramids,
  },
  {
    title: "Food Experiences",
    subtitle: "18 Activities",
    image: oldCairo,
  },
  {
    title: "Museums",
    subtitle: "14 Museums",
    image: museum,
  },
  {
    title: "Hidden Gems",
    subtitle: "21 Destinations",
    image: oldCairo,
  },
];

const ExploreEgypt = () => {
  return (
    <section id="explore-egypt" className={styles.section}>
      <div className={styles.header}>
        <h2>Explore Egypt</h2>

        <p>
          Discover culture, history and unforgettable
          experiences across Egypt.
        </p>
      </div>

      <div className={styles.grid}>
        {categories.map((item) => (
          <div
            key={item.title}
            className={styles.card}
          >
            <img
              src={item.image}
              alt={item.title}
            />

            <div className={styles.overlay}>
              <span>{item.subtitle}</span>

              <h3>{item.title}</h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ExploreEgypt;