import styles from './DashboardStatus.module.css'

import Status from '../../components/Status/Status'
import Table, {TourItem} from '../../components/Table/Table'
import {LineChart} from '../../components/Status/Status'
import Icons from '../../../../assets/icons'
import {useEffect, useState, useCallback} from 'react'

import {getAccount, getTrips} from '../../api'

export default function DashboardStatus(){
    // const tours = [
    //     { id: 1, tour: "Cairo Tour", bookings: 245, revenue: 12500, convRate: "8.4", rating: 4.8, status: "active" },
    //     { id: 2, tour: "Luxor Escape", bookings: 189, revenue: 9800, convRate: "7.2", rating: 4.7, status: "active" },
    //     { id: 3, tour: "Nile Cruise", bookings: 320, revenue: 18200, convRate: "10.1", rating: 4.9, status: "suspended" },
    //     { id: 4, tour: "Desert Safari", bookings: 98, revenue: 4300, convRate: "5.8", rating: 4.5, status: "pending" },
    //     { id: 5, tour: "Alex Day Trip", bookings: 156, revenue: 7600, convRate: "6.9", rating: 4.6, status: "active" },
    //     { id: 6, tour: "Siwa Adventure", bookings: 87, revenue: 5100, convRate: "4.9", rating: 4.4, status: "suspended" }
    // ];


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
            <div className={styles.title}>
                <h2 style={{fontSize:"32px"}}>Dahsboard Overview</h2>
                <p style={{fontSize:"14px"}}>Real-time insights and key metrics for the Nefru tourism platform</p>
            </div>
            <div className={styles.status}>
                <Status/>
                <div className={styles.section_1}>
                    <div className={styles.chart}>
                        <LineChart/>
                    </div>
                    <List title="Pending Approvals">
                        <PendingItem info="Guide application approval" name="Sarah Mahmoud" tag="Guide" duration="1d ago"/>
                    </List>
                </div>
                <div className={styles.section_2}>
                    <div className={styles.chart}>
                        <Table
                            data={tours}
                            item={TourItem}
                            onRowSelect={setSelectedRow}
                            onPageChange={handlePageChange}
                        />
                    </div>
                    <List title="Recent System Logs"/>
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