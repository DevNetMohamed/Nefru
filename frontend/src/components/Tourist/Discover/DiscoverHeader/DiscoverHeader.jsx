import styles from "../DiscoverHeader/DiscoverHeader.module.css" ;
import { IoArrowBack } from "react-icons/io5";
import { LuSlidersHorizontal } from "react-icons/lu";
import { useNavigate } from "react-router-dom";


function DiscoverHeader({searchQuery,setSearchQuery}) {
    const navigate = useNavigate();

    return (

        <div className={styles.header}>

            <button className={styles.backButton} onClick={() => navigate(-1)}>                <IoArrowBack />
 </button>

            <input
                className={styles.searchInput}
                type="text"
                placeholder="Search 'Giza' or 'Luxor'"
                value={searchQuery}
                onChange={(e) =>
                    setSearchQuery(e.target.value)
                }
            />
            <button className={styles.filterButton}>                <LuSlidersHorizontal />

 </button>

        </div>
    )
}

export default DiscoverHeader;