import { Card, Row, Col, Space, Typography, Divider } from "antd";
import React from "react";

const AddressesCard = ({ data, loading }) => {
  return (
    <Card bordered={false} title="Addresses" loading={loading}>
      {data?.attributes?.addresses?.map((line, i) => (
        <Space direction="vertical" className="w-100" key={i}>
          {i > 0 ? <Divider className="my-4" dashed /> : ""}
          <Row gutter={12}>
            <Col span={6}>
              <Typography.Text type="secondary">Name:</Typography.Text>
            </Col>
            <Col span={18}>
              <Typography.Text>{line?.name}</Typography.Text>
            </Col>
          </Row>
          <Row gutter={12}>
            <Col span={6}>
              <Typography.Text type="secondary">Phone:</Typography.Text>
            </Col>
            <Col span={18}>
              <Typography.Text>{line?.phone}</Typography.Text>
            </Col>
          </Row>

          <Row gutter={12}>
            <Col span={6}>
              <Typography.Text type="secondary">Address:</Typography.Text>
            </Col>
            <Col span={18}>
              <Typography.Text>
                {`${line?.address1} ${line?.address2}`}
              </Typography.Text>
            </Col>
          </Row>
          <Row gutter={12}>
            <Col span={6}>
              <Typography.Text type="secondary">City:</Typography.Text>
            </Col>
            <Col span={18}>
              <Typography.Text>{line?.city}</Typography.Text>
            </Col>
          </Row>
          <Row gutter={12}>
            <Col span={6}>
              <Typography.Text type="secondary">State:</Typography.Text>
            </Col>
            <Col span={18}>
              <Typography.Text>{line?.province}</Typography.Text>
            </Col>
          </Row>
          <Row gutter={12}>
            <Col span={6}>
              <Typography.Text type="secondary">Zip:</Typography.Text>
            </Col>
            <Col span={18}>
              <Typography.Text>{line?.zip}</Typography.Text>
            </Col>
          </Row>
          <Row gutter={12}>
            <Col span={6}>
              <Typography.Text type="secondary">Country:</Typography.Text>
            </Col>
            <Col span={18}>
              <Typography.Text>{line?.country}</Typography.Text>
            </Col>
          </Row>
        </Space>
      ))}
    </Card>
  );
};

export default AddressesCard;
