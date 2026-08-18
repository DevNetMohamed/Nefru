import styles from './CMS.module.css'
import Table,{TourItem} from '../../components/Table/Table'
import {Button }from '../../../../shared/components/Button/Button'
import {Input }from '../../../../shared/components/Inputs/Inputs'
import {useState, useCallback, useEffect} from 'react'
import Icons from '../../../../assets/icons'

import {getTrips} from '../../api'

export default function CMS(){
    // const users = [
    //     { id: 1, trip: "Cairo Trip", bookings: 245, revenue: 12500, convRate: "8.4", rating: 4.8, status: "active" },
    //     { id: 2, trip: "Luxor Escape", bookings: 189, revenue: 9800, convRate: "7.2", rating: 4.7, status: "active" },
    //     { id: 3, trip: "Nile Cruise", bookings: 320, revenue: 18200, convRate: "10.1", rating: 4.9, status: "suspended" },
    //     { id: 4, trip: "Desert Safari", bookings: 98, revenue: 4300, convRate: "5.8", rating: 4.5, status: "pending" },
    //     { id: 5, trip: "Alex Day Trip", bookings: 156, revenue: 7600, convRate: "6.9", rating: 4.6, status: "active" },
    //     { id: 6, trip: "Siwa Adventure", bookings: 87, revenue: 5100, convRate: "4.9", rating: 4.4, status: "suspended" }
    // ];
    // const [activeTab,setActiveTab] = useState("Tours")
    // // const tabs = ["Tours","Explore"]
    // const [selectedCategory, setselectedCategory] = useState();

    // const [accountTypes, setAccountTypes] = useState([])
    
    const [selectedCategory, setSelectedCategory] = useState();
    const [trips, setTrips] = useState([]);

    // the account currently selected in the table (feeds the detail card)
    const [selectedRow, setSelectedRow] = useState(null);

    // current page for server-side pagination
    const [page, setPage] = useState(1);

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(true)
    
    const loadTrips = useCallback(async (pageNum = 1) => {
        try {
            let data = {}
            if (selectedCategory) {
                data = await getTrips(pageNum);
            }else{
                data = await getTrips(pageNum);
                // setSelectedCategory(data.meta.types[0])
            }
            if (!data.error) {
                setTrips(data)   
                setAccountTypes(data.meta.types)
            }
        } catch (err) {
            if (err.name === "AbortError") return;

            setError(err.message || "Failed to load trips.");
        } finally {
            setLoading(false);
        }
    }, [selectedCategory]);

    useEffect(() => {
        const controller = new AbortController();
        loadTrips(page);
        return () => controller.abort();
    }, [loadTrips]);

    const handlePageChange = (newPage) => {
        setPage(newPage);
        setSelectedRow(null); // clear the detail card when moving to another page
    };
    return(
        <>
            <div className={styles.container}>
                <div className={styles.title}>
                    <h2 style={{fontSize:"32px"}}>Trips & Tours Management</h2>
                    <p style={{fontSize:"14px"}}>Curate and manage authentic travel experiences, pricing, and operational details.</p>
                </div>
                <div className={styles.body}>
                    <div className={styles.tabs}>
                        {
                            selectedCategory?.map((item,index)=>(
                                <div 
                                className={styles.containerTab} 
                                data-state={selectedCategory === item?"true":""}
                                onClick={()=>{setSelectedCategory(item)}}
                                key={index}>
                                <Button 
                                    className={styles.tab}
                                    
                                    >
                                        {item}
                                </Button>
                                <p className={styles.count}>123</p>
                                </div>
                            ))
                        }
                    </div>
                    {/* <div className={styles.tabs}>
                        {
                            tabs.map((item,index)=>(
                                <Button 
                                    type={activeTab === item.label?"primary":"normal"}
                                    key={index}
                                    onClick={()=>setActiveTab(item.label)}>
                                        {item.label}
                                </Button>
                            ))
                        }
                    </div> */}
                    <div className={styles.info}>
                        <Table 
                            data={trips}
                            // headers={trips.meta.headers}
                            item={TourItem}
                            onRowSelect={setSelectedRow}
                            onPageChange={handlePageChange}
                            />
                        
                        <div className={styles.edit}>
                            {selectedRow ? (
                                <>
                                    <div className={styles.section_1}>
                                        <Icons.User/>
                                        <p>Sarah Mahmoud</p>
                                    </div>
                                    <div className={styles.item}>
                                        <p>Email</p>
                                        <p>sarah.m@example.com</p>
                                    </div>
                                    <div className={styles.item}>
                                        <p>Phone</p>
                                        <p>+20 101 223 4455</p>
                                    </div>
                                    <div className={styles.item}>
                                        <p>Created at</p>
                                        <p>May 15, 2025</p>
                                    </div>
                                    <div className={styles.item}>
                                        <p>Joined at</p>
                                        <p>May 14, 2025</p>
                                    </div>
                                    <div className={styles.item}>
                                        <p>Type</p>
                                        <p className={styles.itemTag}>GUIDE</p>
                                    </div>
                                    <div className={styles.item}>
                                        <p>Status</p>
                                        <p className={styles.status}
                                            style={{
                                            color:"var(--color-active)",backgroundColor:"var(--color-active-mute)"
                                            }}>Pending</p>
                                    </div>
                                    
                                    <div className={styles.actions}>
                                        <Button icon={<Icons.CheckCircle/>} type="primary">Approve</Button>
                                        <Button icon={<Icons.circleWrong/>} type="normal">Suspend</Button>
                                    </div>
                                </>
                            ) : (
                                <p className={styles.emptyHint}>Select an account to see its details.</p>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}

