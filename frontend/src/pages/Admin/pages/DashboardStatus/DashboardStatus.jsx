import styles from './DashboardStatus.module.css'

import Status, { LineChart } from '../../components/Status/Status'
import Table, { TopTourItem } from '../../components/Table/Table'
import { DoughnutChart } from '../../components/charts/charts'

import { useEffect, useState } from 'react'

import { getDashboard } from '../../api'

export default function DashboardStatus() {
  const [dashboard, setDashboard] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    let active = true

    async function load() {
      setLoading(true)
      setError("")
      const result = await getDashboard()
      if (!active) return
      if (result.error) {
        setError(result.error)
      } else if (result.data) {
        setDashboard(result.data)
      } else {
        // Backend error fallback shape (no cards/charts/topTours).
        setError("Dashboard data is unavailable right now.")
      }
      setLoading(false)
    }

    load()
    return () => {
      active = false
    }
  }, [])

  return (
    <div className={styles.container}>
      {error ? (
        <div className={styles.status} role="alert">
          <p style={{ color: "var(--color-danger)", padding: "12px" }}>{error}</p>
        </div>
      ) : null}
      <div className={styles.status}>
        <Status data={dashboard?.cards ?? []} isLoading={loading} />
      </div>
      <div className={styles.body}>
        <div className={styles.section}>
          {(dashboard?.charts ?? []).map((item, index) => (
            <div key={index} className={`${styles.layout} ${styles.chart}`}>
              <p style={{ fontWeight: "500", fontSize: "18px", width: "fit-content" }}>
                {item.title}
              </p>
              {item.type === "DoughnutChart" ? (
                <DoughnutChart dataSet={item.data} />
              ) : item.type === "LineChart" ? (
                <LineChart data={item.data} />
              ) : null}
            </div>
          ))}
        </div>
        <div className={styles.section}>
          <div className={styles.layout} style={{ padding: "20px" }}>
            <Table
              title="Top Tours"
              data={dashboard?.topTours ?? null}
              item={TopTourItem}
              isPagination={false}
              isLoading={loading && !dashboard}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
