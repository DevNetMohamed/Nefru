import Header from "../components/header/Header";
import Body from "../components/body/Body";
import styles from "../Home.module.css";

const MobileHome = () => {
  return (
    <div className={styles.container}>
      <Header />
      <Body />
    </div>
  );
};

export default MobileHome;