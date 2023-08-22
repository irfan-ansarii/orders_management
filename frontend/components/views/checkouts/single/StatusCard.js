import React, { useMemo } from "react";
import { Card, Steps } from "antd";
import {
  RiShoppingBag3Fill,
  RiWhatsappFill,
  RiCheckDoubleFill,
} from "react-icons/ri";
import { useMessageData } from "../../../../hooks/data/useTimelineData";
import moment from "moment";
const StatusCard = ({ data, loading }) => {
  const message = useMessageData({ ref: "checkouts", refId: data?.id });

  const items = [
    {
      status: "finish",
      title: "created",
      icon: <RiShoppingBag3Fill className="text-lg" />,
      description: moment(data?.attributes?.createdAt).format("DD MMM, hh:mm"),
    },
    {
      status: data?.attributes?.isRecovered ? "finish" : "wait",
      title: "recovered",
      icon: <RiCheckDoubleFill className="text-lg" />,
      description:
        data?.attributes?.isRecovered &&
        moment(data?.attributes?.recoveredAt).format("DD MMM, hh:mm"),
    },
  ];

  const timeline = useMemo(() => {
    if (loading || message.isLoading) {
      return [];
    }

    const messageData = message?.data?.data?.data;

    const messageTimeline = messageData
      .map((item) => {
        const name = item?.attributes?.name?.toLowerCase();
        const status = item?.attributes?.status?.toLowerCase();
        const title = name?.includes("recover")
          ? "offer"
          : name?.includes("assis")
          ? "assistance"
          : "";

        return {
          id: item.id,
          title: title,
          status:
            status === "failed"
              ? "error"
              : status === "sent" || status === "cancelled"
              ? "finish"
              : "wait",
          icon: <RiWhatsappFill className="text-lg" />,
          description:
            status !== "cancelled" &&
            moment(item?.attributes?.updatedAt).format("DD MMM, hh:mm"),
        };
      })
      .sort((a, b) => a.id - b.id);

    const updatedItems = [...items];
    updatedItems.splice(1, 0, ...messageTimeline);

    return updatedItems;
  }, [data, message?.data?.data?.data]);

  return (
    <Card
      className="mb-6"
      bordered={false}
      loading={message.isLoading || loading}
    >
      <Steps
        labelPlacement="vertical"
        className="checkout-step"
        items={timeline}
      />
    </Card>
  );
};

export default StatusCard;
