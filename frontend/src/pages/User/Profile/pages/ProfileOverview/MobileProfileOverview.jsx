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

import { logout } from "../../../../../store/slices/authSlice";
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
  const { user } = useSelector((state) => state.auth);

  const fullName = user?.fullName || "Nefru Traveler";
  const email = user?.email || "traveler@nefru.com";
  const initials = useMemo(() => getInitials(fullName), [fullName]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/auth/login", { replace: true });
  };

  return (
    <>
      <section className={styles.profileCard}>
        {user?.avatar ? <img src={user.avatar} alt={fullName} /> : <div className={styles.avatar}>{initials}</div>}
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
            <small>Your tour feedback</small>
          </span>
          <b>›</b>
        </Link>

        <Link to="/user/profile/change-password" className={styles.menuItem}>
          <FiLock />
          <span>
            <strong>Change Password</strong>
            <small>Update your account password</small>
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

      <button type="button" className={styles.logoutButton} onClick={handleLogout}>
        <FiLogOut />
        Log Out
      </button>
    </>
  );
}
