import React, { useMemo } from "react";
import { Card, Input, Form, Radio, Select, DatePicker, Row, Col } from "antd";
import { usePlatformsData } from "../../../../hooks/data/useSettingData";
import { MdExpandMore } from "react-icons/md";

const DetailsCard = ({ loading }) => {
  const { isLoading, data } = usePlatformsData();

  const platformsData = useMemo(
    () =>
      data?.data?.data?.map((item) => ({
        value: item.id?.toString(),
        label: item.attributes.name,
      })),
    [data]
  );

  return (
    <Card
      title="Order Details"
      className="mb-6"
      bordered={false}
      loading={loading}
    >
      <Form.Item
        name="platform"
        label="Platform"
        rules={[{ required: true, message: "Platform is required." }]}
      >
        <Select
          placeholder="Select platform"
          options={platformsData || []}
          loading={isLoading}
          size="large"
          suffixIcon={<MdExpandMore className="text-lg" />}
        />
      </Form.Item>

      <Row gutter={24}>
        <Col span={24} lg={{ span: 12 }}>
          <Form.Item
            name="orderDate"
            label="Order Date"
            rules={[{ required: true, message: "Order date is required." }]}
          >
            <DatePicker
              size="large"
              className="w-100"
              placeholder="DD-MM-YYYY"
              disabledDate={(current) => current && current > new Date()}
              format="DD-MM-YYYY"
            />
          </Form.Item>
        </Col>
        <Col span={24} lg={{ span: 12 }}>
          <Form.Item
            name="name"
            label="Order ID"
            rules={[{ required: true, message: "Order ID is required." }]}
          >
            <Input size="large" />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={24} lg={{ span: 12 }}>
          <Form.Item
            name="paymentMode"
            label="Payment"
            rules={[{ required: true, message: "Payment mode is required." }]}
          >
            <Radio.Group size="large">
              <Radio.Button value="cod">COD</Radio.Button>
              <Radio.Button value="prepaid">Prepaid</Radio.Button>
            </Radio.Group>
          </Form.Item>
        </Col>
        <Col span={24} lg={{ span: 12 }}>
          <Form.Item
            name="type"
            label="Type"
            rules={[{ required: true, message: "Order type is required." }]}
          >
            <Radio.Group size="large">
              <Radio.Button value="new">New</Radio.Button>
              <Radio.Button value="return">Return</Radio.Button>
              <Radio.Button value="exchange">Exchange</Radio.Button>
            </Radio.Group>
          </Form.Item>
        </Col>
      </Row>
    </Card>
  );
};

export default DetailsCard;
