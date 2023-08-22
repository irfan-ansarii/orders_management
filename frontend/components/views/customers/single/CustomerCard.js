import React from "react";
import { Card, Col, Row, Typography, Avatar, Tag } from "antd";
import { MdVerified } from "react-icons/md";
import numeral from "numeral";
import { MdPerson } from "react-icons/md";
const CustomerCard = ({ data, loading }) => {
  const getTotalSpent = () => {
    const total = data?.attributes?.orders?.data?.reduce(
      (sum, line) => sum + parseFloat(line?.attributes?.total),
      0
    );
    return total;
  };

  const getCount = (type) => {
    return data?.attributes?.orders?.data?.reduce((accumulator, item) => {
      if (type === "rto") {
        const isRTO =
          item.attributes?.currentStatus?.data?.attributes?.name?.search("rto");
        return isRTO >= 0 ? accumulator + 1 : accumulator;
      }

      if (item.attributes.type === "return") return accumulator + 1;
      return accumulator;
    }, 0);
  };

  return (
    <Card
      bordered={false}
      className="mb-6 overflow-hidden pa-2"
      loading={loading}
      size="small"
    >
      <Col span={24} className="d-flex gap-4 mb-6">
        <Avatar
          size={90}
          shape="square"
          className="flex-shrink-0 d-flex align-center justify-center"
          icon={<MdPerson />}
        />

        <div className="flex-grow-1">
          <div className="d-flex justify-space-between">
            <div>
              <Typography.Text ellipsis className="d-block">
                {data?.attributes?.name}
              </Typography.Text>
              <Typography.Text type="secondary d-block mb-1">
                {data?.attributes?.defaultAddress?.province}
              </Typography.Text>
            </div>
            <div>
              {data?.attributes?.verifiedEmail ? (
                <Tag
                  color="success"
                  className="border-none px-3 mr-0 py-1 uppercase d-flex align-center"
                >
                  <MdVerified className="mr-2 text-sm" />
                  Verified
                </Tag>
              ) : (
                <Tag
                  color="volcano"
                  className="border-none px-3 mr-0 py-1 uppercase d-flex align-center"
                >
                  not Verified
                </Tag>
              )}
            </div>
          </div>
          <Typography.Text className="d-block" copyable>
            {data?.attributes?.phone}
          </Typography.Text>
          <Typography.Text className="d-block" copyable>
            {data?.attributes?.email}
          </Typography.Text>
        </div>
      </Col>

      <Tag className="py-2 border-none d-block ma-0">
        <Row gutter={12} justify="space-between">
          <Col>
            <Typography.Text
              type="secondary"
              className="uppercase d-block text-xs"
            >
              Orders
            </Typography.Text>
            <Typography.Text type="success">
              {data?.attributes?.orders?.data?.length}
            </Typography.Text>
          </Col>
          <Col>
            <Typography.Text
              type="secondary"
              className="uppercase d-block text-xs"
            >
              return
            </Typography.Text>
            <Typography.Text type="success">{getCount()}</Typography.Text>
          </Col>
          <Col>
            <Typography.Text
              type="secondary"
              className="uppercase d-block text-xs"
            >
              rto
            </Typography.Text>
            <Typography.Text type="success">{getCount("rto")}</Typography.Text>
          </Col>
          <Col className="text-right">
            <Typography.Text
              type="secondary"
              className="uppercase d-block text-xs"
            >
              total Spent
            </Typography.Text>
            <Typography.Text type="success">
              {numeral(getTotalSpent()).format("0,0.00")}
            </Typography.Text>
          </Col>
        </Row>
      </Tag>
    </Card>
  );
};

export default CustomerCard;
