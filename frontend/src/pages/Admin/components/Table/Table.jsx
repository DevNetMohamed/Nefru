import { useState } from "react";
import styles from "./Table.module.css";
import { Button } from "../../../../shared/components/Button/Button";
import Icons from '../../../../assets/icons'
import { status as statusStyles, roles as roleStyles } from '../../../../assets/variables'

import { formatDate } from '../../../../utils/formatters'
import { resolveUploadsUrl } from '../../../../services/api'

function initialsOf(text) {
  return String(text || "")
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function rowKeyDown(onSelect) {
  return (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelect();
    }
  };
}

const PILL_FALLBACK = { text: "#344054", back: "#eef1f4" };

function StatusPill({ value, label }) {
  const style = statusStyles[value] || roleStyles[value] || PILL_FALLBACK;
  return (
    <div
      className={styles.status}
      style={{
        color: style.text,
        backgroundColor: style.back,
        border: `1px solid ${style.text}`,
      }}
    >
      {label || value || "—"}
    </div>
  );
}

export default function Table({
  title = "",
  data = null,
  isPagination = true,
  item: Item,
  onPageChange = () => {},
  onRowSelect = () => {},
  isLoading = false,
  error = "",
}) {
  const rows = data?.data ?? [];
  const meta = data?.meta ?? {};
  const headers = meta.headers ?? [];
  const pagination = {
    currentPage: meta.currentPage ?? 1,
    totalPages: meta.totalPages ?? 1,
    totalRecords: meta.totalRecords ?? 0,
    pagingView: meta.pagingView ?? [1],
    recordsCount: meta.recordsCount ?? 0,
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
              <th scope="col"></th>
              {headers.map((header) => (
                <th key={header} scope="col" className={styles.tableHeadItem}>
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={headers.length + 1} style={{ textAlign: "center", padding: "24px" }}>
                  Loading…
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={headers.length + 1} style={{ textAlign: "center", padding: "24px", color: "var(--color-error, #b00)" }}>
                  {error}
                </td>
              </tr>
            ) : rows.length > 0 ? (
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
                <td colSpan={headers.length + 1} style={{ textAlign: "center", padding: "24px" }}>
                  No data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isPagination && !isLoading && !error ? (
        <div className={styles.footer}>
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
            {pagination.pagingView?.map((page) => (
              <Button
                key={page}
                type={page === pagination.currentPage ? "primary" : "outline"}
                className={styles.actionBtn}
                onClick={() => onPageChange(page)}
              >
                {page}
              </Button>
            ))}
            <Button
              type="outline"
              className={styles.actionBtn}
              onClick={onNext}
              disabled={pagination.currentPage === pagination.totalPages}
            >
              Next{" >"}
            </Button>
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}

export function TopTourItem({ data }) {
  const imgSrc = resolveUploadsUrl(data.image);
  return (
    <tr className={styles.item}>
      <td></td>
      <td>
        <div className={styles.thumb}>
          {imgSrc ? (
            <img className={styles.thumbImg} src={imgSrc} alt="" />
          ) : (
            <span>{initialsOf(data.title)}</span>
          )}
        </div>
      </td>
      <td>
        <p>{data.title}</p>
      </td>
      <td>{data.location}</td>
      <td>
        <div className={styles.rate}>
          <Icons.star /> {data.rating ?? "—"}
        </div>
      </td>
      <td>{formatDate(data.createdAt)}</td>
    </tr>
  );
}

export function TourItem({ data, selected, onSelect }) {
  return (
    <tr
      className={`${styles.item} ${selected ? styles.selectedRow : ""}`}
      onClick={onSelect}
      onKeyDown={rowKeyDown(onSelect)}
      tabIndex={0}
      aria-selected={selected}
    >
      <td>
        <input
          type="radio"
          name="tour-row"
          aria-label={`Select tour ${data.title}`}
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
            {resolveUploadsUrl(data.image) ? (
              <img className={styles.avatarImg} src={resolveUploadsUrl(data.image)} alt="" />
            ) : (
              <p>{initialsOf(data.title)}</p>
            )}
          </div>
          <p>{data.title}</p>
        </div>
      </td>
      <td>{data.location}</td>
      <td>
        <StatusPill value={data.status} />
      </td>
      <td>
        <div className={styles.rate}>
          <Icons.star /> {data.rating ?? "—"}
        </div>
      </td>
    </tr>
  );
}

export function AccountItem({ data, selected, onSelect }) {
  const displayName = data.fullName || data.email || "Unknown account";
  const joined = data.createdAt ? String(data.createdAt).split("T")[0] : "—";
  return (
    <tr
      className={`${styles.item} ${selected ? styles.selectedRow : ""}`}
      onClick={onSelect}
      onKeyDown={rowKeyDown(onSelect)}
      tabIndex={0}
      aria-selected={selected}
    >
      <td>
        <input
          type="radio"
          name={`account-row-${data.role || "list"}`}
          aria-label={`Select account ${displayName}`}
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
            {resolveUploadsUrl(data.avatar) ? (
              <img className={styles.avatarImg} src={resolveUploadsUrl(data.avatar)} alt="" />
            ) : (
              <p>{initialsOf(displayName)}</p>
            )}
          </div>
          <p>{displayName}</p>
        </div>
      </td>
      <td>{data.email}</td>
      <td>{joined}</td>
      {data.role === "guide" ? (
        <td>
          <StatusPill value={data.verificationStatus} label={data.verificationStatus ?? "not submitted"} />
        </td>
      ) : null}
      <td>
        <StatusPill value={data.status} />
      </td>
    </tr>
  );
}

const BOOKING_STATUS_LABELS = {
  pending_payment: "Pending payment",
  no_show: "No-show",
};

export function BookingItem({ data, selected }) {
  const when = data.slotDate ? `${data.slotDate}${data.timeSlot ? ` · ${data.timeSlot}` : ""}` : "—";
  return (
    <tr className={`${styles.item} ${selected ? styles.selectedRow : ""}`}>
      <td></td>
      <td>
        <div className={styles.containerAccount}>
          <div className={styles.avatar}>
            {resolveUploadsUrl(data.tripImage) ? (
              <img className={styles.avatarImg} src={resolveUploadsUrl(data.tripImage)} alt="" />
            ) : (
              <p>{initialsOf(data.tripTitle)}</p>
            )}
          </div>
          <p>{data.tripTitle}</p>
        </div>
      </td>
      <td>{data.touristEmail}</td>
      <td>{data.guideEmail}</td>
      <td>{when}</td>
      <td>{data.numberOfGuests}</td>
      <td>{data.currency === "USD" ? "$" : ""}{data.totalPrice}</td>
      <td>
        <StatusPill
          value={data.status}
          label={BOOKING_STATUS_LABELS[data.status] || data.status}
        />
      </td>
    </tr>
  );
}
