import React, { useState, useEffect } from "react";
import { Typography, Tag } from "antd";
import moment from "moment";
const InfoCard = ({ data }) => {
  const [text, setText] = useState(null);

  useEffect(() => {
    const orderDate =
      data?.attributes?.orderDate || data?.attributes?.createdAt;
    const currentStatus = data?.attributes?.currentStatus?.data;
    const orderType = data?.attributes?.type;

    const isDelayed = moment().subtract(4, "days").isAfter(orderDate);
    const delayConditions = [undefined, "packed", "confirmed"];
    if (
      isDelayed &&
      orderType !== "return" &&
      delayConditions.includes(currentStatus?.attributes?.name)
    ) {
      setText(
        "We sincerely apologize for the delay in processing your order. We are actively working to resolve the issue and will provide an update soon. Thank you for your understanding."
      );
    }
  }, [data]);
  if (!text) {
    return;
  }
  return (
    <Tag
      style={{ whiteSpace: "normal" }}
      className="mr-0 pa-4 border-none mt-6"
      color="blue"
    >
      <Typography.Text>{text}</Typography.Text>
    </Tag>
  );
};

export default InfoCard;
