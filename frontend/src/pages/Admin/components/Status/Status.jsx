import styles from "./Status.module.css";
import Icons from '../../../../assets/icons'
import { FaRegCalendarCheck } from "react-icons/fa";
import { LuTicket } from "react-icons/lu";
import { BsCashStack } from "react-icons/bs";
import { RiCalendarScheduleLine } from "react-icons/ri";

export default function Status() {
  return (
    <>
      <div className={styles.container}>
          <Card icon={Icons.ticket} iconColor="#765A08" label="TOTAL Bookings" color="#FFDF97" counter="12" tag="+2 new"/>
          <Card icon={Icons.circleCheck} iconColor="#515F74" label="CONFIRMED BOOKINGS" color="#D5E3FD" counter="1,240" tag="+15%"/>
          <Card icon={Icons.circleWrong} iconColor="#BA1A1A" label="CANCELLED BOOKINGS" color="#FFDAD6" counter="$4,200" tag="Target Reached"/>
          <Card icon={Icons.cash} iconColor="#565E74" label="REVENUE FROM BOOKINGS" color="#DAE2FD" counter="3" tag="Urgent"/>
      </div>
    </>
  );
}

export function Card({icon, iconColor,color, label, counter, tag}){
  const Icon = icon;
  return(<>
    <div className={styles.card}>
          <div className={styles.header}>
            <p className={styles.label}>{label}</p>
            <div className={styles.icon} style={{backgroundColor:color}}>
              <Icon style={{color:iconColor}} />
            </div>
          </div>
          <p className={styles.counter}>{counter}</p>
    </div>
  </>)
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

export function LineChart() {
  const data = {
    labels: ["May 12", "May 13", "May 14", "May 15", "May 16", "May 17", "May 18"],
    datasets: [
      {
        label: "",
        data: [120, 280, 200, 450],
        borderColor: "#1FA37A",
        backgroundColor:"#1FA37A",
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
        max: 2500,

        ticks: {
          stepSize: 500,
          color: "#9CA3AF",
        },

        grid: {
          color: "#E5E7EB",
        },
      },
    },
  };

  return (
    <div className="bg-white border rounded-4 p-3 h-100">
      <div className="mb-3">
        <h3 >Revenue Overview</h3>

        <p className="text-muted small">
          Revenue through month in every week
        </p>
      </div>
      <div style={{ height: "320px" }}>
        <Line data={data} options={options} />
      </div>
    </div>
  );
}