import styles from './Accounts.module.css'
import Table,{AccountItem} from '../Table/Table'
import {Button }from '../../../../shared/components/Button/Button'
import {Input }from '../../../../shared/components/Inputs/Inputs'
import {useCallback, useEffect, useState} from 'react'
import Icons from '../../.././../assets/icons'

import {getAccount} from '../../api'

export default function Accounts(){
    const ACCOUNT_TYPES = [
        {label:"Tourist", value:"tourist"},
        {label:"Guide", value:"guide"},
        {label:"Admin", value:"admin"}
    ]
    const [selectedAccount, setSelectedAccount] = useState(ACCOUNT_TYPES[0].label);
    
    
    const [accounts, setAccounts] = useState([]);

    // the account currently selected in the table (feeds the detail card)
    const [selectedRow, setSelectedRow] = useState(null);

    // current page for server-side pagination
    const [page, setPage] = useState(1);

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(true)


    const loadUsers = useCallback(async (pageNum = 1) => {
        try {
            const data = await getAccount(selectedAccount.toLowerCase(), pageNum);
            if (!data.error) setAccounts(data);

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
        setSelectedRow(null); // clear the detail card when moving to another page
    };

    return(
        <>
            <div className={styles.container}>
                <div className={styles.title}>
                    <h2 style={{fontSize:"32px"}}>Accounts Management</h2>
                    <p style={{fontSize:"14px"}}>Manage accounts status across the Nefru platform.</p>
                </div>
                <div className={styles.body}>
                    <div className={styles.tabs}>
                        {
                            ACCOUNT_TYPES.map((item,index)=>(
                                <Button 
                                    className={styles.tab}
                                    type={selectedAccount === item.label?"primary":"normal"}
                                    key={index}
                                    onClick={()=>{setSelectedAccount(item.label); setPage(1);}}>
                                        {item.label}
                                </Button>
                            ))
                        }
                    </div>
                    <div className={styles.info}>
                        <Table
                            data={accounts}
                            item={AccountItem}
                            onRowSelect={setSelectedRow}
                            onPageChange={handlePageChange}
                        />
                        <div className={styles.edit}>
                            {selectedRow ? (
                                <>
                                    <div className={styles.section_1}>
                                        <div className={styles.containerAvatar}>
                                        
                                        {selectedRow.avatar? 
                                            <img className={styles.avatar} src={selectedRow.avatar} /> 
                                            : 
                                            <p>{selectedRow.fullName.split(" ").map(word => word[0]).join("")}</p>
                                        }</div>
                                        <p>{selectedRow.fullName}</p>
                                    </div>
                                    <div className={styles.item}>
                                        <p>Email</p>
                                        <p>{selectedRow.email}</p>
                                    </div>
                                    <div className={styles.item}>
                                        <p>Phone</p>
                                        <p>{selectedRow.phone ?? "—"}</p>
                                    </div>
                                    <div className={styles.item}>
                                        <p>Created at</p>
                                        <p>{selectedRow.createdAt?.split('T')[0] ?? "—"}</p>
                                    </div>
                                    <div className={styles.item}>
                                        <p>Type</p>
                                        <p className={styles.itemTag}>{selectedRow.role ?? "—"}</p>
                                    </div>
                                    <div className={styles.item}>
                                        <p>Status</p>
                                        <p className={styles.status}
                                            style={{
                                            color:"var(--color-active)",backgroundColor:"var(--color-active-mute)"
                                            }}>{selectedRow.verificationStatus ?? "—"}</p>
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
