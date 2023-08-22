import React from "react";
import { Card, Divider, Row, Col, Avatar, Typography } from "antd";
import { getMediaURL } from "../../../../utils";
import numeral from "numeral";
import { RiImageFill } from "react-icons/ri";
const VariantsCard = ({ data, loading }) => {
  // get media url
  const getImageSrc = (variant) => {
    let imageUrl = getMediaURL(
      variant?.attributes?.image?.data?.attributes?.url
    );
    if (imageUrl) return imageUrl;

    return getMediaURL(data?.attributes?.images?.data?.[0]?.attributes?.url);
  };

  if (
    data?.attributes?.variants?.data?.length === 1 &&
    data?.attributes?.options?.[0]?.name?.toLowerCase() === "title" &&
    !loading
  ) {
    return;
  }

  return (
    <Card
      bordered={false}
      className="mb-6 table-card"
      title="Variants"
      loading={loading}
    >
      <div className="px-6 py-4">
        {data?.attributes?.variants?.data?.map((variant, i) => (
          <div key={variant.id}>
            <Row justify="space-between" className="gap-6">
              <Col span={24} sm={{ span: 8 }}>
                <Row align="middle" className="gap-4">
                  <Avatar
                    className="d-flex align-center justify-center"
                    size={50}
                    shape="square"
                    src={getImageSrc(variant)}
                    icon={<RiImageFill />}
                  />

                  <Col flex="1">
                    <div>
                      <Typography.Text
                        className="uppercase"
                        key={`${variant?.attributes?.name}`}
                      >
                        {variant?.attributes?.name}
                      </Typography.Text>
                    </div>
                    <Typography.Text
                      type="secondary"
                      className="text-xs upperrcase"
                    >
                      {variant?.attributes?.sku}
                    </Typography.Text>
                  </Col>
                </Row>
              </Col>
              <Col className="text-right">
                <Typography.Text
                  type="secondary"
                  className="text-xs uppercase d-block"
                >
                  Price
                </Typography.Text>
                {variant?.attributes?.price >
                  variant?.attributes?.salePrice && (
                  <Typography.Text
                    className="text-xs mr-2"
                    delete
                    type="secondary"
                  >
                    {numeral(variant?.attributes?.price).format("0.00")}
                  </Typography.Text>
                )}
                <Typography.Text type="success">
                  {numeral(variant?.attributes?.salePrice).format("0.00")}
                </Typography.Text>
              </Col>
              <Col className="text-right">
                <Typography.Text
                  type="secondary"
                  className="text-xs uppercase d-block"
                >
                  sold
                </Typography.Text>
                <Typography.Text>
                  {variant?.attributes?.sold || 0}
                </Typography.Text>
              </Col>
              <Col className="text-right">
                <Typography.Text
                  type="secondary"
                  className="text-xs uppercase d-block"
                >
                  stock
                </Typography.Text>
                <Typography.Text>
                  {variant?.attributes?.stock || 0}
                </Typography.Text>
              </Col>
            </Row>

            {data?.attributes?.variants?.data?.length - 1 !== i && (
              <Divider className="my-4" />
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};

export default VariantsCard;
VariantsCard.defaultProps = {
  data: {},
  loading: false,
};
