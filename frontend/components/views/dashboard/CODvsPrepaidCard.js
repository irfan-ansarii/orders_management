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
const CODvsPrepaidCard = ({ orders, loading }) => {
  const camparisonData = useMemo(() => {
    if (!orders || !Array.isArray(orders)) return {};

    const counts = orders.reduce((values, item) => {
      const mode = item.attributes.paymentMode;
      values[mode] = (values[mode] || 0) + 1;
      return values;
    }, {});

    return {
      labels: Object.keys(counts).map((key) => key.toUpperCase()),
      datasets: [
        {
          data: Object.values(counts).map((val) => val),
          borderWidth: 0,
        },
      ],
    };
  }, [orders]);

  return (
    <Card
      className="h-100"
      bordered={false}
      title="Prepaid vs COD"
      loading={loading}
    >
      <Row justify="center">
        <Doughnut data={camparisonData} options={options} />
      </Row>
    </Card>
  );
};

export default CODvsPrepaidCard;
CODvsPrepaidCard.defaultProps = {
  orders: [],
  loading: false,
};
