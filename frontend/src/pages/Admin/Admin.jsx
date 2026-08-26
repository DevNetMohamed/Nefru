import SideBar from './components/Sidebar/Sidebar'
import styles from './Admin.module.css'
import Navbar from './components/Navbar/Navbar'
import AdminErrorBoundary from './components/ErrorBoundary/ErrorBoundary'

import { Outlet } from 'react-router-dom'

export default function Admin() {
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
          <AdminErrorBoundary>
            <Outlet/>
          </AdminErrorBoundary>
        </div>
      </div>
    </div>
  )
}
