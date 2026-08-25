import styles from "./TourCard.module.css";
import { Heart, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSavedTrips } from "../../../context/useSavedTrips";

const TourCard = ({
  image,
  location,
  nights,
  title,
  price,
  id,
}) => {
  const navigate = useNavigate();
  const { savedIds, toggleSaved } = useSavedTrips();
  const canOpen = /^[a-f0-9]{24}$/i.test(String(id || ""));
  const saved = savedIds.has(String(id));
  return (
    <article className={styles.card} onClick={() => canOpen && navigate(`/user/trips/info/${id}`)}>
      <div className={styles.imageWrapper}>
        <img src={image} alt={title} />

        <button className={styles.favoriteBtn} disabled={!canOpen} onClick={(event) => { event.stopPropagation(); if (canOpen) toggleSaved(id); }}>
          <Heart size={18} fill={saved ? "currentColor" : "none"} />
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
