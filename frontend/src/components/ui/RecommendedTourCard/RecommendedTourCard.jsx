import styles from "./RecommendedTours.module.css";
import { Heart, MapPin, Clock, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSavedTrips } from "../../../context/useSavedTrips";

// Bug #4 fixed: handle Vite bundled asset paths that start with "/"
const getImgSrc = (img) => {
  if (!img) return "";
  if (
    typeof img === "string" &&
    (img.startsWith("http://") ||
      img.startsWith("https://") ||
      img.startsWith("data:") ||
      img.startsWith("/"))
  ) {
    return img;
  }
  if (typeof img !== "string") return img;
  return `http://localhost:5000/uploads/${img}`;
};

function RecommendedTourCard({
  _id,
  image,
  badge,
  title,
  location,
  duration,
  rating,
  reviewsCount,
  guide,
  price,
  category,
}) {
  const navigate = useNavigate();
  const { savedIds, toggleSaved } = useSavedTrips();
  const isSaved = savedIds.has(String(_id));
  const canSave = /^[a-f0-9]{24}$/i.test(String(_id || ""));

  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <img src={getImgSrc(image)} alt={title} />

        <span className={styles.badge}>
          {category || badge || "Featured"}
        </span>

        <button
          className={styles.favoriteBtn}
          onClick={async (e) => {
            e.stopPropagation();
            if (canSave) await toggleSaved(_id);
          }}
          aria-label="Save trip"
          disabled={!canSave}
        >
          <Heart
            size={16}
            fill={isSaved ? "#ef4444" : "none"}
            color={isSaved ? "#ef4444" : "#4b5563"}
          />
        </button>
      </div>

      <div className={styles.cardContent}>
        <h3>{title}</h3>

        <div className={styles.meta}>
          {location && (
            <span>
              <MapPin size={14} />
              {location}
            </span>
          )}

          {duration && (
            <span>
              <Clock size={14} />
              {duration}
            </span>
          )}
        </div>

        <div className={styles.rating}>
          <Star size={14} fill="#f59e0b" color="#f59e0b" />
          <span>
            {rating || "4.8"}{" "}
            {reviewsCount ? `(${reviewsCount})` : ""}
          </span>
        </div>

        <p className={styles.guide}>
          Guide:{" "}
          {typeof guide === "object"
            ? guide?.name || "Local Expert"
            : guide || "Local Expert"}
        </p>

        <div className={styles.footer}>
          <span>
            From <strong>${price || 45}</strong>
          </span>

          <button onClick={() => navigate(canSave ? `/user/trips/${_id}` : "/user/discover")}>
            View Trip
          </button>
        </div>
      </div>
    </div>
  );
}

export default RecommendedTourCard;
