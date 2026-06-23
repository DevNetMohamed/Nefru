import styles from "./TourCard.module.css";
import { Heart, ArrowRight } from "lucide-react";

const TourCard = ({
  image,
  location,
  nights,
  title,
  price,
}) => {
  return (
    <article className={styles.card}>
      <div className={styles.imageWrapper}>
        <img src={image} alt={title} />

        <button className={styles.favoriteBtn}>
          <Heart size={18} />
        </button>
      </div>

      <div className={styles.content}>
        <span className={styles.meta}>
          {location} • {nights}
        </span>

        <h3>{title}</h3>

        <div className={styles.footer}>
          <span className={styles.price}>
            From ${price}
          </span>

          <ArrowRight size={20} />
        </div>
      </div>
    </article>
  );
};

export default TourCard;