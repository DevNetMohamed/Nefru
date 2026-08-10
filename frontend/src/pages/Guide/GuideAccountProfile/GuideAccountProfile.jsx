import {
  BadgeCheck,
  CalendarDays,
  Globe2,
  Headphones,
  Languages,
  LogOut,
  Mail,
  MapPin,
  Phone,
  Star,
  UserRound,
} from "lucide-react";
import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import fallbackAvatar from "../../../assets/images/guiders/guide1.webp";
import { logout } from "../../../store/slices/authSlice";
import styles from "./GuideAccountProfile.module.css";

function getInitials(fullName = "Trip Guide") {
  return fullName
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatLanguages(languages) {
  if (!Array.isArray(languages) || languages.length === 0) {
    return "Arabic, English";
  }

  return languages
    .map((language) =>
      typeof language === "string"
        ? language
        : language?.name || language?.language,
    )
    .filter(Boolean)
    .join(", ");
}

export default function GuideAccountProfile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, profile } = useSelector((state) => state.auth);

  const guideData = useMemo(
    () => ({
      fullName: user?.fullName || "Ahmed Farouk",
      email: user?.email || "ahmed.farouk@nefru.com",
      avatar: user?.avatar || profile?.profileImage || fallbackAvatar,
      phone: profile?.phoneNumber || "+20 100 123 4567",
      location: profile?.location || profile?.city || "Cairo, Egypt",
      languages: formatLanguages(profile?.languages),
      experience: profile?.yearsExperience
        ? `${profile.yearsExperience}+ years`
        : "10+ years",
      rating: profile?.rating || 4.8,
      reviewsCount: profile?.reviewsCount || 124,
      verificationStatus: user?.verificationStatus || "approved",
      memberSince: profile?.guideSince || "January 2016",
    }),
    [profile, user],
  );

  const initials = useMemo(
    () => getInitials(guideData.fullName),
    [guideData.fullName],
  );

  const handleLogout = () => {
    dispatch(logout());
    navigate("/auth/login", { replace: true });
  };

  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <div>
          <h1>Profile</h1>
          <p>View your guide information and account details.</p>
        </div>
      </header>

      <section className={styles.profileCard}>
        {guideData.avatar ? (
          <img src={guideData.avatar} alt={guideData.fullName} />
        ) : (
          <div className={styles.avatarFallback}>{initials}</div>
        )}

        <div className={styles.profileIdentity}>
          <h2>{guideData.fullName}</h2>
          <p>{guideData.email}</p>

          <div className={styles.badgesRow}>
            <span className={styles.roleBadge}>
              <UserRound size={14} /> Trip Guide
            </span>

            {guideData.verificationStatus === "approved" && (
              <span className={styles.verifiedBadge}>
                <BadgeCheck size={14} /> Verified
              </span>
            )}
          </div>

          <div className={styles.ratingRow}>
            <Star size={17} fill="currentColor" />
            <strong>{guideData.rating} / 5</strong>
            <span>{guideData.reviewsCount} reviews</span>
          </div>
        </div>
      </section>

      <div className={styles.desktopGrid}>
        <section className={styles.infoCard}>
          <div className={styles.cardTitle}>
            <UserRound size={20} />
            <h2>Guide Information</h2>
          </div>

          <div className={styles.fieldsGrid}>
            <div className={styles.fieldBox}>
              <span>Full Name</span>
              <strong>{guideData.fullName}</strong>
            </div>

            <div className={styles.fieldBox}>
              <span>Based In</span>
              <strong>{guideData.location}</strong>
            </div>

            <div className={styles.fieldBox}>
              <span>Experience</span>
              <strong>{guideData.experience}</strong>
            </div>

            <div className={styles.fieldBox}>
              <span>Languages</span>
              <strong>{guideData.languages}</strong>
            </div>
          </div>
        </section>

        <section className={styles.infoCard}>
          <div className={styles.cardTitle}>
            <Phone size={20} />
            <h2>Contact Information</h2>
          </div>

          <div className={styles.contactList}>
            <div>
              <Mail size={18} />
              <span>
                <small>Email</small>
                <strong>{guideData.email}</strong>
              </span>
            </div>

            <div>
              <Phone size={18} />
              <span>
                <small>Phone Number</small>
                <strong>{guideData.phone}</strong>
              </span>
            </div>

            <div>
              <MapPin size={18} />
              <span>
                <small>Location</small>
                <strong>{guideData.location}</strong>
              </span>
            </div>
          </div>
        </section>

        <section className={styles.infoCard}>
          <div className={styles.cardTitle}>
            <BadgeCheck size={20} />
            <h2>Account Summary</h2>
          </div>

          <div className={styles.summaryList}>
            <div>
              <CalendarDays size={18} />
              <span>Guide Since</span>
              <strong>{guideData.memberSince}</strong>
            </div>

            <div>
              <Globe2 size={18} />
              <span>Languages</span>
              <strong>{guideData.languages}</strong>
            </div>

            <div>
              <BadgeCheck size={18} />
              <span>Verification</span>
              <strong className={styles.status}>Approved</strong>
            </div>
          </div>
        </section>
      </div>

      <div className={styles.mobileSections}>
        <section className={styles.mobileGroup}>
          <h3>Guide Information</h3>

          <div className={styles.mobileItem}>
            <span className={styles.iconBlue}>
              <MapPin size={19} />
            </span>
            <span>
              <strong>Based In</strong>
              <small>{guideData.location}</small>
            </span>
          </div>

          <div className={styles.mobileItem}>
            <span className={styles.iconGold}>
              <CalendarDays size={19} />
            </span>
            <span>
              <strong>Experience</strong>
              <small>{guideData.experience}</small>
            </span>
          </div>

          <div className={styles.mobileItem}>
            <span className={styles.iconBlue}>
              <Languages size={19} />
            </span>
            <span>
              <strong>Languages</strong>
              <small>{guideData.languages}</small>
            </span>
          </div>
        </section>

        <section className={styles.mobileGroup}>
          <h3>Contact Information</h3>

          <div className={styles.mobileItem}>
            <span className={styles.iconBlue}>
              <Mail size={19} />
            </span>
            <span>
              <strong>Email</strong>
              <small>{guideData.email}</small>
            </span>
          </div>

          <div className={styles.mobileItem}>
            <span className={styles.iconGreen}>
              <Phone size={19} />
            </span>
            <span>
              <strong>Phone Number</strong>
              <small>{guideData.phone}</small>
            </span>
          </div>
        </section>

        <section className={styles.mobileGroup}>
          <h3>Support</h3>

          <button type="button" className={styles.mobileItem}>
            <span className={styles.iconBlue}>
              <Headphones size={19} />
            </span>
            <span>
              <strong>Help &amp; Support</strong>
              <small>FAQs and contact support</small>
            </span>
          </button>
        </section>
      </div>

      <button type="button" className={styles.logoutButton} onClick={handleLogout}>
        <LogOut size={19} />
        Log Out
      </button>
    </div>
  );
}
