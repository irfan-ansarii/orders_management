import React from "react";
import { Card, Row, Col, Typography, Space } from "antd";
const CustomerCard = ({ data, loading }) => {
  return (
    <Card bordered={false} title="Customer Details" loading={loading}>
      <Space direction="vertical" className="w-100">
        <Row gutter={12}>
          <Col span={6}>
            <Typography.Text type="secondary">Name:</Typography.Text>
          </Col>
          <Col span={18}>
            <Typography.Text>
              {data?.attributes?.shippingAddress?.name ||
                data?.attributes?.billingAddress?.name ||
                data?.attributes?.customer?.data?.attributes?.name}
            </Typography.Text>
          </Col>
        </Row>
        <Row gutter={12}>
          <Col span={6}>
            <Typography.Text type="secondary">Phone:</Typography.Text>
          </Col>
          <Col span={18}>
            <Typography.Text>
              {data?.attributes?.shippingAddress?.phone ||
                data?.attributes?.billingAddress?.phone ||
                data?.attributes?.customer?.data?.attributes?.phone}
            </Typography.Text>
          </Col>
        </Row>
        <Row gutter={12}>
          <Col span={6}>
            <Typography.Text type="secondary">Email:</Typography.Text>
          </Col>
          <Col span={18}>
            <Typography.Text>
              {data?.attributes?.customer?.data?.attributes?.email}
            </Typography.Text>
          </Col>
        </Row>
        <Row gutter={12}>
          <Col span={6}>
            <Typography.Text type="secondary">Address:</Typography.Text>
          </Col>
          <Col span={18}>
            <Typography.Text>
              {`${
                data?.attributes?.shippingAddress?.address1 ||
                data?.attributes?.billingAddress?.address1
              } ${
                data?.attributes?.shippingAddress?.address2 ||
                data?.attributes?.billingAddress?.address2
              }`}
            </Typography.Text>
          </Col>
        </Row>
        <Row gutter={12}>
          <Col span={6}>
            <Typography.Text type="secondary">City:</Typography.Text>
          </Col>
          <Col span={18}>
            <Typography.Text>
              {data?.attributes?.shippingAddress?.city ||
                data?.attributes?.billingAddress?.city}
            </Typography.Text>
          </Col>
        </Row>
        <Row gutter={12}>
          <Col span={6}>
            <Typography.Text type="secondary">State:</Typography.Text>
          </Col>
          <Col span={18}>
            <Typography.Text>
              {data?.attributes?.shippingAddress?.province ||
                data?.attributes?.billingAddress?.province}
            </Typography.Text>
          </Col>
        </Row>
        <Row gutter={12}>
          <Col span={6}>
            <Typography.Text type="secondary">Zip:</Typography.Text>
          </Col>
          <Col span={18}>
            <Typography.Text>
              {data?.attributes?.shippingAddress?.zip ||
                data?.attributes?.billingAddress?.zip}
            </Typography.Text>
          </Col>
        </Row>
        <Row gutter={12}>
          <Col span={6}>
            <Typography.Text type="secondary">Country:</Typography.Text>
          </Col>
          <Col span={18}>
            <Typography.Text>
              {data?.attributes?.shippingAddress?.country ||
                data?.attributes?.billingAddress?.country}
            </Typography.Text>
          </Col>
        </Row>
      </Space>
    </Card>
  );
};

export default CustomerCard;
