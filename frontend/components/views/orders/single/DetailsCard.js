import React from "react";
import { Row, Col, Card, Tag, Typography } from "antd";
import {
  MdCreditCard,
  MdSouth,
  MdCurrencyRupee,
  MdLocationOn,
  MdStickyNote2,
  MdOutlineDoneAll,
} from "react-icons/md";
import numeral from "numeral";
const DetailsCard = ({ data, isLoading }) => {
  return (
    <Row gutter={24}>
      <Col
        span={12}
        md={{ span: 6 }}
        lg={{ span: 12 }}
        xl={{ span: 6 }}
        className="mb-6"
      >
        <Card
          loading={isLoading}
          size="small"
          className="text-center h-100"
          bordered={false}
          style={{ borderBottom: "2px solid #c41d7f" }}
        >
          <Tag
            color="magenta"
            className="d-inline-flex ma-0 align-center justify-center d-block"
            style={{ width: "2.4rem", height: "2.4rem" }}
          >
            <MdStickyNote2 className="text-md" />
          </Tag>

          <Typography.Text
            className="d-block text-xs uppercase mt-3"
            type="secondary"
          >
            ORDER ID
          </Typography.Text>
          <Typography.Text className="d-block my-1">
            <MdSouth />
          </Typography.Text>
          <Typography.Text className="d-block text-xs uppercase">
            {data?.attributes?.name}
          </Typography.Text>
        </Card>
      </Col>
      <Col
        span={12}
        md={{ span: 6 }}
        lg={{ span: 12 }}
        xl={{ span: 6 }}
        className="mb-6"
      >
        <Card
          loading={isLoading}
          size="small"
          className="text-center h-100"
          bordered={false}
          style={{ borderBottom: "2px solid #08979c" }}
        >
          <Tag
            color="cyan"
            className="d-inline-flex ma-0 align-center justify-center d-block"
            style={{ width: "2.4rem", height: "2.4rem" }}
          >
            <MdCurrencyRupee />
          </Tag>

          <Typography.Text
            className="d-block text-xs uppercase mt-3"
            type="secondary"
          >
            amount
          </Typography.Text>
          <Typography.Text className="d-block my-1">
            <MdSouth />
          </Typography.Text>

          <Tag
            style={{ border: "none" }}
            color={
              data?.attributes?.paymentMode === "prepaid" ? "success" : "orange"
            }
            className="mr-0 d-inline-flex align-center"
          >
            {numeral(data?.attributes?.total).format("0.00")}

            {data?.attributes?.remittance && (
              <MdOutlineDoneAll className="ml-1" />
            )}
          </Tag>
        </Card>
      </Col>
      <Col
        span={12}
        md={{ span: 6 }}
        lg={{ span: 12 }}
        xl={{ span: 6 }}
        className="mb-6"
      >
        <Card
          loading={isLoading}
          size="small"
          className="text-center h-100"
          bordered={false}
          style={{ borderBottom: "2px solid #d46b08" }}
        >
          <Tag
            color="orange"
            className="d-inline-flex ma-0 align-center justify-center d-block"
            style={{ width: "2.4rem", height: "2.4rem" }}
          >
            <MdCreditCard className="text-md" />
          </Tag>

          <Typography.Text
            className="d-block text-xs uppercase mt-3"
            type="secondary"
          >
            Payment
          </Typography.Text>
          <Typography.Text className="d-block my-1">
            <MdSouth />
          </Typography.Text>
          <Typography.Text className="d-block text-xs uppercase">
            {data?.attributes?.paymentMode}
          </Typography.Text>
        </Card>
      </Col>
      <Col
        span={12}
        md={{ span: 6 }}
        lg={{ span: 12 }}
        xl={{ span: 6 }}
        className="mb-6"
      >
        <Card
          loading={isLoading}
          size="small"
          className="text-center h-100"
          bordered={false}
          style={{ borderBottom: "2px solid #531dab" }}
        >
          <Tag
            color="purple"
            className="d-inline-flex ma-0 align-center justify-center d-block"
            style={{ width: "2.4rem", height: "2.4rem" }}
          >
            <MdLocationOn className="text-md" />
          </Tag>

          <Typography.Text
            className="d-block text-xs uppercase mt-3"
            type="secondary"
          >
            State
          </Typography.Text>
          <Typography.Text className="d-block my-1">
            <MdSouth />
          </Typography.Text>
          <Typography.Text className="d-block text-xs uppercase">
            {data?.attributes?.shippingAddress?.province ||
              data?.attributes?.shippingAddress?.city ||
              data?.attributes?.shippingAddress?.country}
          </Typography.Text>
        </Card>
      </Col>
    </Row>
  );
};

export default DetailsCard;
DetailsCard.defaultProps = {
  data: {},
  isLoading: false,
};
