import styles from "./Status.module.css";
import Icons from '../../../../assets/icons'
import { FaRegCalendarCheck } from "react-icons/fa";
import { LuTicket } from "react-icons/lu";
import { BsCashStack } from "react-icons/bs";
import { RiCalendarScheduleLine } from "react-icons/ri";

export default function Status({}) {
  return (
    <>
      <div className={styles.container}>
          <Card title="Total Users" counter="12,450" rate="12.4%" rateStatus="UP" duration="vs Apr 1 - Apr 30"/>
          <Card title="Total Tours" counter="1,245" rate="8.7%" rateStatus="UP" duration="vs Apr 1 - Apr 30"/>
          <Card title="Total BOOKINGS" counter="3,860" rate="15.6%" rateStatus="DOWN" duration="vs Apr 1 - Apr 30"/>
          <Card title="Revenue (USD)" counter="$48,750" rate="18.3%" rateStatus="NORMAL" duration="vs Apr 1 - Apr 30"/>
      </div>
    </>
  );
}

export function Card({ title, counter, rate, rateStatus = "UP", duration, className }) {
  const statusStyles = {
    "UP": { icon:Icons.arrowUp,color: "green" },
    "DOWN": { icon:Icons.arrowDown,color: "red" },
    "NORMAL": { icon:Icons.arrowUp,color: "gray" }
  };
  const currentStyle = statusStyles[rateStatus] || {icon:Icons.ArrowRight, color: "black" };
  const Icon = currentStyle.icon
  return (
    <div className={`${className} ${styles.card}`}>
      <p className={styles.title}>{title}</p>
      <div className={styles.counter}>
        <p>{counter}</p>
        <div className={styles.rate}>
          <Icon style={{ color:currentStyle.color, fontSize:"20px"}} color="green"/>
          <p style={{ color: currentStyle.color, fontWeight: 500 }}>
            {rate}
          </p>
        </div>
      </div>
      <p style={{ fontSize: "12px", color: "#888" }}>{duration}</p>
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

export function LineChart({x, y, points, max, step, lineColor, pointColor}) {
  const data = {
    labels: x || ["May 1","May 5", "May 10", "May 15", "May 20", "May 25", "May 30"],
    datasets: [
      {
        label: "",
        data: points || [1.5,2.2,3.1,.9,1.2,3.9,2.3],
        borderColor:lineColor|| "#5656df",
        backgroundColor:pointColor|| "#5656df",
        tension: 0.4,
        borderWidth: 3,
        pointRadius: 4,
      }
    ],
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
        },
      },
      y: {
        beginAtZero: true,
        max: max || 4,
        ticks: {
          stepSize: step || 1,
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
      <div className={styles.chart}>
        <Line data={data} options={options} />
      </div>
    </div>
  );
}