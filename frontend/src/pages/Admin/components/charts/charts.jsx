import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export const DoughnutChart = () => {
  // Chart data
  const data = {
    labels: ['Approved', 'Pending', 'Rejected'],
    datasets: [
      {
        label: '# of Votes',
        data: [12, 19, 3],
        backgroundColor: [
          '#D95A45',
          '#4E924D',
          '#CF9633'
        ],
        borderWidth: 5,
        cutout: '60%', 
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
        // This changes the shape to a sharp square/rectangle
        pointStyle: 'rect', 
        // Optional: You can adjust the size of the squares here
        boxWidth: 15, 
        boxHeight: 5,
        // Optional: Padding between the icon and the text
        // padding: 20, 
      },
    //   tooltip: {
    //     enabled: true,
    //   },
    },
  };

  return (
      <Doughnut data={data} options={options} />
  );
};