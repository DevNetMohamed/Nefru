import styles from './DashboardStatus.module.css'

import Status from '../../components/Status/Status'
import Table, {TopTourItem} from '../../components/Table/Table'
import {LineChart} from '../../components/Status/Status'
import Icons from '../../../../assets/icons'
import {useEffect, useState, useCallback} from 'react'
import { DoughnutChart } from '../../components/charts/charts'

import {getAccount, getTrips, getDashboard} from '../../api'

export default function DashboardStatus(){
    const [tours, setTrips] = useState([]);
    const [dashboard, setDashboard] = useState({})
    const [selectedRow, setSelectedRow] = useState(null);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(true)

    const loadTrips = useCallback(async (pageNum = 1) => {
        try {
            const data = await getDashboard();
            if (!data.error) setDashboard(data.data);
        } catch (err) {
            if (err.name === "AbortError") return;
            setError(err.message || "Failed to load dashboard");
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
        setSelectedRow(null);
    };

    return(
        <>
        <div className={styles.container}>
            <div className={styles.status}>
                <Status data={dashboard.cards}/>
            </div>
            <div className={styles.body}>
                <div className={styles.section}>
                    {dashboard?.charts?.map((item,index)=>(
                        <div key={index} className={`${styles.layout} ${styles.chart}`}>
                            <p style={{fontWeight:"500",fontSize:"18px", width:"fit-content"}}>{item.title}</p>
                            {(()=>{
                                switch (item.type){
                                    case "DoughnutChart":return <DoughnutChart  dataSet={item.data}/>;
                                    case "LineChart":return <LineChart/>;
                                    default:<></>
                                }
                            })()}
                        </div>
                    ))}
                </div>
                <div className={styles.section}>
                    <div className={styles.layout} style={{padding:"20px"}}>
                        <Table
                            title="Top Tours"
                            data={dashboard.topTours}
                            item={TopTourItem}
                            onRowSelect={setSelectedRow}
                            onPageChange={handlePageChange}
                            // isPagination={false}
                        />
                    </div>
                    <div className={`${styles.layout} ${styles.list}`}>
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
        <div className={styles.listLayout}>
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
            <div className={styles.itemAction}>
                <p>{duration}</p>
                <Icons.chevronRight/>
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