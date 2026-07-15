import styles from "./DesktopNavbar.module.css";
import { LogOut, User, Calendar, Bell } from "lucide-react";
import { FiCreditCard, FiStar, FiHeadphones, FiLock } from "react-icons/fi";
import logo from "../../../../../assets/images/logo.png";
import { useState } from "react";
import profileImage from "../../../../../assets/images/user/user1.png";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { useDispatch } from "react-redux";

import { logout } from "../../../../../store/slices/authSlice";

function DesktopNavbar() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const fullName = user?.fullName || "Not Logged In";
  const email = user?.email || "Not Logged In";

  const handleLogout = () => {
    dispatch(logout());
    navigate("/auth/login", { replace: true });
  };

  return (
    <nav className={styles.navbar}>
      {/* Logo */}
      <div className={styles.logo} onClick={() => navigate("/user/home")}>
        <img src={logo} alt="Nefru Logo" />
        <span> Nefru</span>
      </div>

      {/* Search */}
      {/* <div className={styles.searchBox}>
        <input
          type="text"
          placeholder="Search experiences..."
        />
      </div> */}

      {/* Navigation Links */}
      <ul className={styles.links}>
        <li>
          <a href="/user/home#Home">Home</a>
        </li>

        <li>
          <a href="/user/home#popular-tours">Tours</a>
        </li>

        <li>
          <a href="/user/home#explore-egypt">Explore Egypt</a>
        </li>

        <li>
          <a href="/user/home#top-guides">Guides</a>
        </li>
      </ul>

      {/* Actions */}
      <div className={styles.actions}>
        {/* Notifiction Bell with Dropdown */}
        <div className={styles.notificationWrapper}>
          <Bell
            size={20}
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfile(false);
            }}
          />

          {showNotifications && <div className={styles.dropdown}>...</div>}
        </div>

        {/* <Heart size={20} /> */}

        <div className={styles.profileWrapper}>
          <User
            size={20}
            onClick={() => {
              setShowProfile(!showProfile);
              setShowNotifications(false);
            }}
          />

          {showProfile && (
            <div className={styles.dropdown}>
              <div
                className={styles.profileHeader}
                onClick={() => navigate("/user/profile")}
              >
                <img src={profileImage} alt="Profile" />

                <div>
                  <h4>{fullName}</h4>
                  <span>{email}</span>
                </div>
              </div>

              <div className={styles.divider}></div>

              <div className={styles.dropdownItem}>
                <User size={16} />
                <span onClick={() => navigate("/user/profile")}>
                  My Profile
                </span>
              </div>

              <div className={styles.dropdownItem}>
                <Calendar size={16} />
                <span onClick={() => navigate("/user/profile/bookings")}>
                  My Bookings
                </span>
              </div>

              <div className={styles.dropdownItem}>
                <FiCreditCard />
                <span onClick={() => navigate("/user/profile/payments")}>
                  Payment Methods
                </span>
              </div>

              <div className={styles.dropdownItem}>
                <FiStar size={16} />
                <span onClick={() => navigate("/user/profile/reviews")}>
                  Reviews written
                </span>
              </div>
              <div className={styles.dropdownItem}>
                <FiLock size={16} />
                <span onClick={() => navigate("/user/profile/change-password")}>
                  Change Password
                </span>
              </div>
              <div className={styles.dropdownItem}>
                <FiHeadphones size={16} />
                <span onClick={() => navigate("/user/profile/support")}>
                  Help & Support
                </span>
              </div>
              <div className={styles.divider}></div>

              <button className={styles.logoutBtn} onClick={handleLogout}>
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default DesktopNavbar;
