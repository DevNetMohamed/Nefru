import styles from './Sidebar.module.css';
import {Button} from '../../../../shared/components/Button/Button'
import {useLocation, useNavigate} from 'react-router-dom'
import Icons from '../../../../assets/icons'
import Logo from '../../../../assets/logo.png'

const Pages = [
  {label:"Dashboard",value:"overview",icon:Icons.Layout},
  {label:"Accounts",value:"accounts",icon:Icons.Users},
  {label:"CMS",value:"cms",icon:Icons.Copy},
  {label:"Analytics",value:"analytics",icon:Icons.Analytics},
  {label:"Booking",value:"booking",icon:Icons.Book},
]

export default function SideBar() {
  const navigate = useNavigate()
  const location = useLocation()

  // Derive active item from the URL so deep links and refreshes highlight correctly.
  const activeValue = location.pathname.split("/").filter(Boolean).pop() || Pages[0].value

  function handleSelect(page = "") {
    navigate(`/admin/${page}`)
  }

  return (
    <div className={styles.sidebar}>
      <div className={styles.title}>
        <img src={Logo} alt="Nefru logo" />
        <p>Nefru Admin</p>
      </div>
      <nav className={styles.items} aria-label="Admin sections">
        {Pages.map((page) => (
          <Button
            className={activeValue === page.value ? styles.buttonActive : styles.buttonNormal}
            key={page.value}
            onClick={() => handleSelect(page.value)}
            aria-current={activeValue === page.value ? "page" : undefined}
          >
            <page.icon />
            {page.label}
          </Button>
        ))}
      </nav>
    </div>
  );
}
