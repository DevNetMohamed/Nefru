import styles from "./DesktopNavbar.module.css";
import { LogOut, User, Heart, Calendar, Settings , Bell} from "lucide-react";
import logo from "../../../../../assets/images/logo.png";
import { useState } from "react";
import profileImage from "../../../../../assets/images/user/user1.png";



function DesktopNavbar() {


  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);


  return (
    <nav className={styles.navbar}>
      {/* Logo */}
      <div className={styles.logo}>
        <img src={logo} alt="Nefru Logo" />
          <span>  Nefru</span>

        </div>

      {/* Search */}
      {/* <div className={styles.searchBox}>
        <input
          type="text"
          placeholder="Search experiences..."
        />
      </div> */}

      {/* Navigation Links */}
      <ul className={styles.links}>
        <li>
          <a href="#Home">
            Home
          </a>
        </li>
        
        <li>
          <a href="#popular-tours">
            Tours
          </a>
        </li>

        <li>
          <a href="#explore-egypt">
            Explore Egypt
          </a>
        </li>


        <li>
          <a href="#top-guides">
            Guides
          </a>
        </li>

        
      </ul>

      {/* Actions */}
      <div className={styles.actions}>

{/* Notifiction Bell with Dropdown */}
      <div className={styles.notificationWrapper}>
        <Bell size={20} onClick={() => setShowNotifications(!showNotifications)}/>

        {showNotifications && (
          <div className={styles.dropdown}>
            ...
          </div>
        )}
      </div>


        {/* <Heart size={20} /> */}


        <div className={styles.profileWrapper}>
              <User
                size={20}
                onClick={() =>
                  setShowProfile(!showProfile)
                }
              />

              {showProfile && (
                      <div className={styles.dropdown}>
                        
                        <div className={styles.profileHeader}>
                          <img
                            src={profileImage}
                            alt="Profile"
                          />

                          <div>
                            <h4>Ahmed Kamal</h4>
                            <span>ahmed@email.com</span>
                          </div>
                        </div>

                        <div className={styles.divider}></div>

                        <div className={styles.dropdownItem}>
                          <User size={16} />
                          <span>My Profile</span>
                        </div>

                        <div className={styles.dropdownItem}>
                          <Calendar size={16} />
                          <span>My Bookings</span>
                        </div>

                        <div className={styles.dropdownItem}>
                          <Heart size={16} />
                          <span>Saved Tours</span>
                        </div>

                        <div className={styles.dropdownItem}>
                          <Settings size={16} />
                          <span>Settings</span>
                        </div>

                        <div className={styles.divider}></div>

                        <button className={styles.logoutBtn}>
                          <LogOut size={16} />
                          Logout
                        </button>

                      </div>
                    )}
            </div>
      </div>
    </nav>
  );
}

export default DesktopNavbar;