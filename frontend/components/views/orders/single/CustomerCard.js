import React from "react";
import { useRouter } from "next/router";
import { Card, Row, Col, Typography, Space, Avatar, Tag } from "antd";
import { MdPerson } from "react-icons/md";
const CustomerCard = ({ data, isLoading }) => {
  const router = useRouter();

  return (
    <Card bordered={false} title="Customer Details" loading={isLoading}>
      <Tag
        className="d-flex gap-6 align-center pointer border-none px-6 py-6"
        style={{ marginInline: "-28px", marginBlock: "-28px 20px" }}
        onClick={() =>
          router.push(`/customers/${data?.attributes?.customer?.data?.id}`)
        }
      >
        <Avatar
          shape="square"
          icon={<MdPerson />}
          size={60}
          className="d-flex align-center justify-center"
        />
        <div className="flex-grow-1">
          <div>{data?.attributes?.customer?.data?.attributes?.name}</div>

          <div>{data?.attributes?.customer?.data?.attributes?.phone}</div>

          <div>{data?.attributes?.customer?.data?.attributes?.email}</div>
        </div>
      </Tag>
      {/* <Divider dashed className="my-4" /> */}
      <Space direction="vertical" className="w-100">
        <Row gutter={12}>
          <Col span={6}>
            <Typography.Text type="secondary">Name:</Typography.Text>
          </Col>
          <Col span={18}>
            <Typography.Text>
              {data?.attributes?.shippingAddress?.name}
            </Typography.Text>
          </Col>
        </Row>
        <Row gutter={12}>
          <Col span={6}>
            <Typography.Text type="secondary">Phone:</Typography.Text>
          </Col>
          <Col span={18}>
            <Typography.Text copyable>
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
            <Typography.Text copyable>
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
              {`${data?.attributes?.shippingAddress?.address1} ${data?.attributes?.shippingAddress?.address2}`}
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
CustomerCard.defaultProps = {
  data: {},
  isLoading: false,
};
