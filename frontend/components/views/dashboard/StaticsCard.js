import React, { useMemo } from "react";
import StaticCard from "./StaticCard";
import { Col } from "antd";
import {
  MdInbox,
  MdCurrencyRupee,
  MdDiscount,
  MdLocalMall,
} from "react-icons/md";
import numeral from "numeral";

const StaticsCard = ({ loading, orders, checkouts }) => {
  const orderStatics = useMemo(() => {
    const filteredOrders = orders?.filter(
      (order) => order.attributes.type === "new"
    );
    if (!filteredOrders || !Array.isArray(filteredOrders)) return {};
    return filteredOrders.reduce(
      (acc, order) => {
        return {
          totalCount: acc.totalCount + 1,
          prepaidCount:
            order.attributes.paymentMode === "prepaid"
              ? acc.prepaidCount + 1
              : acc.prepaidCount,
          codCount:
            order.attributes.paymentMode === "cod"
              ? acc.codCount + 1
              : acc.codCount,
          totalValue: acc.totalValue + order.attributes.total,
          prepaidValue:
            order.attributes.paymentMode === "prepaid"
              ? acc.prepaidValue + parseFloat(order.attributes.total)
              : acc.prepaidValue,
          codValue:
            order.attributes.paymentMode === "cod"
              ? acc.codValue + parseFloat(order.attributes.total)
              : acc.codValue,
          soldCount: acc.soldCount + order.attributes.lineItems.data.length,
          prepaidSoldCount:
            order.attributes.paymentMode === "prepaid"
              ? acc.prepaidSoldCount + order.attributes.lineItems.data.length
              : acc.prepaidSoldCount,

          codSoldCount:
            order.attributes.paymentMode === "cod"
              ? acc.codSoldCount + order.attributes.lineItems.data.length
              : acc.codSoldCount,
        };
      },
      {
        totalCount: 0,
        prepaidCount: 0,
        codCount: 0,
        totalValue: 0,
        prepaidValue: 0,
        codValue: 0,
        soldCount: 0,
        prepaidSoldCount: 0,
        codSoldCount: 0,
      }
    );
  }, [orders]);

  const checkoutStatics = useMemo(() => {
    if (!checkouts || !Array.isArray(checkouts)) return {};

    return checkouts.reduce(
      (acc, checkout) => {
        return {
          total: acc.total + checkout.attributes.total,
          recovered: checkout.attributes.isRecovered
            ? acc.recovered + checkout.attributes.total
            : acc.recovered,
          notRecovered: !checkout.attributes.isRecovered
            ? acc.notRecovered + checkout.attributes.total
            : acc.notRecovered,
        };
      },
      {
        total: 0,
        recovered: 0,
        notRecovered: 0,
      }
    );
  }, [checkouts]);

  return (
    <>
      <Col span={24} sm={{ span: 12 }} xl={{ span: 6 }} className="mb-6">
        <StaticCard
          loading={loading}
          title="Orders"
          value={orderStatics.totalCount}
          color="magenta"
          icon={<MdInbox />}
          progress={[
            {
              color: "orange",
              value: (orderStatics.codCount / orderStatics.totalCount) * 100,
              title: `COD ${orderStatics.codCount}`,
            },
            {
              value:
                (orderStatics.prepaidCount / orderStatics.totalCount) * 100,
              title: `Prepaid ${orderStatics.prepaidCount}`,
            },
          ]}
        />
      </Col>
      <Col span={24} sm={{ span: 12 }} xl={{ span: 6 }} className="mb-6">
        <StaticCard
          loading={loading}
          title="Order Value"
          value={numeral(orderStatics.totalValue).format("0,0.00")}
          color="blue"
          icon={<MdCurrencyRupee />}
          progress={[
            {
              color: "orange",
              value: (orderStatics.codValue / orderStatics.totalValue) * 100,
              title: `COD ${numeral(orderStatics.codValue).format("0,0.00")}`,
            },
            {
              value:
                (orderStatics.prepaidValue / orderStatics.totalValue) * 100,
              title: `Prepaid ${numeral(orderStatics.prepaidValue).format(
                "0,0.00"
              )}`,
            },
          ]}
        />
      </Col>
      <Col span={24} sm={{ span: 12 }} xl={{ span: 6 }} className="mb-6">
        <StaticCard
          loading={loading}
          title="Product Sold"
          value={orderStatics.soldCount}
          color="orange"
          icon={<MdDiscount />}
          progress={[
            {
              color: "orange",
              value: (orderStatics.codSoldCount / orderStatics.soldCount) * 100,
              title: `COD ${orderStatics.codSoldCount}`,
            },
            {
              value:
                (orderStatics.prepaidSoldCount / orderStatics.soldCount) * 100,
              title: `Prepaid ${orderStatics.prepaidSoldCount}`,
            },
          ]}
        />
      </Col>
      <Col span={24} sm={{ span: 12 }} xl={{ span: 6 }} className="mb-6">
        <StaticCard
          loading={loading}
          title="Checkouts"
          value={numeral(checkoutStatics.total).format("0,0.00")}
          color="red"
          icon={<MdLocalMall />}
          progress={[
            {
              color: "orange",
              value:
                (checkoutStatics.notRecovered / checkoutStatics.total) * 100,
              title: `Not Recovered ${numeral(
                checkoutStatics.notRecovered
              ).format("0,0.00")}`,
            },
            {
              value: (checkoutStatics.recovered / checkoutStatics.total) * 100,
              title: `Recovered ${numeral(checkoutStatics.recovered).format(
                "0,0.00"
              )}`,
            },
          ]}
        />
      </Col>
    </>
  );
};

export default StaticsCard;
StaticsCard.defaultProps = {
  loading: false,
  orders: [],
  checkouts: [],
};
