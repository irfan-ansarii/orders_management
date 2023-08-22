import React from "react";
import { Card, Typography } from "antd";

const CheckoutURLCard = ({ data, loading }) => {
  return (
    <Card
      title="Checkout URL"
      className="mb-6"
      bordered={false}
      loading={loading}
    >
      <Typography.Text copyable>
        {data?.attributes?.checkoutURL}
      </Typography.Text>
    </Card>
  );
};

export default CheckoutURLCard;
