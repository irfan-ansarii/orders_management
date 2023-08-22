import React from "react";
import { List, Avatar, Typography, Tag, Space } from "antd";
import { getAvatarName, getMediaURL } from "../../../utils";
import numeral from "numeral";
const { Text } = Typography;
const ItemDetails = ({ data }) => {
  return (
    <List className="mt-6">
      {data?.attributes?.lineItems?.data?.map((item) => (
        <List.Item key={item.id}>
          <List.Item.Meta
            avatar={
              <Avatar
                shape="square"
                size={50}
                src={getMediaURL(
                  item.attributes?.product?.data?.attributes?.image?.data
                    ?.attributes?.formats?.thumbnail?.url
                )}
              >
                {getAvatarName(item.attributes.name)}
              </Avatar>
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
                    <Text type="secondary" className="text-xs" delete>
                      {numeral(item.attributes.price).format("0.00")}
                    </Text>
                  )}
                  {/* sale prices */}
                  <Text type="secondary" className="text-xs">
                    {numeral(item.attributes.salePrice).format("0.00")}
                  </Text>

                  {/* quantity */}
                  <Text type="secondary" className="text-xs">
                    <span className="mr-1">x</span>
                    {item.attributes.quantity}
                  </Text>

                  {/* discount */}
                  {item.attributes.discount > 0 && (
                    <Text type="secondary" className="text-xs">
                      <span className="mr-1">-</span>
                      {numeral(item.attributes.discount).format("0,0.00")}
                    </Text>
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
        </List.Item>
      ))}
    </List>
  );
};

export default ItemDetails;
