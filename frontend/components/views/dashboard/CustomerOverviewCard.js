import React, { useMemo } from "react";
import { Card } from "antd";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Colors,
} from "chart.js";
import { Pie } from "react-chartjs-2";

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
      maxWidth: 1,
    },
  },
};

const CustomerOverviewCard = ({ loading, orders }) => {
  const overview = useMemo(() => {
    if (!orders || !Array.isArray(orders)) return [];

    const summary = orders.reduce((acc, curr) => {
      const customerId = curr.attributes.customer.data?.id;
      if (acc[customerId]) {
        acc[customerId].count++;
      } else {
        acc[customerId] = {
          count: 1,
        };
      }
      return acc;
    }, {});

    const result = Object.values(summary).reduce(
      (acc, curr) => {
        if (curr.count > 1) {
          acc[0] = { ...acc[0], count: acc[0].count + 1 };
        } else {
          acc[1] = { ...acc[1], count: acc[1].count + 1 };
        }
        return acc;
      },
      [
        { type: "returning", count: 0 },
        { type: "new", count: 0 },
      ]
    );
    return {
      labels: result.map((res) => res.type.toUpperCase()),
      datasets: [
        {
          data: result.map((res) => res.count),
          borderWidth: 0,
        },
      ],
    };
  }, [orders]);

  return (
    <Card
      bordered={false}
      title="Customers Overview"
      className="h-100"
      loading={loading}
    >
      <Pie data={overview} options={options} />
    </Card>
  );
};

export default CustomerOverviewCard;
CustomerOverviewCard.defaultProps = {
  loading: false,
  orders: [],
};
