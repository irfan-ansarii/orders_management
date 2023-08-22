import React from "react";
import { useRouter } from "next/router";
import { Card, Col, Row, Typography, Avatar, Tag, Space } from "antd";

import { getAvatarName } from "../../../../utils";
import { getMediaURL } from "../../../../utils";
import numeral from "numeral";

const CustomerCard = ({ data, loading }) => {
  const router = useRouter();
  const handleClick = () => {
    router.push(`/customers/${data?.id}`);
  };
  const getTotalSpent = () => {
    const total = data?.attributes?.orders?.data?.reduce(
      (sum, line) => sum + parseFloat(line?.attributes?.total),
      0
    );
    return total;
  };
  return (
    <Card
      bordered={false}
      className="mb-6 overflow-hidden pa-2 pointer"
      loading={loading}
      size="small"
      onClick={handleClick}
    >
      <Space direction="vertical" className="w-100" size="middle">
        <Row align="top" gutter={12} justify="space-between" wrap={false}>
          <Col span={7}>
            <Typography.Text ellipsis className="d-block">
              {data?.attributes?.name}
            </Typography.Text>
            <Typography.Text type="secondary">
              {data?.attributes?.defaultAddress?.province ||
                data?.attributes?.defaultAddress?.city ||
                data?.attributes?.defaultAddress?.country}
            </Typography.Text>
          </Col>

          <Col span={10}>
            <Typography.Text className="d-block">Phone</Typography.Text>
            {data?.attributes?.phone && (
              <Typography.Text type="secondary" className="d-block" ellipsis>
                {data?.attributes?.phone}
              </Typography.Text>
            )}
          </Col>
          <Col span={7} className="text-right">
            <Typography.Text
              type="secondary"
              className="d-block uppercase text-xs"
            >
              Orders
            </Typography.Text>
            <Typography.Text type="success">
              {data?.attributes?.orders?.data?.length}
            </Typography.Text>
          </Col>
        </Row>
        <Tag className="py-2 border-none d-block ma-0">
          <Row justify="space-between" align="middle" gutter={12}>
            <Col span={7} className="d-flex">
              <Avatar size={40} src={getMediaURL(data?.image?.url)}>
                {getAvatarName(data?.attributes?.name)}
              </Avatar>
            </Col>
            <Col span={10}>
              <Typography.Text className="d-block">Email</Typography.Text>
              <Typography.Text type="secondary" className="d-block" ellipsis>
                {data?.attributes?.email}
              </Typography.Text>
            </Col>
            <Col span={7} className="text-right">
              <Typography.Text
                type="secondary"
                className="d-block uppercase text-xs"
              >
                total spent
              </Typography.Text>
              <Typography.Text type="success">
                {numeral(getTotalSpent()).format("0,0.00")}
              </Typography.Text>
            </Col>
          </Row>
        </Tag>
      </Space>
    </Card>
  );
};

export default CustomerCard;
