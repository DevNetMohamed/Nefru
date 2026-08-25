import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";

import LogoLight from "../../../../../assets/images/Logo_Light.png";
import Icons from "../../../../../assets/icons";
import { Input } from "../../../../../shared/components/inputs/inputs";
import { Button } from "../../../../../shared/components/Button/Button";
import { apiRequest } from "../../../../../services/api";
import { loginSuccess } from "../../../../../store/slices/authSlice";
import GoogleAuthButton from "../../GoogleAuthButton/GoogleAuthButton";
import { getPostAuthPath } from "../../../utils/authNavigation";
import styles from "../Register.module.css";

const LOCAL_REGISTER_SCHEMA = Yup.object({
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
  terms: Yup.boolean()
    .oneOf([true], "You must agree to the terms.")
    .required("You must agree to the terms."),
});

function RegisterForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const [apiError, setApiError] = useState("");
  const [roleError, setRoleError] = useState("");

  const roleFromUrl = searchParams.get("role")?.toLowerCase();
  const initialRole = useMemo(
    () =>
      roleFromUrl === "guide" || roleFromUrl === "tourist"
        ? roleFromUrl
        : null,
    [roleFromUrl],
  );
  const [role, setRole] = useState(initialRole);

  const chooseRole = (nextRole) => {
    setRole(nextRole);
    setRoleError("");
    const next = new URLSearchParams(searchParams);
    next.set("role", nextRole);
    setSearchParams(next, { replace: true });
  };

  const formik = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
    validationSchema: LOCAL_REGISTER_SCHEMA,
    onSubmit: async (values, { setSubmitting }) => {
      setApiError("");
      setRoleError("");

      if (!role) {
        setRoleError("Choose Traveler or Tour Guide before creating your account.");
        setSubmitting(false);
        return;
      }

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

        if (response?.data?.requiresEmailVerification) {
          navigate(
            `/auth/check-email?email=${encodeURIComponent(values.email)}&role=${role}`,
            { replace: true },
          );
          return;
        }

        if (response?.data?.user) {
          const { user, profile } = response.data;
          dispatch(loginSuccess({ user, profile }));
          navigate(getPostAuthPath(user, profile), { replace: true });
          return;
        }

        throw new Error("Registration returned an unexpected response");
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
                <img className={styles.logo} src={LogoLight} alt="Nefru logo" />
                <h1 className={styles.title}>Create your Nefru account</h1>
                <p className={`${styles.subtitle} fs-5`}>
                  Choose how you’ll use Nefru, then continue with Google or email.
                </p>
              </div>
            </div>

            <div
              className={styles.roleToggle}
              aria-label="Choose account type"
              role="radiogroup"
            >
              <button
                type="button"
                className={`${styles.roleOption} ${
                  role === "tourist" ? styles.roleOptionActive : ""
                }`}
                onClick={() => chooseRole("tourist")}
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
                onClick={() => chooseRole("guide")}
                aria-pressed={role === "guide"}
              >
                <Icons.User />
                <span>Tour Guide</span>
              </button>
            </div>

            {!role && (
              <p className={styles.roleHint}>
                You can also continue with Google first; if no role is selected,
                we’ll ask you once after Google verifies your account.
              </p>
            )}
            {roleError && <p className={styles.errorMsg}>{roleError}</p>}

            <div className={styles.googleWrap}>
              <GoogleAuthButton
                role={role}
                text="continue_with"
                onError={setApiError}
              />
            </div>

            <div className={styles.authDivider}>
              <span>or continue with email</span>
            </div>

            <form className={styles.form} onSubmit={formik.handleSubmit}>
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
                  <span className={styles.errorMsg}>{formik.errors.fullName}</span>
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
                  placeholder="At least 8 characters"
                  icon={<Icons.Lock />}
                  value={formik.values.password}
                  setValue={(value) => formik.setFieldValue("password", value)}
                  onBlur={() => formik.setFieldTouched("password", true)}
                />
                {formik.touched.password && formik.errors.password && (
                  <span className={styles.errorMsg}>{formik.errors.password}</span>
                )}
              </div>

              <div className={styles.field}>
                <Input
                  id="confirmPassword"
                  title="Confirm password"
                  type="password"
                  placeholder="Re-enter your password"
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

              <div className={styles.termsRow}>
                <input
                  type="checkbox"
                  id="agreeTerms"
                  className={styles.checkbox}
                  checked={formik.values.terms}
                  onChange={(event) => {
                    formik.setFieldValue("terms", event.target.checked);
                    formik.setFieldTouched("terms", true);
                  }}
                />
                <label htmlFor="agreeTerms" className={styles.termsText}>
                  I agree to the <a href="/terms" className={styles.termsLink}>Terms of Service</a>{" "}
                  and <a href="/privacy" className={styles.termsLink}>Privacy Policy</a>.
                </label>
              </div>

              {formik.touched.terms && formik.errors.terms && (
                <span className={styles.errorMsg}>{formik.errors.terms}</span>
              )}

              {apiError && <p className={styles.errorMsg}>{apiError}</p>}

              <Button
                type="primary"
                htmlType="submit"
                disabled={formik.isSubmitting}
              >
                {formik.isSubmitting ? "Creating account..." : "Create Account"}
              </Button>

              <p className={styles.loginRow}>
                Already have an account?{" "}
                <button
                  type="button"
                  className={styles.loginLinkButton}
                  onClick={() => navigate("/auth/login")}
                >
                  Log In
                </button>
              </p>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}

export default RegisterForm;
