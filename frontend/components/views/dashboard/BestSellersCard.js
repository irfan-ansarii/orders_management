import React, { useMemo } from "react";
import Link from "next/link";
import {
  Card,
  Avatar,
  List,
  Typography,
  Progress,
  Row,
  Tag,
  Tooltip,
  Button,
} from "antd";
import numeral from "numeral";
import { RiImage2Fill } from "react-icons/ri";
import { getMediaURL } from "../../../utils";

const BestSellersCard = ({ loading, orders }) => {
  const bestSellers = useMemo(() => {
    if (!orders || !Array.isArray(orders)) return [];

    const products = orders.flatMap((order) =>
      order.attributes.lineItems.data?.map((item) => {
        return {
          productId: item.attributes.product.data?.id,
          image:
            item.attributes.product.data?.attributes?.image?.data?.attributes
              ?.url,
          productName: item.attributes.name,
          variantName: item.attributes.variantName,
          value: item.attributes.salePrice,
        };
      })
    );

    return products
      .reduce((acc, curr) => {
        const value = curr.value;
        const productId = curr.productId;
        const productName = curr.productName;
        const variantName = curr.variantName;

        const index = acc.findIndex(
          (item) =>
            item.productId == productId && item.productName == productName
        );

        if (index !== -1) {
          acc[index] = {
            ...acc[index],
            productName,
            variantName,
            value: acc[index].value + value,
            count: acc[index].count + 1,
          };
        } else {
          acc.push({
            productId,
            productName,
            variantName,
            value,
            count: 1,
            image: curr.image,
          });
        }
        return acc;
      }, [])
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [orders]);

  return (
    <Card
      bordered={false}
      title="Best Sellers"
      className="table-card h-100"
      loading={loading}
    >
      <List
        className="px-4 py-4 has-hover"
        dataSource={bestSellers}
        renderItem={(item, index) => (
          <>
            <List.Item className="py-2 px-2">
              <Link
                href={
                  item.productId
                    ? `/products/${item.productId}`
                    : "javascript:void(0)"
                }
                className="d-flex w-100 align-end"
              >
                <List.Item.Meta
                  avatar={
                    <Avatar
                      size={46}
                      src={getMediaURL(item.image)}
                      shape="square"
                      className="d-flex align-center justify-center"
                      icon={<RiImage2Fill />}
                    />
                  }
                  title={item.productName}
                  description={
                    item.variantName && (
                      <Tag className="border-none">{item.variantName}</Tag>
                    )
                  }
                />

                <div style={{ width: "80px" }}>
                  <Typography.Text type="secondary">
                    <Row justify="space-between" className="text-xs uppercase">
                      <span>Sold</span>
                      <span>{item.count}</span>
                    </Row>
                  </Typography.Text>
                  <Typography.Text className="text-right d-block">
                    <Tooltip
                      title={`Amount ${numeral(item.value).format("0,0.00")}`}
                    >
                      <Progress
                        percent={(item.value / bestSellers[0].value) * 100}
                        showInfo={false}
                        size="small"
                        className="ma-0"
                      />
                    </Tooltip>
                  </Typography.Text>
                </div>
              </Link>
            </List.Item>
            {index === bestSellers.length - 1 && (
              <Button className="mt-2" block type="link">
                View All
              </Button>
            )}
          </>
        )}
      />
    </Card>
  );
};

export default BestSellersCard;
BestSellersCard.defaultProps = { loading: false, orders: [] };
