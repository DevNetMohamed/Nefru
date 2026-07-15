// import { Link } from "react-router-dom";
import { FiCompass, FiHome } from "react-icons/fi";

import { Button } from "../components/Button/Button";
import styles from "./NotFound.module.css";
import Logo_Light from "../../assets/images/Logo_Light.png";
import illustration from "../../assets/images/not-found-illustration.png";
import { useNavigate } from "react-router-dom";


export default function NotFound() {
  const navigate = useNavigate();

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <img src={Logo_Light} alt="Nefru" className={styles.logo} />

        <div className={styles.content}>
          <div className={styles.textContent}>
            <p className={styles.errorCode}>404</p>

            <h1 className={styles.title}>
              Oops! This page got lost in the sands.
            </h1>

            <p className={styles.description}>
              The page you’re looking for doesn’t exist, was moved, or may have
              never existed.
            </p>
          </div>

          <div className={styles.imageWrapper}>
            <img
              src={illustration}
              alt="Compass map with pyramids"
              className={styles.illustration}
            />
          </div>

          <div className={styles.actions}>
            <Button
              type="secondary"
              className={styles.button}
              icon={<FiHome />}
              onClick={() => navigate("/")}
            >
              Back to Home
            </Button>

            <Button
              type="outline"
              className={styles.button}
              icon={<FiCompass />}
              onClick={() => navigate("/user/discover")}
            >
              Explore Tours
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}