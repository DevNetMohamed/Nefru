import { Link } from "react-router-dom";
import styles from "./Footer.module.css";
import logo from "../../../../../../assets/images/logo.png";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.brand}>
          <div className={styles.logoWrapper}>
            <img src={logo} alt="Nefru Logo" className={styles.logo} />
            <h2>Nefru</h2>
          </div>
          <p>
            Discover Egypt through authentic experiences and trusted local guides.
          </p>
        </div>

        <div className={styles.links}>
          <div>
            <h4>Explore</h4>
            <Link to="/user/discover">Tours</Link>
            <Link to="/user/discover">Destinations</Link>
            <Link to="/user/guideprofile">Guides</Link>
          </div>

          <div>
            <h4>Resources</h4>
            <Link to="/user/discover">Destinations Guide</Link>
            <Link to="/user/profile/support">FAQ</Link>
            <Link to="/user/profile/support">Support</Link>
          </div>

          <div>
            <h4>Company</h4>
            <Link to="/user/home">About</Link>
            <Link to="/user/profile/support">Contact</Link>
            <Link to="/user/profile/support">Privacy Policy</Link>
          </div>
        </div>
      </div>

      <div className={styles.bottom}>
        <p>© 2026 Nefru. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;

