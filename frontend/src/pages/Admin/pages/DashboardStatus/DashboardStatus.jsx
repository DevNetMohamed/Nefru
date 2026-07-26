import styles from './DashboardStatus.module.css'

import Status from '../../components/Status/Status'
import Table, {TourItem} from '../../components/Table/Table'
import {LineChart} from '../../components/Status/Status'
import Icons from '../../../../assets/icons'
import {useEffect, useState, useCallback} from 'react'

import {getAccount, getTrips} from '../../api'

export default function DashboardStatus(){
    const [tours, setTrips] = useState([]);
    const [selectedRow, setSelectedRow] = useState(null);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(true)

    const loadTrips = useCallback(async (pageNum = 1) => {
        try {
            const data = await getTrips("tours", pageNum);
            if (!data.error) setTrips(data);

        } catch (err) {
            if (err.name === "AbortError") return;

            setError(err.message || "Failed to load tours");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const controller = new AbortController();
        loadTrips(page);
        return () => controller.abort();
    }, [loadTrips, page]);

    const handlePageChange = (newPage) => {
        setPage(newPage);
        setSelectedRow(null); // clear the detail card when moving to another page
    };

    return(
        <>
        <div className={styles.container}>
            <div className={styles.header}>
                <h2 style={{fontSize:"32px"}}>Dahsboard Overview</h2>
                <p style={{fontSize:"14px"}}>Real-time insights and key metrics for the Nefru tourism platform</p>
            </div>
            <div className={styles.status}>
                <Status/>
            </div>
            <div className={styles.body}>
                <div className={styles.section}>
                    <div className={styles.layout}>
                            <LineChart/>
                    </div>
                    <div className={styles.layout}>
                        <Table
                            data={tours}
                            item={TourItem}
                            onRowSelect={setSelectedRow}
                            onPageChange={handlePageChange}
                        />
                    </div>
                </div>
                <div className={styles.section}>
                    <div className={styles.layout}>
                        <List title="Pending Approvals">
                            <PendingItem info="Guide application approval" name="Sarah Mahmoud" tag="Guide" duration="1d ago"/>
                        </List>
                    </div>
                    <div className={styles.layout}>
                        <List title="Pending Approvals">
                            <PendingItem info="Guide application approval" name="Sarah Mahmoud" tag="Guide" duration="1d ago"/>
                        </List>
                    </div>
                </div>
            </div>

        </div>
        </>
    )
}

function List({title="",children}){
    return(
        <>
        <div className={styles.layout}>
            <div className={styles.layoutTitle}>
                <p>{title}</p>
                <p>View all</p>
            </div>
            <div className={styles.listBody}>
                {children}
            </div>
        </div>
        </>
    )
}

function PendingItem({info, name, tag, duration}){
    const states = [
        {icon:'',color:''}
    ]
    return(
        <>
        <div className={styles.itemContainer}>
            <div className={styles.itemInfo}>
                <div className={styles.itemAvatar}>
                    <Icons.Profile/>
                </div>
                <div className={styles.itemLable}>
                    <p>{info}</p>
                    <p>{name}</p>
                </div>
                <div 
                    className={styles.itemTag}
                    style={{backgroundColor:"var(--color-secondary)"}}>
                        <p>{tag}</p>
                </div>
            </div>
            <div className={styles.itemAction}>
                <p>{duration}</p>
                <Icons.ArrowRight/>
            </div>
        </div>
        </>
    )
}

function LogItem(){
    return(
        <>
        <div className={styles.itemContainer}>
            <div className={styles.itemInfo}>
                <div className={styles.itemAvatar}>
                    <Icons.Profile/>
                </div>
                <div className={styles.itemLable}>
                    <p>New Guide Application</p>
                    <p>Ahmed Mansour</p>
                </div>
                <div className={styles.itemTag}><p>Guide</p></div>
            </div>
            <div className={styles.itemAction}>
                <p>1d ago</p>
                <Icons.ArrowRight/>
            </div>
        </div>
        </>
    )
}