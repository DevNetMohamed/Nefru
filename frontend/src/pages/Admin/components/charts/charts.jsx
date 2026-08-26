import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
 import styles from './Charts.module.css'
ChartJS.register(ArcElement, Tooltip, Legend);

export const DoughnutChart = ({dataSet={}}) => {
  const values = dataSet.values ?? [];
  const labels = dataSet.labels ?? [];

  if (values.length === 0) {
    return (
      <div className={styles.container}>
        <p style={{color:"#888", padding:"16px"}}>No tour data yet.</p>
      </div>
    );
  }

  // Chart data
  const data = {
    labels,
    datasets: [
      {
        label: '# of Tours',
        data: values,
        backgroundColor: [
          '#4E924D',
          '#CF9633',
          '#D95A45',
        ],
        borderWidth: 3,
        cutout: '70%', 
      },
    ],
  };

  // Chart options (customization)
  const options = {
    responsive: false,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        pointStyle: 'rect', 
        boxWidth: 15, 
        boxHeight: 5,
      },
    },
  };

  return (
    <div className={styles.container}>
      <Doughnut data={data} options={options} />
      <div>
        {values.map((item,index)=>(
          <p key={labels[index] ?? index} style={{color:"#797979",fontSize:"14px"}}>
            {item}
          </p>
        ))}
      </div>
    </div>
  );
};