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
import moment from "moment";
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
const ShippingPerformanceCard = ({ orders, loading }) => {
  const report = useMemo(() => {
    const summary = orders.reduce(
      (acc, curr) => {
        const isCancelled = curr.attributes.cancelledAt;
        const isReturn = curr.attributes.type == "return";
        const orderDate =
          curr.attributes.orderDate || curr.attributes.createdAt;

        const expectedDate = moment(orderDate).add(4, "days");
        const packedStatus = curr?.attributes?.tracking?.data?.forEach(
          (item) => {
            if (item.attributes.name == "packed") {
              return item;
            }
          }
        );

        if (isReturn || isCancelled) {
          return acc;
        }

        if (!packedStatus && moment().isAfter(expectedDate)) {
          acc.delayed++;
        } else if (
          packedStatus &&
          moment(packedStatus.attributes.happenedAt).isBefore(expectedDate)
        ) {
          acc.early++;
        } else {
          acc.onTime++;
        }
        return acc;
      },
      { early: 0, onTime: 0, delayed: 0 }
    );

    return {
      labels: Object.keys(summary).map((key) => key.toUpperCase()),
      datasets: [
        {
          data: Object.values(summary).map((val) => val),
          borderWidth: 0,
        },
      ],
    };
  }, [orders]);
  return (
    <Card
      className="h-100"
      bordered={false}
      title="Shipping Performance"
      loading={loading}
    >
      <Row justify="center">
        <Doughnut data={report} options={options} />
      </Row>
    </Card>
  );
};

export default ShippingPerformanceCard;
ShippingPerformanceCard.defaultProps = {
  orders: [],
  loading: false,
};
