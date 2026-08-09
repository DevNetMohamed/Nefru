import styles from './Booking.module.css'
import Table,{AccountItem} from '../../components/Table/Table'
import {Button }from '../../../../shared/components/Button/Button'
import {Input }from '../../../../shared/components/Inputs/Inputs'
import {useCallback, useEffect, useState} from 'react'
import Icons from '../../../../assets/icons'
import Form, {FormInput, FormSelect} from '../../components/Form/Form'
import { Card , LineChart } from '../../components/Status/Status'

import {getAccount} from '../../api'

export default function Booking(){
    const [accountTypes, setAccountTypes] = useState([])
    
    const [selectedAccount, setSelectedAccount] = useState();
    const [accounts, setAccounts] = useState([]);

    // the account currently selected in the table (feeds the detail card)
    const [selectedRow, setSelectedRow] = useState(null);

    // current page for server-side pagination
    const [page, setPage] = useState(1);

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(true)


    const loadUsers = useCallback(async (pageNum = 1) => {
        try {
            let data = {}
            if (selectedAccount) {
                data = await getAccount(selectedAccount, pageNum);
            }else{
                data = await getAccount("tourist", pageNum);
                setSelectedAccount(data.meta.types[0])
            }
            if (!data.error) {
                setAccounts(data)   
                setAccountTypes(data.meta.types)
            }
        } catch (err) {
            if (err.name === "AbortError") return;

            setError(err.message || "Failed to load users.");
        } finally {
            setLoading(false);
        }
    }, [selectedAccount]);

    useEffect(() => {
        const controller = new AbortController();
        loadUsers(page);
        return () => controller.abort();
    }, [loadUsers, page]);

    const handlePageChange = (newPage) => {
        setPage(newPage);
        setSelectedRow(null);
    };

    return(
        <>
            <div className={styles.container}>
                <div className={styles.title}>
                    <h2 style={{fontSize:"32px"}}>Accounts Management</h2>
                    <p style={{fontSize:"14px"}}>Manage accounts status across the Nefru platform.</p>
                </div>
                    
                <div className={styles.status}>
                    <div className={styles.cardContainer}>
                        <Card className={styles.statusCard} icon={Icons.ticket} iconColor="#765A08" label="TOTAL Bookings" color="#FFDF97" counter="12" tag="+2 new"/>
                        <Card className={styles.statusCard} icon={Icons.ticket} iconColor="#765A08" label="TOTAL Bookings" color="#FFDF97" counter="12" tag="+2 new"/>
                        <Card className={styles.statusCard} icon={Icons.ticket} iconColor="#765A08" label="TOTAL Bookings" color="#FFDF97" counter="12" tag="+2 new"/>
                        <Card className={styles.statusCard} icon={Icons.ticket} iconColor="#765A08" label="TOTAL Bookings" color="#FFDF97" counter="12" tag="+2 new"/>
                    </div>
                    <div className={styles.chart}>
                        
                        <LineChart 
                        // x={}
                        points={[1,2,5,5.7,2,3.4]}
                        max={10}
                        step={2}
                        lineColor={"#edae49"}
                        pointColor={"#edae49"}
                        />
                    </div>
                </div>
                <div className={styles.body}>
                    <div className={styles.tabs}>
                        {
                            accountTypes?.map((item,index)=>(
                                <div 
                                className={styles.containerTab} 
                                data-state={selectedAccount === item?"true":""}
                                onClick={() => {
                                    setSelectedAccount(item);
                                    setPage(1);
                                    setSelectedRow(null);
                                }}
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
                    <div className={styles.info}>
                        <div className={styles.table}>
                            <Table
                                data={accounts}
                                item={AccountItem}
                                onRowSelect={setSelectedRow}
                                onPageChange={handlePageChange}
                                />
                        </div>
                        <div className={styles.form}>

                            <Form>
                                <FormInput title="User Name" placeholder="Enter User Name"/>
                                <FormInput title="Email" placeholder="Enter Email"/>
                                <FormInput title="Role" placeholder="Enter Role"/>
                                <FormInput title="User Name" placeholder="Enter User Name"/>
                                <FormSelect title="Verification" values={["Pending", "Approved", "Rejected"]}/>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
