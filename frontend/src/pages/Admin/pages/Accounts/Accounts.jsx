<<<<<<< HEAD
import styles from "./Accounts.module.css";
import Table, { AccountItem } from "../../components/Table/Table";
import Status from "../../components/Status/Status";
import { Button } from "../../../../shared/components/Button/Button";
import { Input } from "../../../../shared/components/Inputs/Inputs";
import { useCallback, useEffect, useState } from "react";
import Icons from "../../../../assets/icons";
import Form, {
  FormInput,
  FormSelect,
  FormAction,
} from "../../components/Form/Form";
import { Card, LineChart } from "../../components/Status/Status";
=======
import styles from './Accounts.module.css'
import Table,{AccountItem} from '../../components/Table/Table'
import {Button }from '../../../../shared/components/Button/Button'
import {Input }from '../../../../shared/components/inputs/inputs'
import {useCallback, useEffect, useState} from 'react'
import Icons from '../../../../assets/icons'
import Form, {FormInput, FormSelect, FormAction} from '../../components/Form/Form'
import { Card , LineChart } from '../../components/Status/Status'
>>>>>>> 876106d4a5a2ebc2e5dbf16864c90247d47ed8b1

import { getAccountByRole,getAccount } from "../../api";

export default function Accounts() {
  const [accountTypes, setAccountTypes] = useState([]);

  const [selectedAccount, setSelectedAccount] = useState();
  const [accounts, setAccounts] = useState([]);

  // the account currently selected in the table (feeds the detail card)
  const [selectedRow, setSelectedRow] = useState(null);
  const [recordsCount, setRecordsCount] = useState();

  const [pageData, setPageData] = useState();
  // current page for server-side pagination
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(true);

  const loadUsers = useCallback(
    async (pageNum = 1) => {
      try {
        let data = {};
        if (selectedAccount) {
          data = await getAccountByRole(selectedAccount, pageNum);
        } else {
          data = await getAccountByRole("tourist", pageNum);
          setSelectedAccount(data.meta.types[0]);
        }
        if (!data.error) {
          setAccounts(data);
          setAccountTypes(data.meta.types);
          setRecordsCount(data.meta.totalRecords);
        }
      } catch (err) {
        if (err.name === "AbortError") return;

        setError(err.message || "Failed to load users.");
      } finally {
        setLoading(false);
      }
    },
    [selectedAccount],
  );

  useEffect(() => {
    const controller = new AbortController();
    loadUsers(page);
    return () => controller.abort();
  }, [loadUsers, page]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
    setSelectedRow(null);
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.status}>
          <Status />
        </div>
        <div className={styles.body}>
          <div className={styles.section}>
            <div className={styles.layout}>
              {accountTypes?.map((item, index) => (
                <div
                  className={styles.containerTab}
                  data-state={selectedAccount === item ? "true" : ""}
                  onClick={() => {
                    setSelectedAccount(item);
                    setPage(1);
                    setSelectedRow(null);
                  }}
                  key={index}
                >
                  <Button className={styles.tab}>{item}</Button>
                  {selectedAccount === item ? (
                    <p className={styles.count}>{recordsCount}</p>
                  ) : (
                    <></>
                  )}
                </div>
              ))}

              <Table
                data={accounts}
                item={AccountItem}
                onRowSelect={setSelectedRow}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
