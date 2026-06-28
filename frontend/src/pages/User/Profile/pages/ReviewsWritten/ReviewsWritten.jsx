import { useMemo, useState } from "react";
import { FiCalendar, FiFilter, FiStar } from "react-icons/fi";

import styles from "../ProfilePageShared.module.css";

// Replace this array with backend review data when reviews are ready.
const reviews = [];

const filters = [
  { key: "all", label: "All" },
  { key: "5", label: "5 Stars" },
  { key: "4", label: "4 Stars" },
  { key: "3", label: "3 Stars" },
];

function renderStars(rating = 0) {
  return Array.from({ length: 5 }).map((_, index) => (
    <FiStar
      key={index}
      className={index < rating ? styles.starFilled : styles.starMuted}
      aria-hidden="true"
    />
  ));
}

export default function ReviewsWritten() {
  const [activeFilter, setActiveFilter] = useState("all");

  const filteredReviews = useMemo(() => {
    if (activeFilter === "all") return reviews;
    return reviews.filter((review) => String(review.rating) === activeFilter);
  }, [activeFilter]);

  return (
    <div className={styles.pageContent}>
      <header className={styles.header}>
        <div>
          <h1>Reviews Written</h1>
          <p>See the reviews you shared after your tours.</p>
        </div>
      </header>

      <div className={styles.toolbar}>
        <div className={styles.tabs} aria-label="Review filters">
          {filters.map((filter) => (
            <button
              key={filter.key}
              type="button"
              className={`${styles.tabButton} ${activeFilter === filter.key ? styles.tabButtonActive : ""}`}
              onClick={() => setActiveFilter(filter.key)}
            >
              {filter.key !== "all" && <FiStar />}
              <span>{filter.label}</span>
            </button>
          ))}
        </div>

        <label className={styles.sortControl}>
          <FiFilter />
          <span>Sort by:</span>
          <select defaultValue="latest">
            <option value="latest">Latest Review</option>
            <option value="highest">Highest Rating</option>
            <option value="lowest">Lowest Rating</option>
          </select>
        </label>
      </div>

      <section className={styles.card}>
        {filteredReviews.length === 0 ? (
          <div className={styles.emptyState}>
            <FiStar />
            <h3>No reviews yet</h3>
            <p>Your reviews will appear here after you complete a booking and share feedback.</p>
          </div>
        ) : (
          <div className={styles.reviewList}>
            {filteredReviews.map((review) => (
              <article key={review.id} className={styles.reviewCard}>
                <div className={styles.reviewImageWrap}>
                  {review.image ? (
                    <img src={review.image} alt={review.tourTitle} />
                  ) : (
                    <div className={styles.bookingImageFallback}>Nefru</div>
                  )}
                </div>

                <div className={styles.reviewBody}>
                  <div className={styles.reviewTopRow}>
                    <h2>{review.tourTitle}</h2>
                    <span><FiCalendar /> {review.date}</span>
                  </div>
                  <p>Guide: <strong>{review.guide}</strong></p>
                  <div className={styles.starsRow}>{renderStars(review.rating)}</div>
                  <p className={styles.reviewText}>{review.comment}</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
