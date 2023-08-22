import React from "react";
import Link from "next/link";
import {
  Row,
  Col,
  Avatar,
  Typography,
  Card,
  Divider,
  List,
  Tag,
  Space,
  Skeleton,
} from "antd";
import numeral from "numeral";
import { getMediaURL } from "../../../../utils";
import { RiImage2Fill } from "react-icons/ri";
const { Text } = Typography;

const ItemsCard = ({ data, isLoading }) => {
  return (
    <Card className="mb-6 table-card" bordered={false} title="Products">
      {isLoading ? (
        <Skeleton className="pa-6" active avatar paragraph={{ rows: 5 }} />
      ) : (
        <List
          className="px-4 py-4 has-hover"
          dataSource={data?.attributes?.lineItems?.data}
          renderItem={(item, index) => (
            <List.Item className="py-2 px-2">
              <Link
                href={
                  item?.attributes?.product?.data?.id
                    ? `/products/${item?.attributes?.product?.data?.id}`
                    : "javascript:;"
                }
                className="d-flex w-100"
              >
                <List.Item.Meta
                  avatar={
                    <Avatar
                      size={60}
                      className="d-inline-flex justify-center align-center"
                      shape="square"
                      icon={<RiImage2Fill />}
                      src={getMediaURL(
                        item?.attributes?.product?.data?.attributes?.image?.data
                          ?.attributes?.formats?.thumbnail?.url
                      )}
                    />
                  }
                  title={item.attributes.name}
                  description={
                    <>
                      <Tag className="border-none  px-2">
                        {item.attributes.variantName}
                      </Tag>
                      <Space className="w-100">
                        {/* original price */}
                        {item.attributes.price > item.attributes.salePrice && (
                          <Typography.Text
                            type="secondary"
                            className="text-xs"
                            delete
                          >
                            {numeral(item.attributes.price).format("0.00")}
                          </Typography.Text>
                        )}
                        {/* sale prices */}
                        <Typography.Text type="secondary" className="text-xs">
                          {numeral(item.attributes.salePrice).format("0.00")}
                        </Typography.Text>

                        {/* quantity */}
                        <Typography.Text type="secondary" className="text-xs">
                          <span className="mr-1">x</span>
                          {item.attributes.quantity}
                        </Typography.Text>

                        {/* discount */}
                        {item.attributes.discount > 0 && (
                          <Typography.Text type="secondary" className="text-xs">
                            <span className="mr-1">-</span>
                            {numeral(item.attributes.discount).format("0,0.00")}
                          </Typography.Text>
                        )}
                      </Space>
                    </>
                  }
                />
                <div className="d-flex flex-column align-end justify-end">
                  <Typography.Text
                    type="secondary"
                    className="text-xs uppercase font-medium mb-3"
                  >
                    Total
                  </Typography.Text>

                  <Typography.Text>
                    {numeral(
                      (item.attributes.salePrice - item.attributes.discount) *
                        item.attributes.quantity
                    ).format("0.00")}
                  </Typography.Text>
                </div>
              </Link>
            </List.Item>
          )}
        />
      )}
      <div className="px-6">
        <Divider className="mt-1" />
      </div>
      {isLoading ? (
        <Skeleton active className="pa-6 pt-3" />
      ) : (
        <Row gutter={12} className="px-6">
          {data?.attributes?.note && (
            <Col span={24} className="mb-6">
              <Typography.Text type="secondary">Note:</Typography.Text>
              <Typography.Text className="d-block">
                {data?.attributes?.note}
              </Typography.Text>
            </Col>
          )}
          <Col span={24} className="mb-6 ">
            <Tag className="d-block px-3 py-1 border-none mr-0">
              <List>
                <List.Item className="py-2">
                  <List.Item.Meta
                    description={
                      <>
                        <Text className="mr-10">Subtotal</Text>
                        <Typography.Text type="secondary" className="text-xs">
                          {data?.attributes?.lineItems?.data?.length} Item(s)
                        </Typography.Text>
                      </>
                    }
                  />
                  <Text>
                    {numeral(data?.attributes?.subtotal).format("0.00")}
                  </Text>
                </List.Item>

                <List.Item className="py-2">
                  <List.Item.Meta
                    description={
                      <>
                        <Text>Discount</Text>
                        <Text type="secondary" className="text-xs ml-10">
                          {data?.attributes?.discountCodes?.map((el, i) => (
                            <span key={i} className="mr-2">
                              {el.code}
                            </span>
                          ))}
                        </Text>
                      </>
                    }
                  />
                  <Text>
                    {numeral(data?.attributes?.discountTotal).format("0.00")}
                  </Text>
                </List.Item>

                <List.Item className="py-2">
                  <List.Item.Meta
                    description={
                      <>
                        <Text className="mr-10">Tax</Text>
                        <Text type="secondary" className="text-xs">
                          {data?.attributes?.taxLines?.map((el, i) => (
                            <span key={i} className="mr-2 gap-2 d-inline-flex">
                              <span>{el.title}:</span>
                              <span>{el.price}</span>
                            </span>
                          ))}
                        </Text>
                      </>
                    }
                  />
                  <Text>
                    {numeral(data?.attributes?.taxTotal).format("0.00")}
                  </Text>
                </List.Item>
                <List.Item className="py-2">
                  <List.Item.Meta description={<Text>Shipping</Text>} />
                  <Text>
                    {numeral(data?.attributes?.shippingTotal).format("0.00")}
                  </Text>
                </List.Item>
                <List.Item className="py-2">
                  <List.Item.Meta description={<Text>Total</Text>} />
                  <Text>{numeral(data?.attributes?.total).format("0.00")}</Text>
                </List.Item>
              </List>
            </Tag>

            <Tag
              color="gold"
              className="mr-0 d-block d-flex justify-space-between mt-4 border-none px-4 py-3 text-sm"
            >
              <span>Due</span>
              <span>
                {numeral(data?.attributes?.outstandingTotal).format("0.00")}
              </span>
            </Tag>
          </Col>
        </Row>
      )}
    </Card>
  );
};

export default ItemsCard;
ItemsCard.defaultProps = {
  data: {},
  loading: false,
};
