import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  FiCalendar,
  FiCreditCard,
  FiHeadphones,
  FiLock,
  FiLogOut,
  FiStar,
} from "react-icons/fi";

import { logoutUser } from "../../../../../store/slices/authSlice";
import { resolveMediaUrl } from "../../../../../services/api";
import styles from "../../Mobile/MobileProfile.module.css";

function getInitials(fullName = "Traveler") {
  return fullName
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function MobileProfileOverview() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, profile } = useSelector((state) => state.auth);

  const fullName = profile?.fullName || "Not added yet";
  const email = user?.email || "Not added yet";
  const initials = useMemo(() => getInitials(fullName), [fullName]);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/auth/login", { replace: true });
  };

  return (
    <>
      <section className={styles.profileCard}>
        {profile?.avatar ? (
          <img src={resolveMediaUrl(profile.avatar)} alt={fullName} />
        ) : (
          <div className={styles.avatar}>{initials}</div>
        )}

        <h2>{fullName}</h2>
        <p>{email}</p>
        <span>{user?.role === "guide" ? "Guide" : "Traveler"}</span>
      </section>

      <section className={styles.menuSection}>
        <h3>Account Activities</h3>

        <Link to="/user/profile/bookings" className={styles.menuItem}>
          <FiCalendar />
          <span>
            <strong>My Bookings</strong>
            <small>Upcoming trips</small>
          </span>
          <b>›</b>
        </Link>

        <Link to="/user/profile/payments" className={styles.menuItem}>
          <FiCreditCard />
          <span>
            <strong>Payment Methods</strong>
            <small>Cards and payment options</small>
          </span>
          <b>›</b>
        </Link>

        <Link to="/user/profile/reviews" className={styles.menuItem}>
          <FiStar />
          <span>
            <strong>Reviews Written</strong>
            <small>Your trip feedback</small>
          </span>
          <b>›</b>
        </Link>

        <Link to="/user/profile/change-password" className={styles.menuItem}>
          <FiLock />
          <span>
            <strong>Sign-in &amp; Security</strong>
            <small>Password and connected Google account</small>
          </span>
          <b>›</b>
        </Link>
      </section>

      <section className={styles.menuSection}>
        <h3>Support</h3>

        <Link to="/user/profile/support" className={styles.menuItem}>
          <FiHeadphones />
          <span>
            <strong>Help & Support</strong>
            <small>FAQs and support</small>
          </span>
          <b>›</b>
        </Link>
      </section>

      <button
        type="button"
        className={styles.logoutButton}
        onClick={handleLogout}
      >
        <FiLogOut />
        Log Out
      </button>
    </>
  );
}
