import React from "react";
import { Card, Col, Row, Typography, Tag, Space } from "antd";
import Link from "next/link";
import { MdCancel, MdCheckCircle } from "react-icons/md";
import numeral from "numeral";
import moment from "moment";

const CheckoutCard = ({ data, loading }) => {
  return (
    <Link href={`/checkouts/${data?.id}`}>
      <Card
        bordered={false}
        className="mb-6 overflow-hidden pa-2"
        loading={loading}
        size="small"
      >
        <Space direction="vertical" className="w-100" size="middle">
          <Row align="top" gutter={12} justify="space-between" wrap={false}>
            <Col span={10}>
              <Typography.Text ellipsis className="d-block">
                {data?.attributes?.checkoutId}
              </Typography.Text>
              <Typography.Text type="secondary">
                {moment(data?.attributes?.createdAt).format("DD MMM, YYYY")}
              </Typography.Text>
            </Col>
            <Col span={6}>
              <Typography.Text className="d-block">Items</Typography.Text>
              <Typography.Text type="secondary">
                {data?.attributes?.lineItems?.length}
              </Typography.Text>
            </Col>
            <Col span={8} className="text-right">
              <Typography.Text className="d-block">Amount</Typography.Text>

              <Typography.Text type="secondary">
                {numeral(data?.attributes?.total).format("0,0.00")}
              </Typography.Text>
            </Col>
          </Row>
          <Tag className="py-2 border-none d-block ma-0">
            <Row justify="space-between" align="middle" gutter={12}>
              <Col span={10}>
                <Typography.Text className="d-block" type="secondary" ellipsis>
                  {data?.attributes?.shippingAddress?.name ||
                    data?.attributes?.billingAddress?.name ||
                    data?.attributes?.customer?.data?.attributes?.name}
                </Typography.Text>

                <Typography.Text>
                  {data?.attributes?.billingAddress?.phone ||
                    data?.attributes?.shippingAddress?.phone ||
                    data?.attributes?.customer?.data?.attributes?.phone}
                </Typography.Text>
              </Col>
              <Col span={6}>
                <Typography.Text
                  type="secondary"
                  className="d-block uppercase text-xs"
                >
                  {data?.attributes?.shippingAddress?.country_code !== "IN"
                    ? "Country"
                    : "State"}
                </Typography.Text>
                <Typography.Text className="d-block">
                  {data?.attributes?.shippingAddress?.country_code !== "IN"
                    ? data?.attributes?.shippingAddress?.country
                    : data?.attributes?.billingAddress?.city ||
                      data?.attributes?.shippingAddress?.city}
                </Typography.Text>
              </Col>
              <Col span={8} className="text-right">
                <Typography.Text
                  type="secondary"
                  className="d-block uppercase text-xs"
                >
                  Status
                </Typography.Text>
                {data?.attributes?.isRecovered ? (
                  <Tag
                    color="success"
                    className="mr-0 uppercase d-inline-flex gap-1 align-center border-none"
                  >
                    <MdCheckCircle />
                    recovered
                  </Tag>
                ) : (
                  <Tag
                    color="volcano"
                    className="mr-0 uppercase gap-1 d-inline-flex align-center border-none"
                  >
                    <MdCancel />
                    not recovered
                  </Tag>
                )}
              </Col>
            </Row>
          </Tag>
        </Space>
      </Card>
    </Link>
  );
};

export default CheckoutCard;
