import React, { useMemo } from "react";
import { Card, Row } from "antd";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Colors,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend, Colors);

const options = {
  responsive: true,
  plugins: {
    legend: {
      labels: {
        boxWidth: 20,
        font: {
          size: 10,
        },
      },
      position: "bottom",
    },
  },
};
const OrderLocationCard = ({ orders, loading }) => {
  const comparisonData = useMemo(() => {
    if (!orders || !Array.isArray(orders)) return {};

    const counts = orders.reduce((acc, item) => {
      const location = item.attributes.shippingAddress.province;
      acc[location] = (acc[location] || 0) + 1;
      return acc;
    }, {});

    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);

    const top5 = sorted.slice(0, 5);
    const otherCount = sorted
      .slice(5)
      .reduce((acc, [, count]) => acc + count, 0);

    const result = {};

    top5.forEach(([location, count]) => {
      result[location] = count;
    });

    result.Other = otherCount;
    return {
      labels: Object.keys(result).map((key) => key.toUpperCase()),
      datasets: [
        {
          data: Object.values(result).map((val) => val),
          borderWidth: 0,
        },
      ],
    };
  }, [orders]);

  return (
    <Card
      className="h-100"
      bordered={false}
      title="Order Locations"
      loading={loading}
    >
      <Row justify="center">
        <Doughnut data={comparisonData} options={options} />
      </Row>
    </Card>
  );
};

export default OrderLocationCard;

OrderLocationCard.defaultProps = {
  orders: [],
  loading: false,
};
