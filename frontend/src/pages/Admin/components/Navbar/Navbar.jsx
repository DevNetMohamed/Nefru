import styles from './Navbar.module.css';
import Icons from '../../../../assets/icons'
import {Link, useLocation } from 'react-router-dom'
import {Button} from '../../../../shared/components/Button/Button'
import {Input} from '../../../../shared/components/Inputs/Inputs'


export default function Navbar({data}) {
  const location = useLocation();

    const getPageTitle = () => {
        switch (location.pathname) {
            case "/admin":
                return "Admin";

            case "/admin/accounts":
                return "Accounts";

            case "/admin/orders":
                return "Orders";

            case "/admin/settings":
                return "Settings";

            default:
                return "Admin";
        }
    };
  return (
    <div className={styles.navbar}>
        <div style={{fontSize:"32px",fontWeight:"500"}}>Dashboard</div>
        <div className={styles.section}>
          <Button className={styles.button}>May 1 - May 31,2024 <Icons.chevronDown/></Button>
          <Button className={styles.button}>Export <Icons.chevronDown/></Button>
          <Button className={styles.iconButton}><Icons.Notification/></Button>
          <Button className={`${styles.iconButton} ${styles.avatar}`}>A</Button>
        </div>
    </div>
  );
}