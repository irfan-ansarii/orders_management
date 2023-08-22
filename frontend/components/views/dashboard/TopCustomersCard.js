import React, { useMemo } from "react";
import Link from "next/link";
import numeral from "numeral";
import {
  Card,
  Avatar,
  List,
  Typography,
  Row,
  Progress,
  Tooltip,
  Button,
} from "antd";
import { MdPerson } from "react-icons/md";
const TopCustomersCard = ({ loading, orders }) => {
  const topCustomers = useMemo(() => {
    if (!orders || !Array.isArray(orders)) return [];

    return orders
      .reduce((acc, curr) => {
        const orderValue = curr.attributes.total;
        const customerId = curr.attributes.customer.data?.id;
        const customerName = curr.attributes.customer.data?.attributes?.name;
        const customerPhone = curr.attributes.customer.data?.attributes?.phone;
        const index = acc.findIndex((item) => item.customerId === customerId);

        if (index !== -1) {
          acc[index] = {
            ...acc[index],
            customerName,
            customerPhone,
            value: acc[index].value + orderValue,
            count: acc[index].count + 1,
          };
        } else {
          acc.push({
            customerId,
            customerName,
            customerPhone,
            value: orderValue,
            count: 1,
          });
        }
        return acc;
      }, [])
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [orders]);

  return (
    <Card
      bordered={false}
      title="Top Customers"
      className="table-card h-100"
      loading={loading}
    >
      <List
        className="px-4 py-4 has-hover"
        dataSource={topCustomers}
        renderItem={(item, index) => (
          <>
            <List.Item className="py-2 px-2">
              <Link
                href={`/customers/${item.customerId}`}
                className="d-flex w-100 align-end"
              >
                <List.Item.Meta
                  avatar={
                    <Avatar
                      size={46}
                      className="d-flex align-center justify-center"
                      icon={<MdPerson />}
                      shape="square"
                    />
                  }
                  title={item.customerName}
                  description={
                    <Typography.Text type="secondary" className="text-xs">
                      {item.customerPhone}
                    </Typography.Text>
                  }
                />
                <div style={{ width: "80px" }}>
                  <Typography.Text type="secondary">
                    <Row justify="space-between" className="text-xs uppercase">
                      <span>orders</span>
                      <span>{item.count}</span>
                    </Row>
                  </Typography.Text>
                  <Typography.Text className="text-right d-block">
                    <Tooltip
                      title={`Spent ${numeral(item.value).format("0,0.00")}`}
                    >
                      <Progress
                        percent={(item.value / topCustomers[0].value) * 100}
                        showInfo={false}
                        size="small"
                        className="ma-0"
                      />
                    </Tooltip>
                  </Typography.Text>
                </div>
              </Link>
            </List.Item>
            {index === topCustomers.length - 1 && (
              <Button className="mt-2" block type="link">
                View All
              </Button>
            )}
          </>
        )}
      />
    </Card>
  );
};

export default TopCustomersCard;

TopCustomersCard.defaultProps = {
  loading: false,
  orders: [],
};
