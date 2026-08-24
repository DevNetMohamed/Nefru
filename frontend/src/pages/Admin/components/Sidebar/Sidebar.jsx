import styles from './Sidebar.module.css';
import {Button} from '../../../../shared/components/Button/Button'
import {useNavigate} from 'react-router-dom'
import {useState, useEffect} from 'react'
import Icons from '../../../../assets/icons'
import Logo from '../../../../assets/logo.png'
export default function SideBar() {
  const Pages = [
    {label:"Dashboard",value:"overview",icon:Icons.Layout},
    {label:"Accounts",value:"accounts",icon:Icons.Users},
    {label:"CMS",value:"cMS",icon:Icons.Copy},
    {label:"Analytics",value:"analytics",icon:Icons.Analytics},
    {label:"Booking",value:"booking",icon:Icons.Book},
  ]
  const [active, setActive] = useState("Overview")
  const navigate = useNavigate()
  function handleSelect(page=""){
    navigate(page.toLowerCase())
    setActive(page)
  }

  useEffect(() => {
      setActive(Pages[0].value)
  },[]);

  return (
    <div className={styles.sidebar}>
      <div className={styles.title}>
        <img src={Logo} />
        <p>Nefru Admin</p>
      </div>
      <div className={styles.items}>

      {Pages.map((page,index)=>(
        <Button
        className={active === page.value?styles.buttonActive:styles.buttonNormal}
        key={index} 
        onClick={()=>handleSelect(page.value)}>
          {/* <page.icon /> */}
          <page.icon />
          
          {/* <Icon>{page.icon}</Icon> */}
          {page.label}
        </Button>
      ))}
      </div>
    </div>
  );
}