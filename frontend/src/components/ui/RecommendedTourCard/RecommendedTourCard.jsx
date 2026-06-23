import styles from "./RecommendedTours.module.css";
import { Heart, MapPin, Clock, Star } from "lucide-react";

function RecommendedTourCard({
  image,
  badge,
  title,
  location,
  duration,
  rating,
  guide,
  price,
}) {
  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <img src={image} alt={title} />

        <span className={styles.badge}>
          {badge}
        </span>

        <button className={styles.favoriteBtn}>
          <Heart size={16} />
        </button>
      </div>

      <div className={styles.cardContent}>
        <h3>{title}</h3>

        <div className={styles.meta}>
          <span>
            <MapPin size={14} />
            {location}
          </span>

          <span>
            <Clock size={14} />
            {duration}
          </span>
        </div>

        <div className={styles.rating}>
          <Star size={14} />
          {rating}
        </div>

        <p className={styles.guide}>
          {guide}
        </p>

        <div className={styles.footer}>
          <span>
            From <strong>${price}</strong>
          </span>

          <button>
            View Tour
          </button>
        </div>
      </div>
    </div>
  );
}

export default RecommendedTourCard;