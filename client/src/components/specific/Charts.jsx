import React from "react";
import { Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  Tooltip,
  LinearScale,
  LineElement,
  PointElement,
  Filler,
  ArcElement,
  Legend,
  scales,
} from "chart.js";
import { lightPurple, orange, orangeLight, purple } from "../../constants/color";
import { getLast7Days } from "../../libs/features";

ChartJS.register(
  CategoryScale,
  Tooltip,
  LinearScale,
  LineElement,
  PointElement,
  Filler,
  ArcElement,
  Legend
);

const label=getLast7Days();

const lineChartOptions={
    responsive: true,
    plugins: {
        legend: {
            display: 'false',
        },
        title: {
            display: false,
        },
    },

    scales: {
        x: {
            grid: {
                display: false,
            },
        },
        y: {
            beginAtZero: true,
            grid: {
                display: false,
            },
        },
    },
}



const LineChart = ({value=[]}) => {
  const data = {
    labels:label,
    datasets: [
        {
        data:value,
        label: "Revenue",
        fill: true,
        borderColor: purple,
        backgroundColor: lightPurple,
    },

]
  };
  return <Line data={ data } options={lineChartOptions}/>;
};


const doughtnutChartOptions={
    responsive: true,
    plugins: {
        legend: {
            display: false,
        },
        title: {
            display: false,
        },
    },
    cutout:80,
};
const DoughnutChart = ({value=[],labels=[]}) => {
    const data = {
    labels:labels,
    datasets: [
        {
        data:value,
        label: "Total Chats vs Group Chats",
        
        borderColor: [purple,orange],
        backgroundColor: [lightPurple, orangeLight],
        hoverBackgroundColor: [purple,orange],
        offset: 10,
    },

]
  };
  return <Doughnut style={{zIndex:10}} data={data} options={doughtnutChartOptions}/>
};

export { LineChart, DoughnutChart };
