import SideBar from './components/Sidebar/Sidebar'
import styles from './Admin.module.css'
import Status from './components/Status/Status'
import Events from './components/Table/Table'
import Navbar from './components/Navbar/Navbar'

import {Outlet, Link} from 'react-router-dom'
import { IoEyeOutline } from "react-icons/io5";
import { IoMdNotificationsOutline } from "react-icons/io";
import {useState }from 'react'

export default function Admin() {
  const [data,setData] = useState()
  return (
    <div className={styles.dashboard}>
      <div className={styles.sidebar}>
        <SideBar />
      </div>
      <div className={styles.body}>
        <div className={styles.navbar}>
          <Navbar/>
        </div>
        <div className={styles.page}>
          <Outlet/>
        </div>
      </div>
    </div>
  )
}
