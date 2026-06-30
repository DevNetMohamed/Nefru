import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  FiCalendar,
  FiCheckCircle,
  FiEdit2,
  FiGlobe,
  FiMail,
  FiPhone,
  FiUser,
} from "react-icons/fi";

import styles from "./ProfileOverview.module.css";

function formatDate(date, fallback = "Not added yet") {
  if (!date) return fallback;

  return new Date(date).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function getInitials(fullName = "Traveler") {
  return fullName
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatGender(gender) {
  if (!gender) return "Not added yet";
  if (gender === "other") return "Prefer not to say";

  return gender.charAt(0).toUpperCase() + gender.slice(1);
}

export default function ProfileOverview() {
  const { user, profile } = useSelector((state) => state.auth);

  const profileData = useMemo(
    () => ({
      fullName: user?.fullName || "Not added yet",
      email: user?.email || "Not added yet",
      phoneNumber: profile?.phoneNumber || "Not added yet",
      nationality: profile?.nationality || "Not added yet",
      dateOfBirth: profile?.dateOfBirth || null,
      gender: profile?.gender || "",
      role: user?.role === "guide" ? "Guide" : "Traveler",
      memberSince: user?.createdAt || null,
      verificationStatus: user?.verificationStatus || "pending",
      avatar: user?.avatar || "",
    }),
    [user, profile]
  );

  return (
    <div className={styles.pageContent}>
      <header className={styles.header}>
        <div>
          <h1>Profile Overview</h1>
          <p>View & update your personal and contact information</p>
        </div>

        <Link to="/user/profile/edit" className={styles.editButton}>
          <FiEdit2 />
          Edit Profile
        </Link>
      </header>

      <section className={styles.profileHero}>
        {profileData.avatar ? (
          <img
            src={profileData.avatar}
            alt={profileData.fullName}
            className={styles.photo}
          />
        ) : (
          <div className={styles.photoFallback}>
            {getInitials(profileData.fullName)}
          </div>
        )}

        <div>
          <h2>{profileData.fullName}</h2>
          <p>{profileData.email}</p>
          <span className={styles.roleBadge}>{profileData.role}</span>
        </div>
      </section>

      <section className={styles.card}>
        <div className={styles.cardTitle}>
          <FiPhone />
          <h2>Contact Information</h2>
        </div>

        <div className={styles.fieldsGrid}>
          <div className={styles.fieldBox}>
            <span>Email</span>
            <strong>{profileData.email}</strong>
          </div>

          <div className={styles.fieldBox}>
            <span>Phone Number</span>
            <strong>{profileData.phoneNumber}</strong>
          </div>
        </div>
      </section>

      <section className={styles.card}>
        <div className={styles.cardTitle}>
          <FiUser />
          <h2>Personal Information</h2>
        </div>

        <div className={styles.fieldsGrid}>
          <div className={styles.fieldBox}>
            <span>Full Name</span>
            <strong>{profileData.fullName}</strong>
          </div>

          <div className={styles.fieldBox}>
            <span>Birth Date</span>
            <strong>{formatDate(profileData.dateOfBirth)}</strong>
          </div>

          <div className={styles.fieldBox}>
            <span>Gender</span>
            <strong>{formatGender(profileData.gender)}</strong>
          </div>

          <div className={styles.fieldBox}>
            <span>Nationality</span>
            <strong>{profileData.nationality}</strong>
          </div>
        </div>
      </section>

      <section className={styles.card}>
        <div className={styles.cardTitle}>
          <FiCheckCircle />
          <h2>Account Summary</h2>
        </div>

        <div className={styles.summaryGrid}>
          <div className={styles.summaryItem}>
            <FiUser />
            <span>Role</span>
            <strong>{profileData.role}</strong>
          </div>

          <div className={styles.summaryItem}>
            <FiCalendar />
            <span>Member Since</span>
            <strong>{formatDate(profileData.memberSince, "Recently joined")}</strong>
          </div>

          <div className={styles.summaryItem}>
            <FiGlobe />
            <span>Nationality</span>
            <strong>{profileData.nationality}</strong>
          </div>

          <div className={styles.summaryItem}>
            <FiCheckCircle />
            <span>Verification Status</span>
            <strong className={styles.status}>
              {profileData.verificationStatus}
            </strong>
          </div>

          <div className={styles.summaryItem}>
            <FiMail />
            <span>Account Email</span>
            <strong>{profileData.email}</strong>
          </div>
        </div>
      </section>
    </div>
  );
}