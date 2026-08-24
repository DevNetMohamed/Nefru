import { useEffect, useState } from "react";
import styles from "./Table.module.css";
import { Button } from "../../../../shared/components/Button/Button";
import Icons from '../../../../assets/icons'
import {status} from '../../../../assets/variables'

import {formatDate} from '../../../../utils/formatters'

export default function Table({
  title="",
  data = null,
  isPagination=true,
  item: Item,
  onPageChange = () => {},
  onRowSelect = () => {},
}) {
  const rows = data?.data ?? [];
  const meta = data?.meta ?? {};
  const headers = meta.headers ?? [];
  const pagination = {
    currentPage: meta.currentPage ?? 1,
    totalPages: meta.totalPages ?? 1,
    totalRecords: meta.totalRecords ?? 0,
    pagingView:meta.pagingView ?? [1],
    recordsCount:meta.recordsCount ?? 0
  };
  const [selectedId, setSelectedId] = useState(null);
  const selectId = (id) => setSelectedId(id);

  function onPrevious() {
    if (pagination.currentPage <= 1) return;
    onPageChange(pagination.currentPage - 1);
  }

  function onNext() {
    if (pagination.currentPage >= pagination.totalPages) return;
    onPageChange(pagination.currentPage + 1);
  }
  return (
    <div className={styles.container}>
      <div className="s">
        <p>{title}</p>
      </div>
      <div className={styles.tableScroll}>
        <table className={styles.table}>
          <thead className={styles.tableHead}>
            <tr>
              <th></th>
              {headers.map((header) => (
                <th
                  key={header}
                  className={styles.tableHeadItem}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.length > 0 ? (
              rows.map((row) => (
                <Item
                  key={row._id}
                  data={row}
                  selected={selectedId === row._id}
                  onSelect={() => {
                    selectId(row._id);
                    onRowSelect(row);
                  }}
                />
              ))
            ) : (
              <tr>
                <td style={{display:"flex",justifyContent:"center"}}>
                  No data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isPagination?(<div className={styles.footer}>
        <p>showing page {pagination.currentPage} of {pagination.totalPages}</p>

        <div className={styles.action}>
          <Button
            type="outline"
            className={styles.actionBtn}
            onClick={onPrevious}
            disabled={pagination.currentPage === 1}
          >
            {"< "}Previous
          </Button>
          {
            pagination.pagingView?.map((page)=>(
              <Button
              key={page}
              type={
                page === pagination.currentPage
                  ? "primary"
                  : "outline"
              }
              className={styles.actionBtn}
              onClick={() => onPageChange(page)}
            >
              {page}
            </Button>
            ))
          }
          <Button
            type="outline"
            className={styles.actionBtn}
            onClick={onNext}
            disabled={
              pagination.currentPage === pagination.totalPages
            }
          >
            Next{" >"}
          </Button>
        </div>
      </div>):<></>}
    </div>
  );
}
export function TopTourItem({ data, selected, onSelect}) {
  return (
    <tr className={styles.item}>
      <td></td>
      <td>
        <img src={data.image}/>
      </td>
      <td>
        <p>{data.title}</p>
      </td>
      <td>{data.location}</td>
      <td>
        <div className={styles.rate}>
          <Icons.star /> {data.rating}
        </div>
      </td>
      <td>{formatDate(data.createdAt)}</td>
    </tr>
  );
}


export function TourItem({ data, selected, onSelect}) {
  return (
    <tr
      className={`${styles.item} ${selected ? styles.selectedRow : ""}`}
      onClick={onSelect}>
      <td>
        <input
          type="radio"
          name="account-row"
          checked={selected}
          onChange={(e) => {
            // Prevent the radio click from also bubbling to the row handler.
            e.stopPropagation();
            onSelect();
          }}
        />
      </td>
      <td>
        <div className={styles.containerAccount}>
          <div className={styles.avatar}>
            {data.avatar? 
              <img className={styles.avatarImg} src={data.avatar} /> 
              : 
              <p>{data.title.split(" ").map(word => word[0]).join("")}</p>}
          </div>
          <p>{data.title}</p>
        </div>
      </td>
      <td>{data.location}</td>
      <td>
        <div
          className={styles.status}
          style={{
            // backgroundColor: status[data.status].back,
            // color: status[data.status].text,
            // border: `1px solid ${status[data.status].text}`,
          }}
        >
          {data.status}
        </div>
      </td>
      <td>
        <div className={styles.rate}>
          <Icons.star /> {data.rating}
        </div>
      </td>
    </tr>
  );
}

export function AccountItem({ data, selected, onSelect }) {
  return (
    <tr
      className={`${styles.item} ${selected ? styles.selectedRow : ""}`}
      onClick={onSelect}
    >
      <td>
        <input
          type="radio"
          name="account-row"
          checked={selected}
          onChange={(e) => {
            // Prevent the radio click from also bubbling to the row handler.
            e.stopPropagation();
            onSelect();
          }}
          className={styles.radio}
        />
      </td>
      <td>
        <div className={styles.containerAccount}>
          <div className={styles.avatar}>
            {data.avatar? 
              <img className={styles.avatarImg} src={data.avatar} /> 
              : 
              <p>{data.fullName.split(" ").map(word => word[0]).join("")}</p>}
          </div>
          <p>{data.fullName}</p>
        </div>
      </td>
      <td>{data.email}</td>
      <td>{data.createdAt.split('T')[0]}</td>
    </tr>
  );
}

