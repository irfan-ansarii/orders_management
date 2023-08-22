import { Card, Row, Segmented } from "antd";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Colors,
} from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Colors
);
const options = {
  plugins: {
    legend: {
      labels: {
        boxWidth: 20,
        font: {
          size: 10,
        },
      },
    },
  },
  responsive: true,

  scales: {
    x: {
      grid: {
        display: false,
      },
      stacked: true,
    },
    y: {
      grid: {
        color: "rgba(0, 0, 0, 0.04)",
      },
      stacked: true,
    },
  },
};

const data = {
  labels: [
    "Processing",
    "Packed",
    "Shipped",
    "Delivered",
    "RTO",
    "Return",
    "Exchange",
    "Cancelled",
  ],
  datasets: [
    {
      label: "Website",
      data: [5, 10, 15, 18, 27, 23, 28, 19],
      backgroundColor: "#ef476f",
    },
    {
      label: "Nykaa",
      data: [2, 0, 4, 20, 9, 14, 17, 10],
      backgroundColor: "#ffbe0b",
    },
    {
      label: "Offline",
      data: [1, 0, 2, 0, 0, 0, 2, 0],
      backgroundColor: "#00bbf9",
    },
  ],
};
const RevenueCard = () => {
  return (
    <Card bordered={false} className="h-100" title="Revenue  (demo)">
      <Row align="bottom">
        <Bar options={options} data={data} />
      </Row>
    </Card>
  );
};

export default RevenueCard;
