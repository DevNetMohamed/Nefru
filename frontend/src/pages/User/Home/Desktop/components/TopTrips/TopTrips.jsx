import styles from "./TopTrips.module.css";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <div>
          <h2>Popular Tours</h2>
          <p>
            Hand-picked experiences loved by travelers.
          </p>
        </div>

        <button onClick={() => navigate("/user/trips")}>View All Tours</button>
      </div>

      <div className={styles.grid}>
        {tours.map((trip) => (
          <TourCard
            key={trip.id}
            id={trip.id}
            image={trip.image}
            location={trip.location}
            nights={trip.nights}
            title={trip.title}
            price={trip.price}
          />
        ))}
      </div>
    </section>
  );
};

export default TopTrips;
