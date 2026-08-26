import styles from './CMS.module.css'
import Table, { TourItem } from '../../components/Table/Table'
import KpiCard from '../../components/KpiCard/KpiCard'
import { Button } from '../../../../shared/components/Button/Button'
import { useEffect, useMemo, useState } from 'react'
import Icons from '../../../../assets/icons'

import { getTrips, setTripStatus } from '../../api'
import { formatDate } from '../../../../utils/formatters'
import { resolveUploadsUrl } from '../../../../services/api'

const CARD_ACCENTS = {
    total: "#B59441",
    published: "#4E924D",
    unpublished: "#667085",
    review: "#9333ea",
}

const STATE_TABS = [
    { label: "All", value: "all" },
    { label: "Published", value: "published" },
    { label: "Unpublished", value: "unpublished" },
]

export default function CMS() {
    const [selectedState, setSelectedState] = useState("all")
    const [trips, setTrips] = useState(null)

    // Selection tracked by id and resolved against the latest fetched rows,
    // so the side panel updates in place after publish/hide.
    const [selectedId, setSelectedId] = useState(null)
    const selectedTrip = useMemo(
        () => trips?.data?.find((row) => row._id === selectedId) ?? null,
        [trips, selectedId],
    )

    const [page, setPage] = useState(1)
    const [refreshKey, setRefreshKey] = useState(0)

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [actionError, setActionError] = useState("")
    const [busy, setBusy] = useState(false)

    useEffect(() => {
        let active = true

        async function loadTrips() {
            const result = await getTrips(page, selectedState)
            if (!active) return
            if (result.error) {
                setError(result.error)
            } else {
                setTrips(result)
            }
            setLoading(false)
        }

        loadTrips()
        return () => {
            active = false
        }
    }, [selectedState, page, refreshKey])

    const handlePageChange = (newPage) => {
        setPage(newPage)
        setSelectedId(null)
    }

    async function runAction(action) {
        if (!selectedTrip || busy) return
        setBusy(true)
        setActionError("")
        try {
            const result = await setTripStatus(selectedTrip._id, action)
            if (result.error) {
                setActionError(result.error)
            } else {
                // Keep selection; the refetch updates the panel from fresh data.
                setRefreshKey((key) => key + 1)
            }
        } catch (unexpectedError) {
            setActionError(unexpectedError?.message || "Unexpected error, please retry.")
        } finally {
            setBusy(false)
        }
    }

    const isPublished = selectedTrip?.status === "active"
    const stats = trips?.meta?.stats

    return (
        <div className={styles.container}>
            {/* <div className={styles.title}>
                <h2 style={{ fontSize: "32px" }}>Trips &amp; Tours Management</h2>
                <p style={{ fontSize: "14px" }}>Control which tours are published on the Nefru platform.</p>
            </div> */}
            {error ? (
                <p role="alert" style={{ color: "#c2372f", padding: "8px" }}>{error}</p>
            ) : null}
            <div className={styles.cardContainer}>
                <KpiCard label="Total Tours" counter={stats?.total ?? "—"} accent={CARD_ACCENTS.total} />
                <KpiCard label="Published" counter={stats?.published ?? "—"} accent={CARD_ACCENTS.published} />
                <KpiCard label="Unpublished" counter={stats?.unpublished ?? "—"} accent={CARD_ACCENTS.unpublished} />
                <KpiCard label="Awaiting Review" counter={stats?.awaitingReview ?? "—"} accent={CARD_ACCENTS.review} />
            </div>
            <div className={styles.tabs}>
                    {
                        STATE_TABS.map((tab) => (
                            <div
                                className={styles.containerTab}
                                data-state={selectedState === tab.value ? "true" : ""}
                                onClick={() => {
                                    setSelectedState(tab.value)
                                    setPage(1)
                                    setSelectedId(null)
                                }}
                                key={tab.value}
                            >
                                <Button className={styles.tab}>{tab.label}</Button>
                                <p className={styles.count}>
                                    {trips?.meta?.stats
                                        ? tab.value === "all"
                                            ? trips.meta.stats.total
                                            : tab.value === "published"
                                                ? trips.meta.stats.published
                                                : trips.meta.stats.unpublished
                                        : ""}
                                </p>
                            </div>
                        ))
                    }
                </div>
                <div className={styles.info}>
                    <div className={styles.tableArea}>
                        <Table
                            data={trips}
                            item={TourItem}
                            onRowSelect={(row) => setSelectedId(row?._id ?? null)}
                            onPageChange={handlePageChange}
                            isLoading={loading}
                            error={error}
                        />
                    </div>

                    <div className={styles.edit}>
                        {selectedTrip ? (
                            <>
                                <div className={styles.section_1}>
                                    {resolveUploadsUrl(selectedTrip.image) ? (
                                        <img
                                            src={resolveUploadsUrl(selectedTrip.image)}
                                            alt=""
                                            style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover" }}
                                        />
                                    ) : (
                                        <Icons.User />
                                    )}
                                    <p>{selectedTrip.title}</p>
                                </div>
                                <div className={styles.item}>
                                    <p>Location</p>
                                    <p>{selectedTrip.location}</p>
                                </div>
                                <div className={styles.item}>
                                    <p>Category</p>
                                    <p>{selectedTrip.category}</p>
                                </div>
                                <div className={styles.item}>
                                    <p>Price</p>
                                    <p>${selectedTrip.price}</p>
                                </div>
                                <div className={styles.item}>
                                    <p>Rating</p>
                                    <p>{selectedTrip.rating ?? "—"}</p>
                                </div>
                                <div className={styles.item}>
                                    <p>Created at</p>
                                    <p>{formatDate(selectedTrip.createdAt)}</p>
                                </div>
                                <div className={styles.item}>
                                    <p>Visibility</p>
                                    <p className={isPublished ? styles.statusPublished : styles.statusHidden}>
                                        {isPublished ? "Published" : "Unpublished"}
                                    </p>
                                </div>

                                {actionError ? (
                                    <p role="alert" style={{ color: "#c2372f", fontSize: 13 }}>
                                        {actionError}
                                    </p>
                                ) : null}

                                <div className={styles.actions}>
                                    {isPublished ? (
                                        <Button type="outline" onClick={() => runAction("hide")} disabled={busy}>
                                            Hide tour
                                        </Button>
                                    ) : (
                                        <Button Icon={<Icons.CheckCircle />} type="primary" onClick={() => runAction("publish")} disabled={busy}>
                                            Publish tour
                                        </Button>
                                    )}
                                </div>
                            </>
                        ) : (
                            <p className={styles.emptyHint}>Select a tour to manage its visibility.</p>
                        )}
                    </div>
                </div>
        </div>
    )
}
