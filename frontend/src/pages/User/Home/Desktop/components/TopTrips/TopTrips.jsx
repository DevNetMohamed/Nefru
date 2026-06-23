import styles from "./TopTrips.module.css";
import TourCard from "../../../../../../components/ui/TourCard/TourCard";

import pyramids from "../../../../../../assets/images/explore/pyramids.jpg";
// import pyramids from "../../../../assets/images/explore/pyramids.jpg";
import museum from "../../../../../../assets/images/explore/khan-el-khalili.jpg";
import oldCairo from "../../../../../../assets/images/explore/old-cairo.jpg";


const tours = [
  {
    id: 1,
    image: pyramids,
    location: "Luxor",
    nights: "4 Nights",
    title: "The Artisan's Path",
    price: "2450",
  },
  {
    id: 2,
    image: museum,
    location: "Cairo",
    nights: "3 Nights",
    title: "Temple of the Sun",
    price: "1950",
  },
  {
    id: 3,
    image: oldCairo,
    location: "Aswan",
    nights: "5 Nights",
    title: "Old World Grandeur",
    price: "3250",
  },
  {
    id: 4,
    image: pyramids,
    location: "Giza",
    nights: "2 Nights",
    title: "Nubian Gold Retreat",
    price: "1750",
  },
];

const TopTrips = () => {
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <div>
          <h2>Popular Tours</h2>
          <p>
            Hand-picked experiences loved by travelers.
          </p>
        </div>

        <button>View All Tours</button>
      </div>

      <div className={styles.grid}>
        {tours.map((tour) => (
          <TourCard
            key={tour.id}
            image={tour.image}
            location={tour.location}
            nights={tour.nights}
            title={tour.title}
            price={tour.price}
          />
        ))}
      </div>
    </section>
  );
};

export default TopTrips;