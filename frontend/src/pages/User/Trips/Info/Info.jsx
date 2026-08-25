import {
  FaArrowLeft,
  FaStar,
  FaLocationDot,
  FaClock,
  FaChevronRight,
} from "react-icons/fa6";
import { FiShare2, FiBookmark } from "react-icons/fi";
import styles from "./Info.module.css";
import { useEffect, useState, useCallback } from "react";

import { getTourById } from "../../api";
import { useNavigate, useParams } from "react-router-dom";
import { resolveMediaUrl } from "../../../../services/api";
import { useSavedTrips } from "../../../../context/useSavedTrips";

function Info() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { savedIds, toggleSaved } = useSavedTrips();
  const [tour, seTrip] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const loadTrip = useCallback(async () => {
    try {
      const data = await getTourById(id);
      if (!data.error) seTrip(data.data);
      else setError(data.error);
    } catch (err) {
      if (err.name === "AbortError") return;
      setError(err.message || "Failed to load tour");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    const timer = window.setTimeout(loadTrip, 0);
    return () => window.clearTimeout(timer);
  }, [loadTrip]);

  if (loading) return <div className={styles.page}><main className={styles.content}>Loading trip...</main></div>;
  if (error) return <div className={styles.page}><main className={styles.content}>{error}</main></div>;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button
          type="button"
          className={styles.iconButton}
          onClick={() => navigate(-1)}
        >
          <FaArrowLeft />
        </button>

        <h1 className={styles.headerTitle}>Tours</h1>

        <div className={styles.headerActions}>
          <button type="button" className={styles.iconButton}>
            <FiShare2 />
          </button>
          <button
            type="button"
            className={styles.iconButton}
            aria-label={savedIds.has(String(id)) ? "Remove from saved trips" : "Save trip"}
            onClick={() => toggleSaved(id)}
          >
            <FiBookmark fill={savedIds.has(String(id)) ? "currentColor" : "none"} />
          </button>
        </div>
      </header>

      <main className={styles.content}>
        <section className={styles.hero}>
          <img
            src={resolveMediaUrl(tour.image) || "/"}
            alt={tour.title || "Trip"}
            className={styles.heroImage}
          />
        </section>

        <section className={styles.bookingBar}>
          <div className={styles.priceBox}>
            <div className={styles.priceLine}>
              <span className={styles.price}>${tour.price }</span>
              <span className={styles.perPerson}>/ person</span>
            </div>

            <p className={styles.dateLine}>
              {tour.date} 
            </p>
          </div>

          <button
            type="button"
            className={styles.reserveButton}
            onClick={() => navigate(`/user/trips/${id}/book`)}
            disabled={tour.status !== "active"}
          >
            Book
          </button>
        </section>

        <section className={styles.tagsRow}>
          <span className={styles.mainTag}>NEFRU Original</span>
          <span className={styles.secondTag}>Guided Trip</span>
        </section>

        <section className={styles.titleSection}>
          <h2 className={styles.title}>
            {tour.title}
          </h2>

          <div className={styles.metaRow}>
            <div className={styles.metaItem}>
              <FaStar className={styles.starIcon} />
              <span className={styles.boldText}>{tour.rating}</span>
              <span className={styles.linkText}>
                {tour.reviewsCount}
              </span>
            </div>

            <div className={styles.metaItem}>
              <FaLocationDot className={styles.metaIcon} />
              <span className={styles.normalText}>
                {tour.location}
              </span>
            </div>

            <div className={styles.metaItem}>
              <FaClock className={styles.metaIcon} />
              <span className={styles.normalText}>
                {tour.duration}
              </span>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>About this experience</h3>
          <p className={styles.paragraph}>
            {tour.description }
          </p>

          <p className={styles.paragraph}>
            {tour.longDescription }
          </p>

          <button type="button" className={styles.readMore}>
            Read full description <FaChevronRight />
          </button>
        </section>

        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Experience Highlights</h3>
          <div className={styles.highlightsGrid}>
            {tour.highlights?.map((item, index) => (
              <div key={index} className={styles.highlightCard}>
                <div className={styles.highlightIcon}>{item.icon}</div>
                <div className={styles.highlightText}>
                  <strong>{item.title}</strong>
                  <span>{item.text}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Meet your Guide</h3>

          <div className={styles.guideCard}>
            <img
              src={resolveMediaUrl(tour.guide?.avatar)}
              alt={tour.guide?.name}
              className={styles.guideAvatar}
            />

            <div className={styles.guideBody}>
              <h4 className={styles.guideName}>{tour.guide?.name}</h4>

              <div className={styles.guideMeta}>
                <span className={styles.guideBadge}>{tour.guide?.badge}</span>
                <span className={styles.guideRate}>
                  <FaStar className={styles.starIcon} />
                  {tour.guide?.rating} ({tour.guide?.reviewsCount} reviews)
                </span>
              </div>
              <p className={styles.guideText}>{tour.guide?.about}</p>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.reviewsHeader}>
            <h3 className={styles.sectionTitle}>Guest Reviews</h3>
            <button type="button" className={styles.seeAll}>
              See all {tour.reviewsCount}
            </button>
          </div>

          <div className={styles.reviewsList}>
            {tour.reviews?.map((review,index) => (
              <div key={index} className={styles.reviewCard}>
                <div className={styles.reviewTop}>
                  <img
                    src={review.avatar}
                    alt={review.name}
                    className={styles.reviewAvatar}
                  />

                  <div>
                    <h4 className={styles.reviewName}>{review.name}</h4>
                    <p className={styles.reviewDate}>{review.date}</p>
                  </div>
                </div>

                <div className={styles.reviewStars}>
                  {Array.from({ length: review.rating}).map((_, i) => (
                    <FaStar key={i} />
                  ))}
                </div>

                <p className={styles.reviewText}>"{review.text}"</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Info;
