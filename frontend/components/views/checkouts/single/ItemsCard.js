import React from "react";
import {
  Row,
  Col,
  Typography,
  Card,
  Divider,
  List,
  Tag,
  Space,
  Skeleton,
} from "antd";
import numeral from "numeral";
const { Text } = Typography;

const ItemsCard = ({ data, loading }) => {
  const getDiscount = (items = []) => {
    return items.reduce((sum, line) => sum + parseFloat(line.amount), 0);
  };

  return (
    <Card className="mb-6 table-card" bordered={false} title="Products">
      {loading ? (
        <Skeleton className="pa-6" active avatar paragraph={{ rows: 5 }} />
      ) : (
        <List
          className="px-4 py-4 "
          dataSource={data?.attributes?.lineItems}
          renderItem={(item) => (
            <List.Item className="py-2 px-2">
              <List.Item.Meta
                title={`${item.title}`}
                description={
                  <>
                    <Tag className="border-none py-1 px-2">
                      {item.variant_title}
                    </Tag>
                    <Space className="w-100">
                      {item.price > item.sale_price && (
                        <Typography.Text
                          type="secondary"
                          className="text-xs"
                          delete
                        >
                          {numeral(item.price).format("0.00")}
                        </Typography.Text>
                      )}

                      <Typography.Text type="secondary" className="text-xs">
                        {numeral(item.sale_price).format("0.00")}
                      </Typography.Text>
                      <Typography.Text type="secondary" className="text-xs">
                        <span className="mr-1">x</span>
                        {item.quantity}
                      </Typography.Text>
                    </Space>
                  </>
                }
              />
              <div className="d-flex flex-column align-end justify-end">
                <Typography.Text
                  type="secondary"
                  className="text-xs uppercase font-medium mb-3 "
                >
                  Total
                </Typography.Text>
                <div>
                  <Typography.Text>
                    {numeral(item.sale_price * item.quantity).format("0.00")}
                  </Typography.Text>
                </div>
              </div>
            </List.Item>
          )}
        />
      )}
      <div className="px-6">
        <Divider className="mt-1" />
      </div>
      {loading ? (
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
            <Tag className="d-block px-3 mr-0 py-1 border-none">
              <List>
                <List.Item className="py-2">
                  <List.Item.Meta
                    description={
                      <>
                        <Text className="mr-10">Subtotal</Text>
                        <Typography.Text type="secondary" className="text-xs">
                          {data?.attributes?.lineItems?.length} Item(s)
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
                        <Text className="mr-10">Discount</Text>
                        <Text type="secondary" className="text-xs">
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
          </Col>
        </Row>
      )}
    </Card>
  );
};

export default ItemsCard;
