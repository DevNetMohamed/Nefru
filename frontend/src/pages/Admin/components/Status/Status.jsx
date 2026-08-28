import styles from "./Status.module.css";
import Icons from '../../../../assets/icons'

import { formatNumber } from '../../../../utils/formatters'

export default function Status({data=[], isLoading=false}) {
  if (isLoading && data.length === 0) {
    return (
      <div className={styles.container}>
        {[0, 1, 2, 3].map((index) => (
          <div key={index} className={styles.card} aria-hidden="true">
            <p className={styles.title}>…</p>
            <div className={styles.counter}>
              <p>—</p>
            </div>
          </div>
        ))}
      </div>
    );
  }
  return (
    <>
      <div className={styles.container}>
          {
            data.map((item,index)=>(
              <Card key={index} title={item.title} counter={formatNumber(item.counter)} rate={item.rate} rateStatus={item.rateStatus} duration={item.duration}/>
            ))
          }
      </div>
    </>
  );
}

export function Card({ title, counter, rate, rateStatus = "UP", duration, className }) {
  const statusStylesMap = {
    "UP": { icon:Icons.arrowUp,color: "green" },
    "DOWN": { icon:Icons.arrowDown,color: "red" },
    "NORMAL": { icon:Icons.arrowUp,color: "gray" }
  };
  const hasRate = rate !== undefined && rate !== null && rate !== "";
  const currentStyle = statusStylesMap[rateStatus] || {icon:Icons.ArrowRight, color: "black" };
  const Icon = currentStyle.icon
  return (
    <div className={`${className} ${styles.card}`}>
      <p className={styles.title}>{title}</p>
      <div className={styles.counter}>
        <p>{counter}</p>
        {hasRate ? (
          <div className={styles.rate}>
            <Icon style={{ color:currentStyle.color, fontSize:"20px"}} color="green"/>
            <p style={{ color: currentStyle.color, fontWeight: 500 }}>
              {rate}
            </p>
          </div>
        ) : null}
      </div>
      {duration ? (
        <p style={{ fontSize: "12px", color: "#888" }}>{duration}</p>
      ) : null}
    </div>
  );
}
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

const SERIES_COLORS = ["#5656df", "#db7d11", "#4E924D"];

// Expects API-shaped chart data: { labels: string[], datasets: [{label, values}] }
export function LineChart({ data }) {
  const hasData = Boolean(data?.labels?.length && data?.datasets?.length);

  const chartData = {
    labels: hasData ? data.labels : [],
    datasets: hasData
      ? data.datasets.map((series, index) => ({
          label: series.label,
          data: series.values,
          borderColor: SERIES_COLORS[index % SERIES_COLORS.length],
          backgroundColor: SERIES_COLORS[index % SERIES_COLORS.length],
          tension: 0.4,
          borderWidth: 3,
          pointRadius: 4,
        }))
      : [],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: {
        position: "top",
        align: "end",

        labels: {
          usePointStyle: true,
          pointStyle: "rect",
          boxWidth: 10,
          color: "#111827",

          font: {
            size: 12,
            weight: "bold",
          },
        },
      },
    },

    scales: {
      x: {
        grid: {
          display: false,
        },

        ticks: {
          color: "#374151",
          maxTicksLimit: 10,
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
          color: "#9CA3AF",
        },

        grid: {
          color: "#E5E7EB",
        },
      },
    },
  };

  return (
    <div>
      {hasData ? (
        <div className={styles.chart}>
          <Line data={chartData} options={options} />
        </div>
      ) : (
        <p style={{ color: "#888", padding: "24px" }}>No booking data for this period yet.</p>
      )}
    </div>
  );
}