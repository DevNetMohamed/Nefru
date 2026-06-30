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

export default function ProfileOverview() {
  const { user } = useSelector((state) => state.auth);

  const profile = useMemo(
    () => ({
      fullName: user?.fullName || "Yousef Mohamed",
      email: user?.email || "yousef.m@example.com",
      phoneNumber: user?.phoneNumber || "+20 100 123 4567",
      nationality: user?.Nationality || user?.nationality || "Egyptian",
      birthDate: user?.DoB || user?.birthDate || null,
      gender: user?.gender && user.gender !== "other" ? user.gender : "Male",
      role: user?.role === "guide" ? "Guide" : "Traveler",
      memberSince: user?.createdAt,
      verificationStatus: user?.verificationStatus || "pending",
      avatar: user?.avatar || "",
    }),
    [user],
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
        {profile.avatar ? (
          <img src={profile.avatar} alt={profile.fullName} className={styles.photo} />
        ) : (
          <div className={styles.photoFallback}>{getInitials(profile.fullName)}</div>
        )}

        <div>
          <h2>{profile.fullName}</h2>
          <p>{profile.email}</p>
          <span className={styles.roleBadge}>{profile.role}</span>
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
            <strong>{profile.email}</strong>
          </div>

          <div className={styles.fieldBox}>
            <span>Phone Number</span>
            <strong>{profile.phoneNumber}</strong>
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
            <strong>{profile.fullName}</strong>
          </div>

          <div className={styles.fieldBox}>
            <span>Birth Date</span>
            <strong>{formatDate(profile.birthDate, "15 March 1990")}</strong>
          </div>

          <div className={styles.fieldBox}>
            <span>Gender</span>
            <strong>{String(profile.gender).charAt(0).toUpperCase() + String(profile.gender).slice(1)}</strong>
          </div>

          <div className={styles.fieldBox}>
            <span>Nationality</span>
            <strong>{profile.nationality}</strong>
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
            <strong>{profile.role}</strong>
          </div>

          <div className={styles.summaryItem}>
            <FiCalendar />
            <span>Member Since</span>
            <strong>{formatDate(profile.memberSince, "Recently joined")}</strong>
          </div>

          <div className={styles.summaryItem}>
            <FiGlobe />
            <span>Nationality</span>
            <strong>{profile.nationality}</strong>
          </div>

          <div className={styles.summaryItem}>
            <FiCheckCircle />
            <span>Verification Status</span>
            <strong className={styles.status}>{profile.verificationStatus}</strong>
          </div>

          <div className={styles.summaryItem}>
            <FiMail />
            <span>Account Email</span>
            <strong>{profile.email}</strong>
          </div>
        </div>
      </section>
    </div>
  );
}
