import styles from "./Guide.module.css";
import { Link, useNavigate } from "react-router-dom";
import Icons from "../../../../assets/icons";

const Guide = () => {
  const navigate = useNavigate();

  return (
    <>
      {/* <p>Guide</p> */}
      <div className={styles.section}></div>
      <div className={styles.section}>
        <div className={styles.profile}>
          <div className={styles.nav}>
            <Icons.ArrowLeft className={styles.navIcon} onClick={() => navigate(-1)} />
            <div style={{ display: "flex", gap: "8px" }}>
              <Icons.share className={styles.navIcon} />
              <Icons.Saved className={styles.navIcon} />
            </div>
          </div>
          <div className="info">
            <h1>Ahmed Mansour</h1>
            <p>Certified Egyptologist • Cairo, Egypt</p>
          </div>
        </div>
      </div>
      <div className={styles.section}>
        <div className={styles.section}>
          <div className={styles.card}>
            <p>4.9</p>
            <p>120 REVIEWS</p>
          </div>
          <div className={styles.card}>
            <p>8+</p>
            <p>YEARS EXP.</p>
          </div>
        </div>
        <div className={styles.card}>
          <p>3</p>
          <p>LANGUAGES</p>
        </div>
      </div>
      <div className={styles.section}>
        <h3>About Me</h3>
        <p>
          Passionate about sharing the hidden secrets of ancient Egypt.
          Specialized in Cairo and Luxor history with over 8 years of
          professional experience. I aim to provide a unique cultural immersion
          beyond the typical tourist paths.
        </p>
      </div>
      {/* tour gallery */}
      <div className={styles.section}>
        
      </div>
      <div className={styles.section}></div>
      {/* <button onClick={() => navigate(-1)}>Go Back</button> */}
    </>
  );
};

export default Guide;
