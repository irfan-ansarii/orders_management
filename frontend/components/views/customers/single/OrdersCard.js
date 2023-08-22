import React from "react";
import { useRouter } from "next/router";
import { Card, Row, Col, Typography, Avatar, Tag, Tooltip } from "antd";
import moment from "moment/moment";
import numeral from "numeral";
import StatusTag from "../../orders/all/StatusTag";
import { getMediaURL } from "../../../../utils";
const OrdersCard = ({ data, loading }) => {
  const router = useRouter();

  if (data?.attributes?.orders?.data?.length === 0) {
    return;
  }

  const onClick = (path) => {
    router.push(path);
  };

  return (
    <div className="mb-6">
      <Card
        className="mb-1 overflow-hidden pa-2 pointer font-medium uppercase"
        loading={loading}
        size="small"
        bordered={false}
      >
        orders
      </Card>
      {data?.attributes?.orders?.data?.map((order) => (
        <Card
          bordered={false}
          key={order.id}
          className="mb-3 overflow-hidden pa-2 pointer"
          loading={loading}
          size="small"
          onClick={() => onClick(`/orders/${order.id}`)}
        >
          <Row align="top" gutter={12} justify="space-between" wrap={false}>
            <Col span={6}>
              <Typography.Text ellipsis className="d-block">
                {order.attributes.name}
              </Typography.Text>
              <Typography.Text type="secondary">
                {moment(
                  order.attributes.orderDate || order.attributes.createdAt
                ).format("DD-MM-YYYY")}
              </Typography.Text>
            </Col>
            <Col span={7} className="d-flex">
              <Avatar.Group maxCount={2} size={40}>
                {order?.attributes?.lineItems?.data.map((line, i) => {
                  const imageSrc = getMediaURL(
                    line?.attributes?.product?.data?.attributes?.image?.data
                      ?.attributes?.formats?.thumbnail?.url || ""
                  );
                  return (
                    <Tooltip title={line?.attributes?.name} key={i}>
                      <Avatar src={imageSrc} />
                    </Tooltip>
                  );
                })}
              </Avatar.Group>
            </Col>
            <Col span={5}>
              <Typography.Text className="d-block uppercase">
                {order.attributes.paymentMode === "prepaid" ? "Prepaid" : "Cod"}
              </Typography.Text>

              <Tag
                color={
                  order?.attributes?.paymentMode === "prepaid"
                    ? "success"
                    : "orange"
                }
                className="mr-0 uppercase d-inline-flex align-center border-none"
              >
                {numeral(order?.attributes?.total).format("0,0.00")}
              </Tag>
            </Col>
            <Col span={6} className="text-right">
              <StatusTag data={order} />
            </Col>
          </Row>
        </Card>
      ))}
    </div>
  );
};

export default OrdersCard;
