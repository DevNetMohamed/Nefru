import { useState } from "react";
import { Link } from "react-router-dom";
import { FiLock, FiSave } from "react-icons/fi";

import { apiRequest } from "../../../../../services/api";
import styles from "../ProfilePageShared.module.css";

const initialFormData = {
  currentPassword: "",
  newPassword: "",
  confirmNewPassword: "",
};

export default function ChangePassword() {
  const [formData, setFormData] = useState(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    setApiError("");
    setSuccessMessage("");
  };

  const validateForm = () => {
    if (!formData.currentPassword) {
      return "Current password is required.";
    }

    if (!formData.newPassword) {
      return "New password is required.";
    }

    if (formData.newPassword.length < 8) {
      return "New password must be at least 8 characters.";
    }

    if (!formData.confirmNewPassword) {
      return "Confirm new password is required.";
    }

    if (formData.newPassword !== formData.confirmNewPassword) {
      return "Passwords do not match.";
    }

    if (formData.currentPassword === formData.newPassword) {
      return "New password must be different from current password.";
    }

    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      setApiError(validationError);
      return;
    }

    setIsSubmitting(true);
    setApiError("");
    setSuccessMessage("");

    try {
      const response = await apiRequest("/auth/change-password", {
        method: "PATCH",
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
          confirmNewPassword: formData.confirmNewPassword,
        }),
      });

      setSuccessMessage(response.message || "Password changed successfully.");
      setFormData(initialFormData);
    } catch (error) {
      setApiError(error.message || "Unable to change password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.pageContent}>
      <header className={styles.header}>
        <div>
          <h1>Change Password</h1>
          <p>Choose a strong password and keep your account secure.</p>
        </div>
      </header>

      <form className={styles.card} onSubmit={handleSubmit}>
        <div className={styles.cardTitle}>
          <FiLock />
          <h2>Security Information</h2>
        </div>

        {apiError && <p className={styles.errorMessage}>{apiError}</p>}
        {successMessage && (
          <p className={styles.successMessage}>{successMessage}</p>
        )}

        <div className={styles.formGrid}>
          <label className={styles.fieldBox}>
            <span>Current Password</span>
            <input
              name="currentPassword"
              type="password"
              value={formData.currentPassword}
              onChange={handleChange}
              placeholder="Enter your current password"
              autoComplete="current-password"
            />
          </label>

          <label className={styles.fieldBox}>
            <span>New Password</span>
            <input
              name="newPassword"
              type="password"
              value={formData.newPassword}
              onChange={handleChange}
              placeholder="Enter your new password"
              autoComplete="new-password"
            />
          </label>

          <label className={styles.fieldBox}>
            <span>Confirm New Password</span>
            <input
              name="confirmNewPassword"
              type="password"
              value={formData.confirmNewPassword}
              onChange={handleChange}
              placeholder="Confirm your new password"
              autoComplete="new-password"
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
            {isSubmitting ? "Updating..." : "Update Password"}
          </button>
        </div>
      </form>
    </div>
  );
}