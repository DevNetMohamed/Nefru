import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";

import { apiRequest } from "../../../../../services/api";
import { loginSuccess } from "../../../../../store/slices/authSlice";
import { Button } from "../../../../../shared/components/Button/Button";
import { Input } from "../../../../../shared/components/Inputs/Inputs";
import Icons from "../../../../../assets/icons";
import LogoLight from "../../../../../assets/images/Logo_Light.png";
import GoogleAuthButton from "../../GoogleAuthButton/GoogleAuthButton";
import { getPostAuthPath } from "../../../utils/authNavigation";
import styles from "../Login.module.css";

const VALIDATION_SCHEMA = Yup.object().shape({
  email: Yup.string()
    .email("Please enter a valid email address.")
    .required("Email is required."),
  password: Yup.string().required("Password is required."),
});

function LoginForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [rememberMe, setRememberMe] = useState(false);
  const [apiError, setApiError] = useState("");
  const [needsVerification, setNeedsVerification] = useState(false);
  const [resendStatus, setResendStatus] = useState("");
  const [resending, setResending] = useState(false);

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: VALIDATION_SCHEMA,
    onSubmit: async (values, { setSubmitting }) => {
      setApiError("");
      setNeedsVerification(false);
      setResendStatus("");

      try {
        const response = await apiRequest("/auth/login", {
          method: "POST",
          body: JSON.stringify({ ...values, rememberMe }),
        });

        const user = response?.data?.user;
        const profile = response?.data?.profile;

        if (!user) throw new Error("Login failed: invalid server response");

        dispatch(
          loginSuccess({
            token: response?.meta?.token || null,
            user,
            profile,
          }),
        );
        navigate(getPostAuthPath(user, profile), { replace: true });
      } catch (error) {
        setNeedsVerification(error.code === "EMAIL_NOT_VERIFIED");
        setApiError(error.message || "Login failed. Please try again.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  const resendVerification = async () => {
    if (!formik.values.email) {
      setResendStatus("Enter your email first.");
      return;
    }

    setResending(true);
    setResendStatus("");

    try {
      const response = await apiRequest("/auth/resend-verification", {
        method: "POST",
        body: JSON.stringify({ email: formik.values.email }),
      });
      setResendStatus(response.message);
    } catch (error) {
      setResendStatus(error.message || "Unable to resend verification email.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className={styles.container}>
      <section className={styles.formSide}>
        <div className={styles.authCard}>
          <div className={styles.headerBlock}>
            <img className={styles.logo} src={LogoLight} alt="Nefru logo" />
            <h1 className={styles.title}>Log in</h1>
            <p className={`${styles.subtitle} fs-5`}>
              Welcome back! Continue your Nefru journey.
            </p>
          </div>

          <form className={styles.form} onSubmit={formik.handleSubmit}>
            <div className={styles.field}>
              <Input
                type="email"
                id="email"
                name="email"
                title="Email Address"
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
                type="password"
                id="password"
                name="password"
                title="Password"
                placeholder="Enter your password"
                icon={<Icons.Lock />}
                value={formik.values.password}
                setValue={(value) => formik.setFieldValue("password", value)}
                onBlur={() => formik.setFieldTouched("password", true)}
              />
              {formik.touched.password && formik.errors.password && (
                <span className={styles.errorMsg}>{formik.errors.password}</span>
              )}
            </div>

            <div className={styles.options}>
              <label className={styles.rememberOption} htmlFor="remember">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={() => setRememberMe((prev) => !prev)}
                />
                <span>Remember me</span>
              </label>

              <Link to="/auth/forget-password" className={styles.forgot}>
                Forgot password?
              </Link>
            </div>

            {apiError && <p className={styles.errorMsg}>{apiError}</p>}
            {needsVerification && (
              <div className={styles.verificationHelp}>
                <p>
                  Open the verification link before logging in. If it is not in
                  your Inbox, check Spam or Junk and mark Nefru as &quot;Not spam&quot;.
                </p>
                <button
                  type="button"
                  className={styles.inlineAction}
                  onClick={resendVerification}
                  disabled={resending}
                >
                  {resending ? "Sending…" : "Resend verification email"}
                </button>
              </div>
            )}
            {resendStatus && <p className={styles.statusMsg} role="status">{resendStatus}</p>}

            <Button
              type="primary"
              htmlType="submit"
              disabled={formik.isSubmitting}
            >
              {formik.isSubmitting ? "Logging in..." : "Log in"}
            </Button>
          </form>

          <div className={styles.divider}>
            <span>or</span>
          </div>

          <div className={styles.googleWrap}>
            <GoogleAuthButton
              rememberMe={rememberMe}
              text="continue_with"
              onError={setApiError}
            />
          </div>

          <div className={styles.guestWrap}>
            <Button
              icon={<Icons.Guest />}
              onClick={() => navigate("/user/home")}
              type="normal"
            >
              Continue as Guest
            </Button>
          </div>

          <p className={styles.dont}>
            Don&apos;t have an account? <Link to="/auth/register">Register</Link>
          </p>
        </div>
      </section>
    </div>
  );
}

export default LoginForm;
