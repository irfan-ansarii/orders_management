import React from "react";
import { Card, List, Skeleton, Switch, InputNumber, Row, Button } from "antd";
const Notifications = () => {
  const abandoned = [
    {
      name: "Communication - 1",
      description: "Lorem ipsum dolor sit amet.",
    },
    {
      name: "Communication - 2",
      description: "Lorem ipsum dolor sit amet.",
    },
  ];
  const preship = [
    {
      name: "Order Confirmation",
      description: "Lorem ipsum dolor sit amet.",
    },
    {
      name: "Address Confirmation",
      description: "Lorem ipsum dolor sit amet.",
    },
    {
      name: "COD to Prepaid",
      description: "Lorem ipsum dolor sit amet.",
    },
    {
      name: "Cancellation Reason",
      description: "Lorem ipsum dolor sit amet.",
    },
    {
      name: "Confirmed",
      description: "Lorem ipsum dolor sit amet.",
    },
    {
      name: "Cancelled",
      description: "Lorem ipsum dolor sit amet.",
    },
  ];

  const postship = [
    {
      name: "Packed",
      description: "Lorem ipsum dolor sit amet.",
    },
    {
      name: "Shipped",
      description: "Lorem ipsum dolor sit amet.",
    },
    {
      name: "Out For Delivery",
      description: "Lorem ipsum dolor sit amet.",
    },
    {
      name: "Delivered",
      description: "Lorem ipsum dolor sit amet.",
    },
    {
      name: "Feedback",
      description: "Lorem ipsum dolor sit amet.",
    },
  ];

  const returnData = [
    {
      name: "Requested",
      description: "Lorem ipsum dolor sit amet.",
    },
    {
      name: "Initiated",
      description: "Lorem ipsum dolor sit amet.",
    },
    {
      name: "Out For Pickup",
      description: "Lorem ipsum dolor sit amet.",
    },
    {
      name: "In Transit",
      description: "Lorem ipsum dolor sit amet.",
    },
    {
      name: "Returned",
      description: "Lorem ipsum dolor sit amet.",
    },
    {
      name: "Cancel",
      description: "Lorem ipsum dolor sit amet.",
    },
    {
      name: "Rejected",
      description: "Lorem ipsum dolor sit amet.",
    },
  ];

  const refund = [
    {
      name: "Refund",
      description: "Lorem ipsum dolor sit amet.",
    },
    {
      name: "Store Credit",
      description: "Lorem ipsum dolor sit amet.",
    },
    {
      name: "Store Credit Expiring",
      description: "Lorem ipsum dolor sit amet.",
    },
  ];

  return (
    <>
      {/* abandoned checkout */}
      <Card
        bordered={false}
        className="mb-6 table-card"
        title="Abandoned Checkout"
      >
        <List
          className="px-7"
          itemLayout="horizontal"
          dataSource={abandoned}
          renderItem={(item) => (
            <List.Item loading={false}>
              <Skeleton avatar title={false} active loading={false}>
                <List.Item.Meta
                  title={item.name}
                  description={item.description}
                />

                <Row wrap={false} align="middle" className="gap-4">
                  <InputNumber
                    addonAfter="min"
                    className="text-right"
                    style={{ width: "140px" }}
                  />
                  <Button>Save</Button>
                  <Switch defaultChecked />
                </Row>
              </Skeleton>
            </List.Item>
          )}
        />
      </Card>

      {/* pre-ship */}
      <Card bordered={false} className="mb-6 table-card" title="Pre-ship">
        <List
          className="px-7"
          itemLayout="horizontal"
          dataSource={preship}
          renderItem={(item) => (
            <List.Item loading={false}>
              <Skeleton avatar title={false} active loading={false}>
                <List.Item.Meta
                  title={item.name}
                  description={item.description}
                />

                <Switch defaultChecked />
              </Skeleton>
            </List.Item>
          )}
        />
      </Card>
      {/* post-ship */}
      <Card bordered={false} title="Post-ship" className="mb-6 table-card">
        <List
          className="px-7"
          itemLayout="horizontal"
          dataSource={postship}
          renderItem={(item) => (
            <List.Item loading={false}>
              <Skeleton avatar title={false} active loading={false}>
                <List.Item.Meta
                  title={item.name}
                  description={item.description}
                />

                <Switch defaultChecked />
              </Skeleton>
            </List.Item>
          )}
        />
      </Card>

      {/* return  */}
      <Card bordered={false} title="Return" className="mb-6 table-card">
        <List
          className="px-7"
          itemLayout="horizontal"
          dataSource={returnData}
          renderItem={(item) => (
            <List.Item loading={false}>
              <Skeleton avatar title={false} active loading={false}>
                <List.Item.Meta
                  title={item.name}
                  description={item.description}
                />

                <Switch defaultChecked />
              </Skeleton>
            </List.Item>
          )}
        />
      </Card>

      {/* store credit */}
      <Card
        bordered={false}
        title="Refund / Store Credit"
        className="mb-6 table-card"
      >
        <List
          className="px-7"
          itemLayout="horizontal"
          dataSource={refund}
          renderItem={(item) => (
            <List.Item loading={false}>
              <Skeleton avatar title={false} active loading={false}>
                <List.Item.Meta
                  title={item.name}
                  description={item.description}
                />

                <Switch defaultChecked />
              </Skeleton>
            </List.Item>
          )}
        />
      </Card>
    </>
  );
};

export default Notifications;
