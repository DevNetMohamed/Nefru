import styles from "./Welcome.module.css";
import travelerImg from "../../../assets/images/auth/traveler.jpg";
import guideImg from "../../../assets/images/auth/tour-guide.png";
import Icons from "../../../assets/icons";
import { useNavigate } from "react-router-dom";

import LogoDark from "../../../assets/images/Logo_Dark.png";
import LogoLight from "../../../assets/images/Logo_Light.png";
import Footer from "../../../shared/components/Footer/Footer";

const roles = [
  {
    id: 1,
    title: "Traveler",
    role: "tourist",
    desc: "Discover curated trips and book with clear prices.",
    cta: "Continue as Traveler",
    img: travelerImg,
  },
  {
    id: 2,
    title: "Tour Guide",
    role: "guide",
    desc: "Create tours, manage bookings, and grow your business.",
    cta: "Continue as Guide",
    img: guideImg,
  },
];

export default function Welcome() {
  const navigate = useNavigate();

  const handleChooseRole = (role) => {
    navigate(`/auth/register?role=${role}`);
  };

  const handleLogin = () => {
    navigate("/auth/login");
  };

  return (
    <main className={styles.page}>
      <header className={styles.topBar}>
        <img src={LogoLight} alt="Nefru" className={styles.topLogo} />

        <button className={styles.loginLink} type="button" onClick={handleLogin}>
          <Icons.User />
          <span>Login</span>
        </button>
      </header>

      <section className={styles.mainGrid}>
        <div className={styles.contentSide}>
          <img src={LogoDark} alt="Nefru" className={styles.mobileLogo} />

          <div className={styles.copyBlock}>
            <h1 className={styles.title}>Welcome to Nefru</h1>
            <div className={styles.divider} aria-hidden="true" />

            <h2 className={styles.subtitle}>
              Choose how you want to explore <span>Egypt</span>
            </h2>
            <p className={styles.description}>
              Find trusted local tours, clear prices, and unforgettable Egyptian
              experiences from verified guides.
            </p>
          </div>

          <div className={styles.cards} aria-label="Choose account type">
            {roles.map((item) => (
              <button
                key={item.id}
                type="button"
                className={styles.roleCard}
                onClick={() => handleChooseRole(item.role)}
              >
                <img src={item.img} alt="" className={styles.cardImg} />

                <div className={styles.cardOverlay} />

                <div className={styles.cardContent}>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>

                  <span className={styles.cardCta}>
                    {item.cta}
                    <Icons.ArrowRight />
                  </span>
                </div>
              </button>
            ))}
          </div>

          <div className={styles.alreadyHaveAccount}>
            <p>Already have an account?</p>
            <button className={styles.loginLink} type="button" onClick={handleLogin}>
              <Icons.User />
              <span>Login</span>
            </button>
          </div>

          <div className={styles.mobileLoginBlock}>
            <button className={styles.loginButton} type="button" onClick={handleLogin}>
              Login
            </button>

            <div className={styles.mobileSocials} aria-label="Social links">
              <a href="#" aria-label="Facebook">
                <Icons.Facebook />
              </a>
              <a href="#" aria-label="Twitter X">
                <Icons.Twitter />
              </a>
            </div>

            <p>Unveiling the Timeless Wonders of the Nile.</p>
          </div>
        </div>

        <aside className={styles.heroSide} aria-label="Egypt travel inspiration">
          <div className={styles.heroImage} />
        </aside>
      </section>

      <Footer />
    </main>
  );
}
