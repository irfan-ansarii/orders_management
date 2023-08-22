import React from "react";
import { Card, Space, Row, Col, Typography } from "antd";
const DefaultAddressCard = ({ data, loading }) => {
  return (
    <Card
      bordered={false}
      title="Default Address"
      loading={loading}
      className="mb-6"
    >
      <Space direction="vertical" className="w-100">
        <Row gutter={12}>
          <Col span={6}>
            <Typography.Text type="secondary">Name:</Typography.Text>
          </Col>
          <Col span={18}>
            <Typography.Text>
              {data?.attributes?.defaultAddress?.name}
            </Typography.Text>
          </Col>
        </Row>
        <Row gutter={12}>
          <Col span={6}>
            <Typography.Text type="secondary">Phone:</Typography.Text>
          </Col>
          <Col span={18}>
            <Typography.Text>
              {data?.attributes?.defaultAddress?.phone ||
                data?.attributes?.phone}
            </Typography.Text>
          </Col>
        </Row>
        <Row gutter={12}>
          <Col span={6}>
            <Typography.Text type="secondary">Email:</Typography.Text>
          </Col>
          <Col span={18}>
            <Typography.Text>{data?.attributes?.email}</Typography.Text>
          </Col>
        </Row>
        <Row gutter={12}>
          <Col span={6}>
            <Typography.Text type="secondary">Address:</Typography.Text>
          </Col>
          <Col span={18}>
            <Typography.Text>
              {`${data?.attributes?.defaultAddress?.address1} ${data?.attributes?.defaultAddress?.address2}`}
            </Typography.Text>
          </Col>
        </Row>
        <Row gutter={12}>
          <Col span={6}>
            <Typography.Text type="secondary">City:</Typography.Text>
          </Col>
          <Col span={18}>
            <Typography.Text>
              {data?.attributes?.defaultAddress?.city}
            </Typography.Text>
          </Col>
        </Row>
        <Row gutter={12}>
          <Col span={6}>
            <Typography.Text type="secondary">State:</Typography.Text>
          </Col>
          <Col span={18}>
            <Typography.Text>
              {data?.attributes?.defaultAddress?.province}
            </Typography.Text>
          </Col>
        </Row>
        <Row gutter={12}>
          <Col span={6}>
            <Typography.Text type="secondary">Zip:</Typography.Text>
          </Col>
          <Col span={18}>
            <Typography.Text>
              {data?.attributes?.defaultAddress?.zip}
            </Typography.Text>
          </Col>
        </Row>
        <Row gutter={12}>
          <Col span={6}>
            <Typography.Text type="secondary">Country:</Typography.Text>
          </Col>
          <Col span={18}>
            <Typography.Text>
              {data?.attributes?.defaultAddress?.country}
            </Typography.Text>
          </Col>
        </Row>
      </Space>
    </Card>
  );
};

export default DefaultAddressCard;
