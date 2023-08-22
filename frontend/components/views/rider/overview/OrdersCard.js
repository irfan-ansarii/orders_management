import React from "react";
import {
  Card,
  Tag,
  List,
  Row,
  Col,
  Typography,
  Avatar,
  Tooltip,
  Badge,
} from "antd";
import moment from "moment";
import numeral from "numeral";
const OrdersCard = ({ loading, data }) => {
  const getTag = (item) => {
    const status = item?.attributes?.currentStatus?.data?.attributes?.name;
    let statusName = status;
    let color = "success";
    switch (status) {
      case "out_for_delivery":
      case "out_for_pickup":
        statusName = "active";
        color = "magenta";
        break;
      case "in_transit":
        statusName = "return picked";
        color = "blue";
        break;
      case "undelivered":
      case "return_rescheduled":
        statusName = "rescheduled";
        color = "volcano";
        break;
      default:
        break;
    }

    return (
      <Tag className="px-3 mr-0 uppercase border-none" color={color}>
        {statusName?.replace(/_/g, " ")}
      </Tag>
    );
  };
  return (
    <Card
      bordered={false}
      className={`h-100 table-card mb-6 ${loading ? "px-4" : ""}`}
      title="Orders"
      loading={loading}
    >
      {(!data || data.length === 0) && (
        <List className="px-4 py-4 has-hover" dataSource={[]} />
      )}

      {data?.map((item) => (
        <Badge.Ribbon text="new" className="rotate" key={item.id}>
          <Tag className="border-none d-block mr-0 py-3 px-6 mb-2">
            <Row align="top" gutter={12} justify="space-between" wrap={false}>
              <Col span={6}>
                <Typography.Text type="secondary" className="text-xs">
                  12,04 12:12 AM
                </Typography.Text>
                <Typography.Text ellipsis className="d-block">
                  GN454465
                </Typography.Text>
              </Col>

              <Col span={5} className="text-right">
                <Typography.Text
                  type="secondary"
                  className="d-block uppercase text-xs"
                >
                  cod
                </Typography.Text>

                <Typography.Text className="d-block ">
                  {numeral(item?.attributes?.outstandingTotal).format("0,0.00")}
                </Typography.Text>
              </Col>
              <Col span={6} className="text-right">
                <Typography.Text
                  type="secondary"
                  className="text-xs uppercase d-block"
                >
                  status
                </Typography.Text>
                {getTag(item)}
              </Col>
            </Row>
          </Tag>
        </Badge.Ribbon>
      ))}
    </Card>
  );
};

export default OrdersCard;
OrdersCard.defaultProps = {
  data: [],
  loading: false,
};
