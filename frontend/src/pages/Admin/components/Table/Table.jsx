import { useEffect, useState } from "react";
import styles from "./Table.module.css";
import { Button } from "../../../../shared/components/Button/Button";
import Icons from '../../../../assets/icons'
import {status} from '../../../../assets/variables'

export default function Table({
  data = null,
  item: Item,
  onPageChange = () => {},
  onRowSelect = () => {}, // notifies the parent which row was selected
}) {
  const rows = data?.data ?? [];
  const meta = data?.meta ?? {};

  const headers = meta.headers ?? [];
  const pagination = {
    currentPage: meta.currentPage ?? 1,
    totalPages: meta.totalPages ?? 1,
    totalRecords: meta.totalRecords ?? 0,
  };

  // const [paginationView, setPaginationView] = useState([1])
  // let paginationView = [1]
  const [selectedId, setSelectedId] = useState(null);
  const selectId = (id) => setSelectedId(id);
  // -----------------------------------------------------------------------

  function onPrevious() {
    if (pagination.currentPage <= 1) return;
    onPageChange(pagination.currentPage - 1);
  }

  function onNext() {
    if (pagination.currentPage >= pagination.totalPages) return;

    onPageChange(pagination.currentPage + 1);
  }

  const [paginationView, setPaginationView] = useState([1]);

useEffect(() => {
  if (pagination.totalPages <= 1) {
    setPaginationView([1]);
  } else if (pagination.currentPage === pagination.totalPages) {
    setPaginationView([
      pagination.currentPage - 1,
      pagination.currentPage,
    ]);
  } else {
    setPaginationView([
      pagination.currentPage,
      pagination.currentPage + 1,
    ]);
  }
}, [pagination.currentPage, pagination.totalPages]);
  return (
    <div className={styles.container}>
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
                  // Consumed by AccountItem; other items ignore these safely.
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

      <div className={styles.footer}>
        <p>Total records: {pagination.totalRecords}</p>

        <div className={styles.action}>
          <Button
            type="outline"
            className={styles.actionBtn}
            onClick={onPrevious}
            disabled={pagination.currentPage === 1}
          >
            {"< "}Previous
          </Button>

          {/* {Array.from(
            { length: pagination.totalPages },
            (_, i) => i + 1
          ).map((page) => (
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
              {pagination.currentPage}
            </Button>
          ))} */}
          {
            paginationView?.map((page)=>(
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
      </div>
    </div>
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

