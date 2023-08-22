import React, { useState } from "react";
import { Card, Row, Col, Image, Typography, Space, Tag, Skeleton } from "antd";

import { getMediaURL } from "../../../../utils";
import numeral from "numeral";

const ProductCard = ({ loading, data }) => {
  const [visible, setVisible] = useState(false);
	
	

  // get first variant
  const getFirstVariant = () => {
    const sorted = data?.attributes?.variants?.data?.sort(
      (a, b) => a.attributes.price - b.attributes.price
    );
    return sorted?.length > 0 ? sorted[0] : {};
  };

  // get stock count
  const getStock = () => {
    return data?.attributes?.variants?.data?.reduce(
      (total, item) => total + parseInt(item?.attributes?.stock || 0),
      0
    );
  };

  // get images
  const getMedia = () => {
    return data?.attributes?.images?.data?.map((media) =>
      getMediaURL(media?.attributes?.url || "")
    );
  };

  // get sold count
  const getSoldCount = () => {
    return data?.attributes?.variants?.data?.reduce(
      (total, item) => total + parseInt(item?.attributes?.sold || 0),
      0
    );
  };

  // get stock count
  const getStockCount = () => {
    return data?.attributes?.variants?.data?.reduce(
      (total, item) => total + parseInt(item?.attributes?.stock || 0),
      0
    );
  };

  const isOnSale = () => {
    return data?.attributes?.variants?.data?.every(
      (item) => item.attributes.price > item.attributes.salePrice
    );
  };

  return (
    <Card bordered={false} className="mb-6" loading={loading}>
      <Row justify="space-between" gutter={24}>
        <Col
          span={24}
          md={{ span: 12 }}
          lg={{ span: 24 }}
          xl={{ span: 12 }}
          className="mb-6"
        >
          {getMedia()?.length > 0 ? (
            <>
              <Image
                className="rounded"
                preview={{ visible: false }}
                src={getMedia()[0]}
                onClick={() => setVisible(true)}
              />
              <div className="hidden">
                <Image.PreviewGroup
                  preview={{
                    visible,
                    onVisibleChange: (vis) => setVisible(vis),
                  }}
                >
                  {getMedia()?.map((val) => (
                    <Image key={val} src={val} />
                  ))}
                </Image.PreviewGroup>
              </div>
            </>
          ) : (
            <Skeleton.Image
              className="w-100 h-100"
              style={{ minHeight: "360px" }}
            ></Skeleton.Image>
          )}
        </Col>
        <Col
          span={24}
          md={{ span: 12 }}
          lg={{ span: 24 }}
          xl={{ span: 12 }}
          className="d-flex flex-column justify-space-between mb-6"
        >
          <Space direction="vertical" size="middle" className="w-100">
            <div>
              <Typography.Paragraph ellipsis strong className="mb-2">
                {data?.attributes?.name}
              </Typography.Paragraph>
              <Typography.Text type="secondary" className="mb-4 d-block">
                {getFirstVariant()?.attributes?.sku || "NA"}
              </Typography.Text>
              <Row className="flex-column">
                {isOnSale() && (
                  <Tag
                    color="cyan"
                    className="mr-0 uppercase border-none mb-4 px-4 py-3"
                  >
                    sale
                  </Tag>
                )}

                {getStock() > 0 ? (
                  <Tag
                    color="success"
                    className="mr-0 uppercase border-none py-3 px-4 mb-4"
                  >
                    in stock
                  </Tag>
                ) : (
                  <Tag
                    color="error"
                    className="mr-0 uppercase border-none py-3 px-4  mb-4"
                  >
                    out of stock
                  </Tag>
                )}

                {data?.attributes?.status == "archived" ? (
                  <Tag
                    color="volcano"
                    className="mr-0 uppercase border-none py-3 px-4 mb-4"
                  >
                    archived
                  </Tag>
                ) : (
                  <Tag
                    color="pink"
                    className="mr-0 uppercase border-none py-3 px-4  mb-4"
                  >
                    active
                  </Tag>
                )}
              </Row>
            </div>
          </Space>
          <Space direction="vertical" size="middle" className="w-100">
            <Tag className="py-3 px-3 border-none d-flex align-center justify-space-between ma-0">
              <Typography.Text className="uppercase text-xs" type="secondary">
                Price
              </Typography.Text>
              <Row className="gap-2">
                {getFirstVariant()?.attributes?.price >
                  getFirstVariant()?.attributes?.salePrice && (
                  <Typography.Text type="secondary" delete>
                    {numeral(getFirstVariant()?.attributes?.price).format(
                      "0.00"
                    )}
                  </Typography.Text>
                )}
                <Typography.Text type="success">
                  {numeral(getFirstVariant()?.attributes?.salePrice).format(
                    "0.00"
                  )}
                </Typography.Text>
              </Row>
            </Tag>
            <Tag className="py-3 px-3 border-none d-flex align-center justify-space-between mr-0">
              <Typography.Text className="uppercase text-xs" type="secondary">
                Sold
              </Typography.Text>
              <Typography.Text>{getSoldCount()}</Typography.Text>
            </Tag>
            <Tag className="py-3 px-3 border-none d-flex align-center justify-space-between  mr-0">
              <Typography.Text className="uppercase text-xs" type="secondary">
                Stock
              </Typography.Text>
              <Typography.Text>{getStockCount()}</Typography.Text>
            </Tag>
          </Space>
        </Col>
        <Col span={24}>
          <Typography.Paragraph ellipsis strong className="mb-1">
            Description
          </Typography.Paragraph>
          <Typography.Text type="secondary">
            <div
              dangerouslySetInnerHTML={{
                __html: data?.attributes?.description || "NA",
              }}
            ></div>
          </Typography.Text>
        </Col>
      </Row>
    </Card>
  );
};

export default ProductCard;
ProductCard.defaultProps = {
  data: {},
  loading: false,
};
