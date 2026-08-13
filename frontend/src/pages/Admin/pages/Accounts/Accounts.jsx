import styles from './Accounts.module.css'
import Table,{AccountItem} from '../../components/Table/Table'
import {Button }from '../../../../shared/components/Button/Button'
import {Input }from '../../../../shared/components/Inputs/Inputs'
import {useCallback, useEffect, useState} from 'react'
import Icons from '../../../../assets/icons'
import Form, {FormInput, FormSelect, FormAction} from '../../components/Form/Form'
import { Card , LineChart } from '../../components/Status/Status'

import {getAccount} from '../../api'

export default function Accounts(){
    const [accountTypes, setAccountTypes] = useState([])
    
    const [selectedAccount, setSelectedAccount] = useState();
    const [accounts, setAccounts] = useState([]);

    // the account currently selected in the table (feeds the detail card)
    const [selectedRow, setSelectedRow] = useState(null);
    const [recordsCount, setRecordsCount] = useState()
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
                setRecordsCount(data.meta.totalRecords)
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
                <div className={styles.status}>
                    <div className={styles.cardContainer}>
                        <Card className={styles.statusCard} icon={Icons.ticket} iconColor="#765A08" label="Total Tourists" color="#FFDF97" counter="12" tag="+2 new"/>
                        <Card className={styles.statusCard} icon={Icons.ticket} iconColor="#765A08" label="Tourist Aquisition" color="#FFDF97" counter="12" tag="+2 new"/>
                        <Card className={styles.statusCard} icon={Icons.ticket} iconColor="#765A08" label="Total Guides" color="#FFDF97" counter="12" tag="+2 new"/>
                        <Card className={styles.statusCard} icon={Icons.ticket} iconColor="#765A08" label="Guide Aquisition" color="#FFDF97" counter="12" tag="+2 new"/>
                    </div>
                </div>
                <div className={styles.body}>
                    <div className={styles.section}>
                        <div className={styles.layout}>
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
                                        {selectedAccount === item?<p className={styles.count}>{recordsCount}</p>:<></>}
                                        </div>
                                    ))
                                }
                            </div>
                            <Table
                                data={accounts}
                                item={AccountItem}
                                onRowSelect={setSelectedRow}
                                onPageChange={handlePageChange}
                                />
                        </div>
                        <div className={styles.layout}>
                            <Form>
                                <FormInput title="User Name" placeholder="Enter User Name"/>
                                <FormInput title="Email" placeholder="Enter Email"/>
                                <FormInput title="Role" placeholder="Enter Role"/>
                                <FormInput title="User Name" placeholder="Enter User Name"/>
                                <FormAction title="Verification" placeholder=""/>
                                {/* <FormSelect title="Verification" values={["Pending", "Approved", "Rejected"]}/> */}
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
