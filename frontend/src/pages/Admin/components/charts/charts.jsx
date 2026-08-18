import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
 import styles from './Charts.module.css'
ChartJS.register(ArcElement, Tooltip, Legend);

export const DoughnutChart = ({dataSet=[]}) => {
  // Chart data
  const data = {
    // labels: ['Approved', 'Pending', 'Rejected'],
    labels: dataSet.labels,
    datasets: [
      {
        label: '# of Votes',
        // data: [12, 19, 3],
        data: dataSet.values,
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
        {dataSet.values.map((item,index)=>(
          <p key={index} style={{color:"#797979",fontSize:"14px"}}>{item}</p>
        ))}
      </div>
    </div>
  );
};