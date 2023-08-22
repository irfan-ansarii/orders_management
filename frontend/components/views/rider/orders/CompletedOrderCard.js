import React from "react";
import { Card, Avatar, Row, Col, Typography, Divider, Badge, Tag } from "antd";
import { MdLocationOn } from "react-icons/md";
import numeral from "numeral";
import capitalize from "capitalize";
import moment from "moment";

const CompletedOrderCard = ({ loading, data }) => {
  return (
    <Badge.Ribbon
      color={
        data?.attributes?.type === "return"
          ? "red"
          : data?.attributes?.type === "exchange"
          ? "geekblue"
          : "cyan"
      }
      text={data?.attributes?.type}
      className="rotate"
    >
      <Card
        className="overflow-hidden pa-2 "
        size="small"
        bordered={false}
        loading={loading}
      >
        <Row className="flex-column h-100">
          <div className="flex-grow-1">
            <Row>
              <Col span={12}>
                <Typography.Text
                  type="secondary"
                  className="text-xs uppercase d-block"
                >
                  Order ID
                </Typography.Text>
                <Typography.Text className="text-xs uppercase d-block">
                  {data?.attributes?.name}
                </Typography.Text>
              </Col>
              {data?.attributes?.type !== "return" && (
                <Col span={12} className="text-right">
                  <Typography.Text
                    type="secondary"
                    className="text-xs uppercase d-block"
                  >
                    Collected
                  </Typography.Text>
                  <Typography.Text className="text-xs uppercase d-block">
                    {numeral(data?.attributes?.outstandingTotal).format(
                      "0,0.00"
                    )}
                  </Typography.Text>
                </Col>
              )}
            </Row>

            <Divider className="my-3" dashed />
            <Row className="gap-2 mb-4" wrap={false}>
              <Avatar
                className="d-flex align-center justify-center flex-shrink-0"
                icon={<MdLocationOn />}
              />
              <Col>
                <Typography.Text className="text-xs d-block">
                  {capitalize(data?.attributes?.shippingAddress?.name || "")}
                </Typography.Text>
                <Typography.Text type="secondary" className="text-xs">
                  {`${data?.attributes?.shippingAddress?.address1} ${data?.attributes?.shippingAddress?.address2} ${data?.attributes?.shippingAddress?.city} ${data?.attributes?.shippingAddress?.province} - ${data?.attributes?.shippingAddress?.zip}`}
                </Typography.Text>
              </Col>
            </Row>
          </div>

          <Tag
            className="border-none ma-0 d-flex py-1 uppercase justify-space-between px-4"
            color="success"
          >
            <span>
              {data?.attributes?.type === "return"
                ? "returned"
                : data?.attributes?.currentStatus?.data?.attributes?.name ===
                  "rto_delivered"
                ? "rto delivered"
                : "delivered"}
            </span>
            <Typography.Text type="secondary" className="text-xs">
              {moment(
                data?.attributes?.currentStatus?.data?.attributes?.happenedAt
              ).format("DD MMM, YYYY")}
            </Typography.Text>
          </Tag>
        </Row>
      </Card>
    </Badge.Ribbon>
  );
};

export default CompletedOrderCard;
CompletedOrderCard.defaultProps = {
  data: {},
  loading: false,
};
