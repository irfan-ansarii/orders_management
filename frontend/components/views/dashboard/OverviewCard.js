import { useMemo } from "react";
import { Card, Row } from "antd";
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
      labels: false,
    },
    labels: {
      fontSize: "8px",
    },
  },
  responsive: true,
  stacked: true,
  scales: {
    x: {
      grid: {
        display: false,
      },
    },
    y: {
      grid: {
        color: "rgba(0, 0, 0, 0.04)",
      },
    },
  },
};

const OverviewCard = ({ loading, orders }) => {
  const overviewData = useMemo(() => {
    if (!orders || !Array.isArray(orders)) return {};

    const counts = orders.reduce(
      (acc, curr) => {
        const { type } = curr.attributes;
        const name = curr.attributes.currentStatus.data?.attributes?.name;

        if (curr.attributes.cancelledAt) {
          acc.cancelled++;
          return acc;
        }

        if (type === "return") {
          acc.returns++;
          return acc;
        } else if (type === "exchange") {
          acc.exchange++;
          return acc;
        }

        switch (name) {
          case undefined:
            acc.processing++;
            break;
          case "confirmed":
            acc.processing++;
            break;
          case "packed":
            acc.packed++;
            break;
          case "in_transit":
          case "out_for_delivery":
          case "undelivered":
            acc.shipped++;
            break;
          case "delivered":
            acc.delivered++;
            break;
          case "rto_initiated":
          case "rto_in_transit":
          case "rto_delivered":
            acc.rto++;
            break;
          default:
            acc.other++;
        }
        return acc;
      },
      {
        processing: 0,
        packed: 0,
        shipped: 0,
        delivered: 0,
        rto: 0,
        returns: 0,
        exchange: 0,
        cancelled: 0,
        other: 0,
      }
    );

    return {
      labels: Object.keys(counts).map((key) => key.toUpperCase()),
      datasets: [
        {
          data: Object.values(counts).map((val) => val),
          backgroundColor: "#ef476f",
        },
      ],
    };
  }, [orders]);

  return (
    <Card
      bordered={false}
      className="h-100"
      title="Orders Overview"
      loading={loading}
    >
      <Row align="bottom">
        <Bar options={options} data={overviewData} />
      </Row>
    </Card>
  );
};

export default OverviewCard;
OverviewCard.defaultProps = {
  loading: false,
  orders: [],
};
