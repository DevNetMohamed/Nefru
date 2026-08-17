import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./MobileWelcome.module.css";
import travelerCardImg from "../../../../assets/images/auth/welcome-traveler.jpg";
import guideCardImg from "../../../../assets/images/auth/welcome-guide.jpg";
import logoImg from "../../../../assets/logo.png";
import { HiOutlineUser } from "react-icons/hi";
import { CiLocationOn } from "react-icons/ci";
import { IoIosArrowForward } from "react-icons/io";

export default function MobileWelcome() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState("tourist");

  const handleSelectRole = (role) => {
    setSelectedRole(role);
  };

  const handleCreateAccount = () => {
    navigate(`/auth/register?role=${selectedRole || "tourist"}`);
  };

  const handleLogin = () => {
    navigate("/auth/login");
  };

  return (
    <div className={styles.mobilePageWrapper}>
      <div className={styles.mobileContainer}>
        {/* Brand Logo & Name */}
        <header className={styles.brandHeader}>
          <div className={styles.logoCircle}>
            <img src={logoImg} alt="Nefru emblem" className={styles.logoEmblem} />
          </div>
          <h1 className={styles.brandName}>NEFRU</h1>
        </header>

        {/* Welcome Section */}
        <div className={styles.introBlock}>
          <span className={styles.eyebrow}>WELCOME TO NEFRU</span>
          <h2 className={styles.mainTitle}>
            Choose how you want to explore Egypt.
          </h2>
          <p className={styles.subtitle}>Experience Egypt. Your way.</p>
        </div>

        {/* Role Cards */}
        <div className={styles.cardsContainer} role="radiogroup" aria-label="Choose account type">
          {/* Traveler Card */}
          <div
            className={`${styles.roleCard} ${selectedRole === "tourist" ? styles.selectedCard : ""}`}
            onClick={() => handleSelectRole("tourist")}
            role="radio"
            aria-checked={selectedRole === "tourist"}
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && handleSelectRole("tourist")}
          >
            <div className={styles.imageWrapper}>
              <img
                src={travelerCardImg}
                alt="Pyramids"
                className={styles.cardImage}
              />
              <div className={styles.iconBadge}>
                <HiOutlineUser className={styles.badgeIcon} />
              </div>
            </div>
            <div className={styles.cardBody}>
              <div className={styles.cardHeader}>
                <h3 className={styles.roleTitle}>Traveler</h3>
                <IoIosArrowForward className={styles.chevronIcon} />
              </div>
              <p className={styles.roleDesc}>
                Discover timeless places, book tours, and create unforgettable memories.
              </p>
            </div>
          </div>

          {/* Tour Guide Card */}
          <div
            className={`${styles.roleCard} ${selectedRole === "guide" ? styles.selectedCard : ""}`}
            onClick={() => handleSelectRole("guide")}
            role="radio"
            aria-checked={selectedRole === "guide"}
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && handleSelectRole("guide")}
          >
            <div className={styles.imageWrapper}>
              <img
                src={guideCardImg}
                alt="Tour Guide at Karnak"
                className={styles.cardImage}
              />
              <div className={styles.iconBadge}>
                <CiLocationOn className={styles.badgeIcon} />
              </div>
            </div>
            <div className={styles.cardBody}>
              <div className={styles.cardHeader}>
                <h3 className={styles.roleTitle}>Tour Guide</h3>
                <IoIosArrowForward className={styles.chevronIcon} />
              </div>
              <p className={styles.roleDesc}>
                Share your knowledge, manage tours, and grow your business.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className={styles.actionButtons}>
          <button
            type="button"
            className={styles.loginBtn}
            onClick={handleLogin}
          >
            Log In
          </button>
          <button
            type="button"
            className={styles.createAccountBtn}
            onClick={handleCreateAccount}
          >
            Create Account
          </button>
        </div>

        {/* Legal Disclaimer */}
        <p className={styles.legalNotice}>
          By continuing, you agree to our{" "}
          <span className={styles.legalLink}>Terms of Service</span> and{" "}
          <span className={styles.legalLink}>Privacy Policy</span>.
        </p>
      </div>
    </div>
  );
}

