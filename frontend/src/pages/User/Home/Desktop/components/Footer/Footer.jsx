import styles from "./Footer.module.css";
import logo from "../../../../../../assets/images/logo.png"

const Footer = () => {
return ( <footer className={styles.footer}> <div className={styles.container}> <div className={styles.brand}>
  <div className={styles.logoWrapper}>
    <img src={logo} alt="Nefru Logo" className={styles.logo} />
    <h2>Nefru</h2>
  </div>
      <p>
        Discover Egypt through authentic
        experiences and trusted local guides.
      </p>
    </div>

    <div className={styles.links}>
      <div>
        <h4>Explore</h4>
        <a href="#">Tours</a>
        <a href="#">Destinations</a>
        <a href="#">Guides</a>
      </div>

      <div>
        <h4>Resources</h4>
        <a href="#">Blogs</a>
        <a href="#">FAQ</a>
        <a href="#">Support</a>
      </div>

      <div>
        <h4>Company</h4>
        <a href="#">About</a>
        <a href="#">Contact</a>
        <a href="#">Privacy Policy</a>
      </div>
    </div>
  </div>

  <div className={styles.bottom}>
    <p>
      © 2026 Nefru. All rights reserved.
    </p>
  </div>
</footer>

);
};

export default Footer;
