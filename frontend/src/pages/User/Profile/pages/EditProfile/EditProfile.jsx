import { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { FiEdit2, FiSave, FiUser } from "react-icons/fi";

import styles from "../ProfilePageShared.module.css";

function getInitials(fullName = "Traveler") {
  return fullName
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function EditProfile() {
  const { user } = useSelector((state) => state.auth);
  const fileInputRef = useRef(null);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || "");

  const profile = useMemo(
    () => ({
      fullName: user?.fullName || "Yousef Mohamed",
      email: user?.email || "yousef.m@example.com",
      phoneNumber: user?.phoneNumber || "+20 100 123 4567",
      birthDate: user?.DoB || user?.birthDate || "1990-03-15",
      gender: user?.gender || "male",
      nationality: user?.Nationality || user?.nationality || "Egyptian",
      avatar: user?.avatar || "",
    }),
    [user],
  );

  const handleChoosePhoto = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0];

    if (!file || !file.type.startsWith("image/")) return;

    const reader = new FileReader();

    reader.onload = () => {
      setAvatarPreview(reader.result);
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className={styles.pageContent}>
      <header className={styles.header}>
        <div>
          <h1>Edit Profile</h1>
          <p>Update your personal and contact information.</p>
        </div>
      </header>

      <section className={styles.card}>
        <div className={styles.profilePhotoBlock}>
          <div className={styles.profilePhotoPreview}>
            {avatarPreview ? (
              <img src={avatarPreview} alt={profile.fullName} />
            ) : (
              <span>{getInitials(profile.fullName)}</span>
            )}

            <button type="button" className={styles.photoEditButton} onClick={handleChoosePhoto} aria-label="Change profile photo">
              <FiEdit2 />
            </button>
          </div>

          <div className={styles.profilePhotoText}>
            <h3>Profile Photo</h3>
            <p>Click the edit icon to change your photo.</p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className={styles.hiddenFileInput}
            onChange={handlePhotoChange}
          />
        </div>

        <div className={styles.cardTitle}>
          <FiUser />
          <h2>Profile Information</h2>
        </div>

        <div className={styles.formGrid}>
          <label className={styles.fieldBox}>
            <span>Full Name</span>
            <input defaultValue={profile.fullName} />
          </label>

          <label className={styles.fieldBox}>
            <span>Email</span>
            <input defaultValue={profile.email} readOnly />
          </label>

          <label className={styles.fieldBox}>
            <span>Phone Number</span>
            <input defaultValue={profile.phoneNumber} />
          </label>

          <label className={styles.fieldBox}>
            <span>Birth Date</span>
            <input type="date" defaultValue={profile.birthDate} />
          </label>

          <label className={styles.fieldBox}>
            <span>Gender</span>
            <select defaultValue={String(profile.gender).toLowerCase()}>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Prefer not to say</option>
            </select>
          </label>

          <label className={styles.fieldBox}>
            <span>Nationality</span>
            <input defaultValue={profile.nationality} />
          </label>
        </div>

        <div className={styles.actions}>
          <Link to="/user/profile" className={styles.secondaryButton}>
            Cancel
          </Link>
          <button type="button" className={styles.primaryButton}>
            <FiSave />
            Save Changes
          </button>
        </div>
      </section>
    </div>
  );
}
