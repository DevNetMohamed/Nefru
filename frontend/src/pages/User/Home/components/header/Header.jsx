import styles from './Header.module.css'
import {Button} from '../../../../../shared/components/Button/Button'
import { MdOutlineLocationOn , MdSearch } from "react-icons/md";
import { FaRegBell } from "react-icons/fa";
import { Input } from '../../../../../shared/components/Inputs/Inputs'
import {useNavigate} from 'react-router-dom'
export default function 
Header(){
    const navigate = useNavigate();
    return (
        <>
            <div className={styles.header}>
                <div className={styles.left_span}>
                    <div>
                        <Button icon={<MdOutlineLocationOn />}  className={`${styles.icon_button} ${styles.icon_1}`} />
                      
                    </div>
                    <div className={styles.label}>
                        <p>Explore</p>
                        <p>Discover Egypt</p>
                    </div>
                </div>
                <div>
                    <Button icon={<FaRegBell style={{fontSize:"25px"}} />} onClick={() => navigate('/user/notifications')} className={styles.icon_button} />

                </div>
            </div>
            <div className={styles.search}>
                <Input placeholder="Search 'Giza' or 'Luxor'" icon={<MdSearch style={{fontSize:"30px" ,color:"var(--color-text-mute)"}}/>} />
            </div>
        </>
    );
}