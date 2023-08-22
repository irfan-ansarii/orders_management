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
} from "antd";
import { MdLocationOn } from "react-icons/md";
import numeral from "numeral";
import capitalize from "capitalize";
import { useCreateStatus } from "../../../../hooks/data/useOrderData";
import { getAppConfig } from "../../../../utils";
const NewOrderCard = ({ data, loading, mutate, user }) => {
  const { message, modal } = App.useApp();
  const { appTitle } = getAppConfig();
  const { trigger, isMutating } = useCreateStatus();

  const onAccept = (id, rider) => {
    if (!id || !rider) {
      message.error("Something went wrong.");
      return;
    }
    modal.confirm({
      title: "Confirmation",
      content: `You are about to accept the order ${data?.attributes?.name}.`,
      okText: "Accept",
      cancelText: "Cancel",
      onOk: () => {
        const statusData = {
          order: id,
          name:
            data?.attributes?.type === "return"
              ? "out_for_pickup"
              : "out_for_delivery",
          rider: rider,
          company: appTitle,
          trackingNumber: id.toString(),
          happenedAt: new Date(),
          edd: new Date(),
        };
        message.loading({
          key: "loading",
          content: "Please wait...",
          duration: 0,
        });
        trigger(
          {
            data: statusData,
          },
          {
            onSuccess: () => {
              message.destroy("loading");
              message.success(
                `You have successfully accepted the order ${data?.attributes?.name}.`
              );
              mutate();
            },
            onError: (err) => {
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
        <Row className="flex-column h-100">
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
                  {data?.attributes?.name} - {data?.id}
                </Typography.Text>
              </Col>
              {data?.attributes?.type !== "return" && (
                <Col span={12} className="text-right">
                  <Typography.Text
                    type="secondary"
                    className="text-xs uppercase d-block"
                  >
                    Collect
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
            <Row className="gap-2 mb-4" wrap={false}>
              <Avatar
                className="d-flex align-center justify-center flex-shrink-0"
                icon={<MdLocationOn />}
              />
              <Col>
                <Typography.Text className="text-xs d-block">
                  {capitalize(data?.attributes?.shippingAddress?.name || "")}
                </Typography.Text>
                <Typography.Text type="secondary" className="text-xs">
                  {`${data?.attributes?.shippingAddress?.address1} ${data?.attributes?.shippingAddress?.address2} ${data?.attributes?.shippingAddress?.city} ${data?.attributes?.shippingAddress?.province} - ${data?.attributes?.shippingAddress?.zip}`}
                </Typography.Text>
              </Col>
            </Row>
          </div>
          <Button
            block
            type="primary"
            className="uppercase text-xs"
            onClick={() => onAccept(data?.id, user?.id)}
            loading={isMutating}
          >
            {isMutating ? "accepting..." : "accept"}
          </Button>
        </Row>
      </Card>
    </Badge.Ribbon>
  );
};

export default NewOrderCard;
NewOrderCard.defaultProps = {
  data: {},
  loading: false,
  mutate: () => {},
  user: {},
};
