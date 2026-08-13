import styles from "./Status.module.css";
import Icons from '../../../../assets/icons'
import { FaRegCalendarCheck } from "react-icons/fa";
import { LuTicket } from "react-icons/lu";
import { BsCashStack } from "react-icons/bs";
import { RiCalendarScheduleLine } from "react-icons/ri";

import { formatNumber } from '../../../../utils/formatters'

export default function Status({data=[]}) {
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
        label: "Bookings",
        data: points || [1.5,2.2,3.1,.9,1.2,3.9,2.3],
        borderColor:lineColor|| "#5656df",
        backgroundColor:pointColor|| "#5656df",
        tension: 0.4,
        borderWidth: 3,
        pointRadius: 4,
      },
      {
        label: "Revenue",
        data: points || [1,2.6,3,1,2,3.1,2.2],
        borderColor:lineColor|| "#db7d11",
        backgroundColor:pointColor|| "#db7d11",
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