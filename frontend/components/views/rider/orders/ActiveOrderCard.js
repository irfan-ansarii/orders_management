import React from "react";
import {
  Card,
  Avatar,
  Row,
  Col,
  Typography,
  Button,
  Divider,
  Badge,
  App,
  Tag,
} from "antd";

import { MdPerson, MdLocationOn, MdPhone } from "react-icons/md";
import numeral from "numeral";
import capitalize from "capitalize";
import { useCreateStatus } from "../../../../hooks/data/useOrderData";
import ActionModal from "./ActionModal";
import { getAppConfig } from "../../../../utils";
const ActiveOrderCard = ({ data, loading, mutate, user }) => {
  const { appTitle } = getAppConfig();
  const { message, modal } = App.useApp();
  const { trigger, isMutating } = useCreateStatus();

  const onComplete = ({ orderId, userId, type }) => {
    if (!orderId || !userId || !type) {
      message.error("Something went wrong.");
    }

    modal.confirm({
      title: "Confirm",
      content:
        data?.attributes?.type === "return"
          ? "Are you sure you have picked the return order and checked the items?"
          : `Are you sure you have delivered this order and collected the COD amount if any?`,
      okText: "Yes",
      cancelText: "No",
      onOk: () => {
        message.loading({
          key: "loading",
          content: "Please wait...",
          duration: 0,
        });
        trigger(
          {
            data: {
              order: orderId,
              rider: userId,
              company: appTitle,
              name: type === "return" ? "in_transit" : "delivered",
              trackingNumber: orderId.toString(),
              happenedAt: new Date(),
              edd: new Date(),
            },
          },
          {
            onSuccess: () => {
              message.destroy("loading");
              message.success(
                `Order has been ${
                  type === "return" ? "picked" : "delivered"
                } successfully.`
              );
              mutate();
            },
            onError: () => {
              const content =
                err?.response?.data?.error?.message ||
                "Unable to connect to the server.";
              message.destroy("loading");
              message.error(content);
            },
          }
        );
      },
    });
  };

  // Logic to determine whether to render the action
  const shouldRenderAction =
    data?.attributes?.currentStatus?.data?.attributes?.name !== "in_transit" ||
    data?.attributes?.currentStatus?.data?.attributes?.name == "rto_initiated";

  return (
    <Badge.Ribbon
      color={
        data?.attributes?.type === "return"
          ? "red"
          : data?.attributes?.type === "exchange"
          ? "geekblue"
          : "cyan"
      }
      text={data?.attributes?.type}
      className="rotate"
    >
      <Card
        className="overflow-hidden pa-2"
        size="small"
        bordered={false}
        loading={loading}
      >
        <Row className="h-100 flex-column">
          <div className="flex-grow-1">
            <Row>
              <Col span={12}>
                <Typography.Text
                  type="secondary"
                  className="text-xs uppercase d-block"
                >
                  Order ID
                </Typography.Text>
                <Typography.Text className="text-xs uppercase d-block">
                  {data?.attributes?.name}
                </Typography.Text>
              </Col>
              {data?.attributes?.type !== "return" && (
                <Col span={12} className="text-right">
                  <Typography.Text
                    type="secondary"
                    className="text-xs uppercase d-block"
                  >
                    collect
                  </Typography.Text>
                  <Typography.Text className="text-xs uppercase d-block">
                    {numeral(data?.attributes?.outstandingTotal).format(
                      "0,0.00"
                    )}
                  </Typography.Text>
                </Col>
              )}
            </Row>
            <Divider className="my-3" dashed />
            <Row className="gap-2" justify="space-between">
              <Col className="d-flex gap-2">
                <Avatar
                  icon={<MdPerson />}
                  className="d-flex align-center justify-center "
                />
                <div>
                  <Typography.Text className="text-xs d-block">
                    {capitalize(data?.attributes?.shippingAddress?.name || "")}
                  </Typography.Text>
                  <Typography.Text className="text-xs" type="secondary">
                    {data?.attributes?.shippingAddress?.phone ||
                      data?.attributes?.billingAddress?.phone ||
                      data?.attributes?.customer?.data?.attributes?.phone}
                  </Typography.Text>
                </div>
              </Col>
              <Button
                type="primary"
                style={{ borderRadius: "50px" }}
                icon={<MdPhone className="text-sm" />}
                href={`tel:${
                  data?.attributes?.shippingAddress?.phone ||
                  data?.attributes?.billingAddress?.phone ||
                  data?.attributes?.customer?.data?.attributes?.phone
                }`}
              ></Button>
            </Row>
            <Divider className="my-3" dashed />

            <Row className="gap-2 mb-4" wrap={false}>
              <Avatar
                className="d-flex align-center justify-center flex-shrink-0"
                icon={<MdLocationOn />}
              />
              <Col>
                <Typography.Text type="secondary" className="text-xs">
                  {`${data?.attributes?.shippingAddress?.address1} ${data?.attributes?.shippingAddress?.address2} ${data?.attributes?.shippingAddress?.city} ${data?.attributes?.shippingAddress?.province} - ${data?.attributes?.shippingAddress?.zip}`}
                </Typography.Text>
              </Col>
            </Row>
          </div>

          {/* pickup rescheduled/undelivered */}
          {(data?.attributes?.currentStatus?.data?.attributes?.name ===
            "return_rescheduled" ||
            data?.attributes?.currentStatus?.data?.attributes?.name ===
              "undelivered") && (
            <Tag
              className="mr-0 border-none py-1 text-center uppercase"
              color="volcano"
            >
              rescheduled
            </Tag>
          )}

          {/* rto initiated */}
          {data?.attributes?.currentStatus?.data?.attributes?.name ===
            "rto_initiated" && (
            <Tag
              className="mr-0 border-none py-1 text-center uppercase"
              color="error"
            >
              rto initiated
            </Tag>
          )}

          {/* return picked */}
          {data?.attributes?.currentStatus?.data?.attributes?.name ===
            "in_transit" &&
            data?.attributes?.type === "return" && (
              <Tag
                className="mr-0 border-none py-1 text-center uppercase"
                color="blue"
              >
                Return Picked
              </Tag>
            )}

          {shouldRenderAction && (
            <Row gutter={24} className="mt-3">
              <Col span={12}>
                <ActionModal order={data} userId={user.id} mutate={mutate} />
              </Col>
              <Col span={12}>
                <Button
                  type="primary"
                  className="uppercase text-xs"
                  block
                  loading={isMutating}
                  onClick={() =>
                    onComplete({
                      orderId: data?.id,
                      userId: user?.id,
                      type: data?.attributes?.type,
                    })
                  }
                >
                  {isMutating
                    ? "Loading..."
                    : data?.attributes?.type === "return"
                    ? "Pickup complete"
                    : "delivered"}
                </Button>
              </Col>
            </Row>
          )}
        </Row>
      </Card>
    </Badge.Ribbon>
  );
};

export default ActiveOrderCard;

ActiveOrderCard.defaultProps = {
  data: {},
  loading: false,
  mutate: () => {},
  user: {},
};
