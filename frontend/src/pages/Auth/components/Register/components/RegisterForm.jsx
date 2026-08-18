import { useMemo, useRef, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Logo_Light from "../../../../../assets/images/Logo_Light.png";
import Icons from "../../../../../assets/icons";
import { Input } from "../../../../../shared/components/Inputs/Inputs";
import { Button } from "../../../../../shared/components/Button/Button";
import styles from "../Register.module.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../../../../store/slices/authSlice";
import { apiRequest } from "../../../../../services/api";

function RegisterForm() {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const dispatch = useDispatch();

  const [apiError, setApiError] = useState("");

  const fileInputRef = useRef(null);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const roleFromUrl = searchParams.get("role")?.toLowerCase();
  const initialRole =
    roleFromUrl === "guide" || roleFromUrl === "tourist"
      ? roleFromUrl
      : "tourist";

  const [role, setRole] = useState(initialRole);
  const roleLabel = role === "guide" ? "Guide" : "Traveler";

  const validationSchema = useMemo(() => {
    return Yup.object({
      fullName: Yup.string()
        .trim()
        .min(3, "Full name must be at least 3 characters.")
        .required("Full name is required."),

      email: Yup.string()
        .email("Please enter a valid email address.")
        .required("Email is required."),

      password: Yup.string()
        .min(8, "Password must be at least 8 characters.")
        .required("Password is required."),

      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Passwords do not match.")
        .required("Confirm password is required."),

      document:
        role === "guide"
          ? Yup.mixed().required("Verification document is required.")
          : Yup.mixed().nullable(),

      terms: Yup.boolean()
        .oneOf([true], "You must agree to the terms.")
        .required("You must agree to the terms."),
    });
  }, [role]);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];

    if (!file) return;

    setUploadedFile(file);
    formik.setFieldValue("document", file);
    formik.setFieldTouched("document", true);
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setUploadedFile(file);
    formik.setFieldValue("document", file);
    formik.setFieldTouched("document", true);
  };

  const formik = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      document: null,
      terms: false,
    },

    validationSchema,

    onSubmit: async (values, { setSubmitting }) => {
      setApiError("");

      try {
        const response = await apiRequest("/auth/register", {
          method: "POST",
          body: JSON.stringify({
            fullName: values.fullName,
            email: values.email,
            password: values.password,
            confirmPassword: values.confirmPassword,
            role,
          }),
        });

        if (role === "guide") {
          navigate("/auth/application-received");
          return;
        }

        dispatch(
          loginSuccess({
            token: response.token,
            user: response.data.user,
          }),
        );

        navigate("/user/home");
      } catch (error) {
        setApiError(error.message || "Registration failed. Please try again.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className={styles.container}>
      <div className={styles.authLayout}>
        <main className={styles.registerSide}>
          <div className={styles.registerCard}>
            <div className={styles.StepTwoContainer}>
              <div className={styles.content}>
                <img
                  className={styles.logo}
                  src={Logo_Light}
                  alt="Nefru logo"
                />
                <p className={`${styles.subtitle} fs-5`}>
                  Signing up as a <strong>{roleLabel}</strong>
                </p>
              </div>
            </div>

            <form className={styles.form} onSubmit={formik.handleSubmit}>
              {/* <div
                className={styles.roleToggle}
                aria-label="Choose account type"
              >
                <button
                  type="button"
                  className={`${styles.roleOption} ${
                    role === "tourist" ? styles.roleOptionActive : ""
                  }`}
                  onClick={() => {
                    setRole("tourist");
                    setUploadedFile(null);
                    formik.setFieldValue("document", null);
                    formik.setFieldTouched("document", false);
                  }}
                  aria-pressed={role === "tourist"}
                >
                  <Icons.User />
                  <span>Traveler</span>
                </button>

                <button
                  type="button"
                  className={`${styles.roleOption} ${
                    role === "guide" ? styles.roleOptionActive : ""
                  }`}
                  onClick={() => setRole("guide")}
                  aria-pressed={role === "guide"}
                >
                  <Icons.User />
                  <span>Guide</span>
                </button>
              </div> */}

              <div className={styles.field}>
                <Input
                  id="fullName"
                  title="Full name"
                  placeholder="Enter your full name"
                  icon={<Icons.User />}
                  value={formik.values.fullName}
                  setValue={(value) => formik.setFieldValue("fullName", value)}
                  onBlur={() => formik.setFieldTouched("fullName", true)}
                />
                {formik.touched.fullName && formik.errors.fullName && (
                  <span className={styles.errorMsg}>
                    {formik.errors.fullName}
                  </span>
                )}
              </div>

              <div className={styles.field}>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  title="Email"
                  placeholder="you@email.com"
                  icon={<Icons.Email />}
                  value={formik.values.email}
                  setValue={(value) => formik.setFieldValue("email", value)}
                  onBlur={() => formik.setFieldTouched("email", true)}
                />
                {formik.touched.email && formik.errors.email && (
                  <span className={styles.errorMsg}>{formik.errors.email}</span>
                )}
              </div>

              <div className={styles.field}>
                <Input
                  id="password"
                  title="Password"
                  type="password"
                  placeholder="Create a password"
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
                  title="Confirm password"
                  type="password"
                  placeholder="Confirm your password"
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

              {role === "guide" ? (
                <>
                  <label className={styles.label}>Document Verification</label>

                  <div className={styles.field}>
                    <div
                      className={`${styles.uploadZone} ${
                        isDragging ? styles.uploadZoneDragging : ""
                      } ${formik.touched.document && formik.errors.document ? styles.uploadZoneError : ""}`}
                      role="button"
                      tabIndex={0}
                      aria-label="Upload ID or Passport"
                      onClick={() => fileInputRef.current?.click()}
                      onKeyDown={(e) =>
                        e.key === "Enter" && fileInputRef.current?.click()
                      }
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragging(true);
                      }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={handleDrop}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*,.pdf"
                        className={styles.hiddenInput}
                        onChange={handleFileInput}
                        aria-hidden="true"
                      />
                      <div className={styles.passportIcon}>
                        <Icons.Passport />
                      </div>
                      <div className={styles.uploadText}>
                        <span className={styles.uploadTitle}>
                          {uploadedFile
                            ? uploadedFile.name
                            : "Upload ID or Passport"}
                        </span>
                        <span className={styles.uploadSub}>
                          {uploadedFile
                            ? "Click to replace"
                            : "Drag & drop or browse"}
                        </span>
                      </div>
                    </div>
                    {formik.touched.document && formik.errors.document && (
                      <span className={styles.errorMsg}>
                        {formik.errors.document}
                      </span>
                    )}
                  </div>
                </>
              ) : (
                <> </>
              )}

              <div className={styles.termsRow}>
                <input
                  type="checkbox"
                  id="agreeTerms"
                  className={styles.checkbox}
                  checked={formik.values.terms}
                  onChange={(e) => {
                    formik.setFieldValue("terms", e.target.checked);
                    formik.setFieldTouched("terms", true);
                  }}
                  onBlur={() => formik.setFieldTouched("terms", true)}
                />
                <label htmlFor="agreeTerms" className={styles.termsText}>
                  I agree to the{" "}
                  <a href="/terms" className={styles.termsLink}>
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="/privacy" className={styles.termsLink}>
                    Privacy Policy
                  </a>
                  .
                </label>
              </div>

              {formik.touched.terms && formik.errors.terms && (
                <span className={styles.errorMsg}>{formik.errors.terms}</span>
              )}

              <div>
                {apiError && <p className={styles.errorMsg}>{apiError}</p>}
                <Button
                  type="primary"
                  htmlType="submit"
                  disabled={formik.isSubmitting}
                >
                  {formik.isSubmitting
                    ? "Creating account..."
                    : "Create Account"}
                </Button>

                <p className={styles.loginRow}>
                  Already have an account?{" "}
                  <span
                    className={styles.loginLink}
                    onClick={() => navigate("/auth/login")}
                  >
                    Log In
                  </span>
                </p>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}

export default RegisterForm;
