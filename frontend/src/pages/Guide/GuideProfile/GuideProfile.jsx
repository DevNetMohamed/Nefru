import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaHeart,
  FaRegHeart,
  FaStar,
  FaClock,
  FaChevronRight,
  FaCircleCheck,
} from "react-icons/fa6";
import { FiShare2 } from "react-icons/fi";
import styles from "./GuideProfile.module.css";

export default function GuideProfile({
  guide,
  isFavorite = false,
  onBack,
  onShare,
  onToggleFavorite,
  onSeeAllGallery,
  onTourClick,
}) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) return onBack();
    navigate(-1);
  };

  const heroImage = guide?.heroImage || guide?.profileImage || "";
  const fullName = guide?.name || "Tour Guide";
  const subtitle =
    guide?.headline ||
    [guide?.title, guide?.location].filter(Boolean).join(" • ") ||
    "Certified guide";
  const rating = guide?.rating ?? 0;
  const reviewsCount = guide?.reviewsCount ?? 0;
  const yearsExperience = guide?.yearsExperience ?? 0;
  const languages = guide?.languages ?? [];
  const about = guide?.about || "No biography available yet.";
  const gallery = guide?.gallery ?? [];
  const tours = guide?.tours ?? [];

  return (
    <main className={styles.page}>
      <section
        className={styles.hero}
        style={{
          backgroundImage: heroImage ? `url(${heroImage})` : undefined,
        }}
      >
        <div className={styles.heroOverlay} />

        <div className={styles.topBar}>
          <button
            type="button"
            className={styles.iconButton}
            onClick={handleBack}
            aria-label="Go back"
          >
            <FaArrowLeft />
          </button>

          <div className={styles.topActions}>
            <button
              type="button"
              className={styles.iconButton}
              onClick={onShare}
              aria-label="Share profile"
            >
              <FiShare2 />
            </button>

            <button
              type="button"
              className={styles.iconButton}
              onClick={onToggleFavorite}
              aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              {isFavorite ? <FaHeart /> : <FaRegHeart />}
            </button>
          </div>
        </div>

        <div className={styles.heroContent}>
          <div className={styles.badgeRow}>
            {guide?.verified ? (
              <span className={styles.badge}>
                <FaCircleCheck />
                VERIFIED GUIDE
              </span>
            ) : null}
          </div>

          <h1 className={styles.name}>{fullName}</h1>
          <p className={`${styles.subtitle} fs-5`}>{subtitle}</p>
        </div>
      </section>

      <div className={styles.content}>
        <section className={styles.statsGrid} aria-label="Guide stats">
          <article className={styles.statCard}>
            <div className={styles.statValue}>
              <FaStar className={styles.starIcon} />
              <span>{rating.toFixed(1)}</span>
            </div>
            <p className={styles.statLabel}>{reviewsCount} REVIEWS</p>
          </article>

          <article className={styles.statCard}>
            <div className={styles.statValue}>
              <span>{yearsExperience}+</span>
            </div>
            <p className={styles.statLabel}>YEARS EXP.</p>
          </article>

          <article className={`${styles.statCard} ${styles.statCardFull}`}>
            <div className={styles.statValue}>
              <span>{languages.length}</span>
            </div>
            <p className={styles.statLabel}>LANGUAGES</p>
          </article>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>About Me</h2>
          <p className={styles.aboutText}>{about}</p>

          {languages.length ? (
            <div className={styles.chipRow}>
              {languages.map((language, index) => (
                <span key={`${language}-${index}`} className={styles.chip}>
                  {language}
                </span>
              ))}
            </div>
          ) : null}
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Tour Gallery</h2>
            <button
              type="button"
              className={styles.seeAll}
              onClick={onSeeAllGallery}
            >
              See All
            </button>
          </div>

          <div className={styles.galleryRow}>
            {gallery.map((item, index) => (
              <figure className={styles.galleryItem} key={item.id || item.src || index}>
                <img
                  src={item.src}
                  alt={item.alt || `Gallery item ${index + 1}`}
                  className={styles.galleryImage}
                  loading="lazy"
                />
              </figure>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Offered Tours</h2>

          <div className={styles.toursList}>
            {tours.map((tour) => (
              <article className={styles.tourCard} key={tour.id || tour.title}>
                <img
                  src={tour.image}
                  alt={tour.title}
                  className={styles.tourImage}
                  loading="lazy"
                />

                <div className={styles.tourBody}>
                  <div className={styles.tourInfo}>
                    <h3 className={styles.tourTitle}>{tour.title}</h3>

                    <div className={styles.tourMeta}>
                      <span className={styles.tourDuration}>
                        <FaClock />
                        {tour.duration}
                      </span>
                    </div>
                  </div>

                  <div className={styles.tourFooter}>
                    <span className={styles.tourPrice}>${tour.price}</span>

                    <button
                      type="button"
                      className={styles.detailsButton}
                      onClick={() => onTourClick?.(tour)}
                    >
                      Details <FaChevronRight />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}