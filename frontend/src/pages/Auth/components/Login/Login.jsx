import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "../../../../shared/components/Button/Button";
import { Input } from "../../../../shared/components/inputs/inputs";
import Footer from "../../../../shared/components/Footer/Footer";
import Icons from "../../../../assets/icons";
import LogoLight from "../../../../assets/images/Logo_Light.png";
import styles from "./Login.module.css";

import { apiRequest } from "../../../../services/api";

import { useDispatch } from "react-redux";
import { loginSuccess } from "../../../../store/slices/authSlice";

import { useFormik } from "formik";
import * as Yup from "yup";

const VALIDATION_SCHEMA = Yup.object().shape({
  email: Yup.string()
    .email("Please enter a valid email address.")
    .required("Email is required."),
  password: Yup.string().required("Password is required."),
});

function Login() {
  const navigate = useNavigate();

  const [rememberMe, setRememberMe] = useState(false);
  const [apiError, setApiError] = useState("");
  const dispatch = useDispatch();

  // const handleLogin = async (e) => {
  //   e.preventDefault();
  //   setError("");

  //   if (!email || !password) {
  //     setError("Please enter your email and password.");
  //     return;
  //   }

  //   try {
  //     setIsLoading(true);

  //     const response = await apiRequest("/auth/login", {
  //       method: "POST",
  //       body: JSON.stringify({
  //         email,
  //         password,
  //       }),
  //     });

  //     dispatch(
  //       loginSuccess({
  //         token: response.token,
  //         user: response.data.user,
  //       }),
  //     );

  //     const role = response.data.user.role;

  //     if (role === "admin") {
  //       navigate("/admin/overview");
  //       return;
  //     }

  //     if (role === "guide") {
  //       navigate("/user/home");
  //       return;
  //     }

  //     navigate("/user/home");
  //   } catch (error) {
  //     setError(error.message || "Login failed. Please try again.");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },

    validationSchema: VALIDATION_SCHEMA,

    onSubmit: async (values, { setSubmitting }) => {
      setApiError("");

      try {
        const response = await apiRequest("/auth/login", {
          method: "POST",
          body: JSON.stringify(values),
        });

        dispatch(
          loginSuccess({
            token: response.token,
            user: response.data.user,
          }),
        );

        const role = response.data.user.role;

        if (role === "admin") {
          navigate("/admin/overview");
          return;
        }

        navigate("/user/home");
      } catch (error) {
        setApiError(error.message || "Login failed. Please try again.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <main className={styles.container}>
      <div className={styles.authLayout}>
        <section
          className={styles.hero}
          aria-label="Nefru trusted travel access"
        >
          <div className={styles.heroOverlay} />
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>Continue your Egyptian journey</h1>
            <div className={styles.heroLine} />
            <p className={styles.heroText}>
              Sign in to discover curated trips, manage your bookings, and
              explore Egypt with verified local guides.
            </p>
          </div>
        </section>

        <section className={styles.formSide}>
          <div className={styles.authCard}>
            <div className={styles.headerBlock}>
              <img className={styles.logo} src={LogoLight} alt="Nefru logo" />
              <h1 className={styles.title}>Log in</h1>
              <p className={styles.subtitle}>
                Welcome back! Please log in to continue your journey.
              </p>
            </div>

            <form className={styles.form} onSubmit={formik.handleSubmit}>
              {" "}
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
                  <span className={styles.errorMsg}>
                    {formik.errors.password}
                  </span>
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
              {apiError && <p className={styles.errorMsg}>{apiError}</p>}{" "}
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

            <Button
              icon={<Icons.Guest />}
              onClick={() => navigate("/user/home")}
              type="primary"
            >
              Continue as Guest
            </Button>

            <p className={styles.dont}>
              Don't have an account? <Link to="/auth/register">Register</Link>
            </p>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}

export default Login;
