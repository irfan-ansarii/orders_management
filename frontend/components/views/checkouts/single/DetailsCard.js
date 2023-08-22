import React from "react";
import { Row, Col, Card, Tag, Typography } from "antd";
import {
  MdSouth,
  MdCurrencyRupee,
  MdLocationOn,
  MdDiscount,
  MdCalendarMonth,
} from "react-icons/md";
import numeral from "numeral";
import moment from "moment";
const DetailsCard = ({ data, loading }) => {
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
          loading={loading}
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
            <MdCalendarMonth className="text-md" />
          </Tag>

          <Typography.Text
            className="d-block text-xs uppercase mt-3"
            type="secondary"
          >
            DATE
          </Typography.Text>
          <Typography.Text className="d-block my-1">
            <MdSouth />
          </Typography.Text>
          <Typography.Text className="d-block text-xs uppercase">
            {moment(data?.attributes?.createdAt).format("DD MMM, YYYY")}
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
          loading={loading}
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
            <MdDiscount className="text-md" />
          </Tag>

          <Typography.Text
            className="d-block text-xs uppercase mt-3"
            type="secondary"
          >
            Items
          </Typography.Text>
          <Typography.Text className="d-block my-1">
            <MdSouth />
          </Typography.Text>
          <Typography.Text className="d-block text-xs uppercase">
            {data?.attributes?.lineItems.length} item(s)
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
          loading={loading}
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
            <MdCurrencyRupee className="text-md" />
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

          <Typography.Text className="d-block text-xs uppercase">
            {numeral(data?.attributes?.total).format("0.00")}
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
          loading={loading}
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
            city
          </Typography.Text>
          <Typography.Text className="d-block my-1">
            <MdSouth />
          </Typography.Text>
          <Typography.Text className="d-block text-xs uppercase">
            {data?.attributes?.shippingAddress?.city ||
              data?.attributes?.billingAddress?.province ||
              data?.attributes?.customer?.data?.attributes?.defaultAddress
                ?.province}
          </Typography.Text>
        </Card>
      </Col>
    </Row>
  );
};

export default DetailsCard;
