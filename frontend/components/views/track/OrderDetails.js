import React from "react";
import { Typography, List, Tag } from "antd";

import numeral from "numeral";
const { Text } = Typography;
const OrderDetails = ({ data }) => {
  return (
    <>
      <Tag className="d-block px-4 py-2 mr-0 border-none">
        <List>
          <List.Item className="py-2">
            <List.Item.Meta description={<Text>Order ID</Text>} />
            <Text className="uppercase">{data?.attributes?.name}</Text>
          </List.Item>
          <List.Item className="py-2">
            <List.Item.Meta description={<Text>Total Items</Text>} />
            <Text>{data?.attributes?.lineItems?.data?.length}</Text>
          </List.Item>
          <List.Item className="py-2">
            <List.Item.Meta description={<Text>Total Amount</Text>} />
            <Text>{numeral(data?.attributes?.total).format("0,0.00")}</Text>
          </List.Item>
          <List.Item className="py-2">
            <List.Item.Meta description={<Text>Payment Method</Text>} />
            <Text className="uppercase"> {data?.attributes?.paymentMode}</Text>
          </List.Item>
        </List>
      </Tag>
    </>
  );
};

export default OrderDetails;
