import styles from "./DiscoverEgypt.module.css";

import pyramids from "../../../../../../assets/images/explore/pyramids.jpg";
import museum from "../../../../../../assets/images/explore/the_grand_museum.webp";
import oldCairo from "../../../../../../assets/images/explore/old-cairo.jpg";
import khan from "../../../../../../assets/images/explore/khan-el-khalili.jpg"

const categories = [
  {
    title: "Historical Sites",
    description:
      "Temples, pyramids & ancient wonders.",
    image: pyramids,
  },
  {
    title: "Food Experiences",
    description:
      "Local flavors & culinary adventures.",
    image: khan,
  },
  {
    title: "Museums",
    description:
      "Artifacts, exhibitions & culture.",
    image: museum,
  },
  {
    title: "Hidden Gems",
    description:
      "Off-the-beaten-path discoveries.",
    image: oldCairo,
  },
];

function DiscoverEgypt() {
  return (
    <section
      id="explore-egypt"
      className={styles.section}
    >
      <div className={styles.header}>
        <h2>Discover Egypt</h2>

        <p>
          Explore places before you book —
          history, tickets, opening hours and
          how to get there.
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
              <h3>{item.title}</h3>

              <p>{item.description}</p>

              <button>
                Explore Guide →
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default DiscoverEgypt;