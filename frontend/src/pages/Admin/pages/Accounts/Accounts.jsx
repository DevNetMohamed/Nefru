import styles from './Accounts.module.css'
import Table, { AccountItem } from '../../components/Table/Table'
import { Button } from '../../../../shared/components/Button/Button'
import { useEffect, useMemo, useState } from 'react'
import Icons from '../../../../assets/icons'

import KpiCard from '../../components/KpiCard/KpiCard'

import { getAccount, banUser, unbanUser, deleteUser, reviewGuide } from '../../api'
import { formatDate } from '../../../../utils/formatters'
import { roles as roleStyles } from '../../../../assets/variables'
import { resolveUploadsUrl } from '../../../../services/api'

function initialsOf(text) {
  return String(text || "")
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

const VERIFICATION_PILL_STYLES = {
  approved: { color: "var(--color-active)", backgroundColor: "var(--color-active-mute)" },
  pending: { color: "#8a6d1f", backgroundColor: "#faf3dc" },
  draft: { color: "#667085", backgroundColor: "#eef1f4" },
  rejected: { color: "#c2372f", backgroundColor: "#fdecea" },
}

function verificationPillStyle(value) {
  return VERIFICATION_PILL_STYLES[value] ?? VERIFICATION_PILL_STYLES.draft
}

export default function Accounts() {
  const [accountTypes, setAccountTypes] = useState([])
  const [roleCounts, setRoleCounts] = useState(null)

  const [selectedAccount, setSelectedAccount] = useState("tourist")
  const [accounts, setAccounts] = useState(null)

  // Selection is tracked by id and resolved against the latest fetched rows,
  // so the detail card stays selected AND reflects updates after actions.
  const [selectedId, setSelectedId] = useState(null)
  const selectedRow = useMemo(
    () => accounts?.data?.find((row) => row._id === selectedId) ?? null,
    [accounts, selectedId],
  )

  // current page for server-side pagination
  const [page, setPage] = useState(1)

  // bumped to re-run the fetch after a mutation
  const [refreshKey, setRefreshKey] = useState(0)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [actionError, setActionError] = useState("")
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    let active = true

    async function loadUsers() {
      const result = await getAccount(selectedAccount || "tourist", page)
      if (!active) return
      if (result.error) {
        setError(result.error)
      } else {
        setAccounts(result)
        setAccountTypes(result.meta?.types ?? [])
        setRoleCounts(result.meta?.roleCounts ?? null)
      }
      setLoading(false)
    }

    loadUsers()
    return () => {
      active = false
    }
  }, [selectedAccount, page, refreshKey])

  const handlePageChange = (newPage) => {
    setPage(newPage)
    setSelectedId(null)
  }

  async function runAction(action) {
    if (!selectedRow || busy) return
    setBusy(true)
    setActionError("")
    try {
      const result = await action()
      if (result.error) {
        setActionError(result.error)
      } else {
        // Keep the account selected; the refetch updates the detail card
        // from fresh data. Deleted accounts resolve to null automatically.
        setRefreshKey((key) => key + 1)
      }
    } catch (unexpectedError) {
      // Never leave the buttons stuck disabled if something throws.
      setActionError(unexpectedError?.message || "Unexpected error, please retry.")
    } finally {
      setBusy(false)
    }
  }

  const onBan = () =>
    runAction(() =>
      selectedRow.status === "deactivated" ? unbanUser(selectedRow._id) : banUser(selectedRow._id),
    )
  const onDelete = () => {
    if (window.confirm(`Delete ${selectedRow?.email}? This also removes their trips and bookings.`)) {
      runAction(() => deleteUser(selectedRow._id))
    }
  }
  const onGuideReview = (action) => () => {
    if (action === "reject") {
      const reason = window.prompt("Rejection reason shown to the guide:")
      if (reason === null) return // cancelled
      return runAction(() => reviewGuide(selectedRow._id, "reject", reason))
    }
    return runAction(() => reviewGuide(selectedRow._id, action))
  }

  return (
    <div className={styles.container}>
      <div className={styles.status}>
        <div className={styles.cardContainer}>
          <KpiCard label="Total Tourists" counter={roleCounts?.tourist ?? "—"} accent="#4E924D" />
          <KpiCard label="Total Guides" counter={roleCounts?.guide ?? "—"} accent="#CF9633" />
          <KpiCard label="Total Admins" counter={roleCounts?.admin ?? "—"} accent="#5656df" />
          <KpiCard label="Listed Here" counter={accounts?.meta?.totalRecords ?? "—"} />
        </div>
      </div>
      {error ? (
        <p role="alert" style={{ color: "var(--color-danger)", padding: "8px" }}>{error}</p>
      ) : null}
      <div className={styles.body}>
        <div className={styles.section}>
          <div className={styles.tablePanel}>
            <div className={styles.tabs}>
              {
                accountTypes.map((item) => (
                  <div
                    className={styles.containerTab}
                    data-state={selectedAccount === item ? "true" : ""}
                    onClick={() => {
                      setSelectedAccount(item)
                      setPage(1)
                      setSelectedId(null)
                    }}
                    key={item}
                  >
                    <Button className={styles.tab}>{item}</Button>
                    {/* {selectedAccount === item ? (
                      <p className={styles.count}>{accounts?.meta?.totalRecords ?? ""}</p>
                    ) : null} */}
                  </div>
                ))
              }
            </div>
            <div className={styles.section}>
              <div className={styles.tableArea}>
                <Table
                  data={accounts}
                  item={AccountItem}
                  onRowSelect={(row) => setSelectedId(row?._id ?? null)}
                  onPageChange={handlePageChange}
                  isLoading={loading}
                  error={error}
                />
              </div>
            </div>
          </div>
          <div className={styles.detailColumn}>
            {selectedRow ? (
              <div className={styles.detail}>
                <div className={styles.detailHeader}>
                  <div className={styles.avatarCircle}>
                    {resolveUploadsUrl(selectedRow.avatar) ? (
                      <img src={resolveUploadsUrl(selectedRow.avatar)} alt="" />
                    ) : (
                      initialsOf(selectedRow.fullName || selectedRow.email)
                    )}
                  </div>
                  <div className={styles.detailIdentity}>
                    <p className={styles.detailName}>{selectedRow.fullName || selectedRow.email}</p>
                    <span
                      className={styles.rolePill}
                      style={
                        roleStyles[selectedRow.role]
                          ? {
                              color: roleStyles[selectedRow.role].text,
                              backgroundColor: roleStyles[selectedRow.role].back,
                            }
                          : undefined
                      }
                    >
                      {(selectedRow.role || "â€”").toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className={styles.rows}>
                  <div className={styles.row}>
                    <span className={styles.rowLabel}>Email</span>
                    <span className={styles.rowValue}>{selectedRow.email}</span>
                  </div>
                  <div className={styles.row}>
                    <span className={styles.rowLabel}>Joined</span>
                    <span className={styles.rowValue}>{formatDate(selectedRow.createdAt)}</span>
                  </div>
                </div>

                {actionError ? (
                  <p role="alert" style={{ color: "#c2372f", fontSize: 13, margin: 0 }}>
                    {actionError}
                  </p>
                ) : null}

                {/* Verification badge â€” guides only */}
                {selectedRow.role === "guide" ? (
                  <div className={styles.actionGroup}>
                    <div className={styles.groupHead}>
                      <p className={styles.groupTitle}>Verification badge</p>
                      <span
                        className={styles.pill}
                        style={verificationPillStyle(selectedRow.verificationStatus)}
                      >
                        {selectedRow.verificationStatus ?? "not submitted"}
                      </span>
                    </div>
                    <p className={styles.groupHint}>
                      Controls the verified badge shown on the guide's public profile.
                    </p>
                    <div className={styles.actions}>
                      <Button
                        Icon={<Icons.CheckCircle />}
                        type="primary"
                        onClick={onGuideReview("approve")}
                        disabled={busy}
                      >
                        {selectedRow.verificationStatus === "approved" ? "Re-approve" : "Approve"}
                      </Button>
                      <Button type="outline" onClick={onGuideReview("reject")} disabled={busy}>
                        Reject
                      </Button>
                    </div>
                  </div>
                ) : null}

                {/* Account state â€” every role */}
                <div className={styles.actionGroup}>
                  <div className={styles.groupHead}>
                    <p className={styles.groupTitle}>Account</p>
                    <span
                      className={styles.pill}
                      style={
                        selectedRow.status === "active"
                          ? { color: "var(--color-active)", backgroundColor: "var(--color-active-mute)" }
                          : { color: "#c2372f", backgroundColor: "#fdecea" }
                      }
                    >
                      {selectedRow.status}
                    </span>
                  </div>
                  <p className={styles.groupHint}>
                    {selectedRow.status === "deactivated"
                      ? "This account is banned and cannot sign in."
                      : "Banning blocks sign-in immediately. Deleting removes their data."}
                  </p>
                  <div className={styles.actions}>
                    <Button type="primary" onClick={onBan} disabled={busy}>
                      {selectedRow.status === "deactivated" ? "Unban account" : "Ban account"}
                    </Button>
                    {selectedRow.role !== "admin" ? (
                      <Button type="outline" className={styles.dangerButton} onClick={onDelete} disabled={busy}>
                        Delete
                      </Button>
                    ) : null}
                  </div>
                </div>
              </div>
            ) : (
              <p className={styles.emptyHint}>Select an account to see its details.</p>
            )}
          </div>
        </div>
      </div>
    </div>
    )
}

