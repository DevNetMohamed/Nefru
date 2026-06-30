import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";

import { Input } from "../../../../../shared/components/inputs/inputs";
import { Button } from "../../../../../shared/components/Button/Button";
import Icons from "../../../../../assets/icons";
import LogoLight from "../../../../../assets/images/Logo_Light.png";
import { apiRequest } from "../../../../../services/api";
import styles from "../ResetPassword.module.css";

const RESET_PASSWORD_SCHEMA = Yup.object({
  password: Yup.string()
    .min(8, "Password must be at least 8 characters.")
    .required("Password is required."),

  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords do not match.")
    .required("Confirm password is required."),
});

export default function ResetPasswordForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");

  const [apiError, setApiError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },

    validationSchema: RESET_PASSWORD_SCHEMA,

    onSubmit: async (values, { setSubmitting }) => {
      setApiError("");
      setSuccessMessage("");

      if (!token) {
        setApiError("Reset token is missing. Please request a new reset link.");
        setSubmitting(false);
        return;
      }

      try {
        const response = await apiRequest("/auth/reset-password", {
          method: "POST",
          body: JSON.stringify({
            token,
            password: values.password,
            confirmPassword: values.confirmPassword,
          }),
        });

        setSuccessMessage(response.message || "Password reset successfully.");

        setTimeout(() => {
          navigate("/auth/login");
        }, 1200);
      } catch (error) {
        setApiError(error.message || "Failed to reset password.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className={styles.container}>
      <section className={styles.formSide}>
        <div className={styles.authCard}>
          <div className={styles.headerBlock}>
            <img src={LogoLight} alt="Nefru logo" className={styles.logo} />
            <h1 className={styles.title}>Reset Password</h1>
            <p className={`${styles.subtitle} fs-5`}>
              Create a new password to get back into your account.
            </p>
          </div>

          <form className={styles.form} onSubmit={formik.handleSubmit}>
            <div className={styles.successBox}>
              <Icons.CheckCircle className={styles.successIcon} />
              <div>
                <h2 className={styles.successTitle}>Reset link verified</h2>
                <p className={styles.successText}>
                  You can now create a new password.
                </p>
              </div>
            </div>

            <div className={styles.field}>
              <Input
                id="password"
                name="password"
                type="password"
                title="New Password"
                placeholder="Enter new password"
                icon={<Icons.Lock />}
                value={formik.values.password}
                setValue={(value) => formik.setFieldValue("password", value)}
                onBlur={() => formik.setFieldTouched("password", true)}
              />

              {formik.touched.password && formik.errors.password && (
                <span className={styles.errorMsg}>
                  {formik.errors.password}
                </span>
              )}
            </div>

            <div className={styles.field}>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                title="Confirm Password"
                placeholder="Confirm new password"
                icon={<Icons.Lock />}
                value={formik.values.confirmPassword}
                setValue={(value) =>
                  formik.setFieldValue("confirmPassword", value)
                }
                onBlur={() => formik.setFieldTouched("confirmPassword", true)}
              />

              {formik.touched.confirmPassword &&
                formik.errors.confirmPassword && (
                  <span className={styles.errorMsg}>
                    {formik.errors.confirmPassword}
                  </span>
                )}
            </div>

            {apiError && <p className={styles.errorMsg}>{apiError}</p>}

            {successMessage && (
              <p className={styles.successMsg}>{successMessage}</p>
            )}
            <Button
              type="primary"
              htmlType="submit"
              disabled={formik.isSubmitting}
            >
              {formik.isSubmitting ? "Resetting..." : "Reset Password"}
            </Button>
          </form>

          <p className={styles.loginRow}>
            Already have an account?{" "}
            <button type="button" onClick={() => navigate("/auth/login")}>
              Log In
            </button>
          </p>
        </div>
      </section>
    </div>
  );
}
