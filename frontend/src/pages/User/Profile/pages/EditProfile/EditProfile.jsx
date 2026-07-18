import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiEdit2, FiSave, FiUser } from "react-icons/fi";

import { apiRequest } from "../../../../../services/api";
import { updateProfile } from "../../../../../store/slices/authSlice";
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

function formatDateForInput(date) {
  if (!date) return "";
  return date.split("T")[0];
}

export default function EditProfile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, profile } = useSelector((state) => state.auth);

  const fileInputRef = useRef(null);

  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");

  const initialFormData = useMemo(
    () => ({
      fullName: user?.fullName || "",
      email: user?.email || "",
      phoneNumber: profile?.phoneNumber || "",
      dateOfBirth: formatDateForInput(profile?.dateOfBirth),
      gender: profile?.gender || "other",
      nationality: profile?.nationality || "",
      preferredLanguage: profile?.preferredLanguage || "en",
    }),
    [user, profile]
  );

  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    setFormData(initialFormData);
    setAvatarPreview(user?.avatar || "");
  }, [initialFormData, user?.avatar]);

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

    // TODO: Upload avatar later using FormData + Cloudinary.
    // Current behavior is preview only.
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setIsSubmitting(true);
    setApiError("");

    try {
      const response = await apiRequest("/users/profile/me", {
        method: "PATCH",
        body: JSON.stringify({
          fullName: formData.fullName,
          phoneNumber: formData.phoneNumber,
          dateOfBirth: formData.dateOfBirth || null,
          gender: formData.gender,
          nationality: formData.nationality,
          preferredLanguage: formData.preferredLanguage,
        }),
      });

      dispatch(
        updateProfile({
          user: response.data.user,
          profile: response.data.profile,
        })
      );

      navigate("/user/profile");
    } catch (error) {
      setApiError(error.message || "Unable to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.pageContent}>
      <header className={styles.header}>
        <div>
          <h1>Edit Profile</h1>
          <p>Update your personal and contact information.</p>
        </div>
      </header>

      <form className={styles.card} onSubmit={handleSubmit}>
        <div className={styles.profilePhotoBlock}>
          <div className={styles.profilePhotoPreview}>
            {avatarPreview ? (
              <img src={avatarPreview} alt={formData.fullName || "Traveler"} />
            ) : (
              <span>{getInitials(formData.fullName)}</span>
            )}

            <button
              type="button"
              className={styles.photoEditButton}
              onClick={handleChoosePhoto}
              aria-label="Change profile photo"
            >
              <FiEdit2 />
            </button>
          </div>

          <div className={styles.profilePhotoText}>
            <h3>Profile Photo</h3>
            <p>Click the edit icon to preview a new photo.</p>
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

        {apiError && <p className={styles.errorMessage}>{apiError}</p>}

        <div className={styles.formGrid}>
          <label className={styles.fieldBox}>
            <span>Full Name</span>
            <input
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
            />
          </label>

          <label className={styles.fieldBox}>
            <span>Email</span>
            <input name="email" value={formData.email} readOnly />
          </label>

          <label className={styles.fieldBox}>
            <span>Phone Number</span>
            <input
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Enter your phone number"
            />
          </label>

          <label className={styles.fieldBox}>
            <span>Birth Date</span>
            <input
              name="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={handleChange}
            />
          </label>

          <label className={styles.fieldBox}>
            <span>Gender</span>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Prefer not to say</option>
            </select>
          </label>

          <label className={styles.fieldBox}>
            <span>Nationality</span>
            <input
              name="nationality"
              value={formData.nationality}
              onChange={handleChange}
              placeholder="Enter your nationality"
            />
          </label>
        </div>

        <div className={styles.actions}>
          <Link to="/user/profile" className={styles.secondaryButton}>
            Cancel
          </Link>

          <button
            type="submit"
            className={styles.primaryButton}
            disabled={isSubmitting}
            aria-busy={isSubmitting}
          >
            {isSubmitting ? (
              <span className={styles.loadingSpinner} aria-hidden="true" />
            ) : (
              <FiSave />
            )}
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}