import React from "react";

import { Card, Input, Form, Row, Col } from "antd";

const CustomerCard = ({ loading }) => {
  return (
    <Card
      title="Shipping Address"
      className="mb-6"
      bordered={false}
      loading={loading}
    >
      <Row gutter={24}>
        <Col span={24} lg={{ span: 12 }}>
          <Form.Item
            name={["shippingAddress", "name"]}
            label="Full Name"
            rules={[{ required: true, messsage: "Name is required." }]}
          >
            <Input size="large" />
          </Form.Item>
        </Col>
        <Col span={24} lg={{ span: 12 }}>
          <Form.Item
            className="d-none"
            name={["shippingAddress", "country_code"]}
          >
            <Input size="large" />
          </Form.Item>
          <Form.Item className="d-none" name="customer">
            <Input size="large" />
          </Form.Item>
          <Form.Item
            name={["shippingAddress", "phone"]}
            label="Phone"
            rules={[
              {
                required: true,
                messsage: "Phone is required.",
              },
            ]}
          >
            <Input size="large" />
          </Form.Item>
        </Col>

        <Col span={24} lg={{ span: 12 }}>
          <Form.Item
            name={["shippingAddress", "address1"]}
            label="Address"
            rules={[{ required: true, messsage: "Address is required." }]}
          >
            <Input size="large" />
          </Form.Item>
        </Col>
        <Col span={24} lg={{ span: 12 }}>
          <Form.Item name={["shippingAddress", "address2"]} label="Address 2">
            <Input size="large" />
          </Form.Item>
        </Col>
        <Col span={24} lg={{ span: 12 }}>
          <Form.Item
            name={["shippingAddress", "zip"]}
            label="Zipcode"
            rules={[{ required: true, messsage: "Zipcode is required." }]}
          >
            <Input size="large" />
          </Form.Item>
        </Col>
        <Col span={24} lg={{ span: 12 }}>
          <Form.Item
            name={["shippingAddress", "city"]}
            label="City"
            rules={[{ required: true, messsage: "City is required." }]}
          >
            <Input size="large" />
          </Form.Item>
        </Col>
        <Col span={24} lg={{ span: 12 }}>
          <Form.Item
            name={["shippingAddress", "province"]}
            label="State"
            rules={[{ required: true, messsage: "State is required." }]}
          >
            <Input size="large" />
          </Form.Item>
        </Col>
        <Col span={24} lg={{ span: 12 }}>
          <Form.Item
            name={["shippingAddress", "country"]}
            label="Country"
            rules={[{ required: true, messsage: "Country is required." }]}
          >
            <Input size="large" />
          </Form.Item>
        </Col>
      </Row>
    </Card>
  );
};

export default CustomerCard;
