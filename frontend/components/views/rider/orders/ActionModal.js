import React, { useState } from "react";
import { Button, Modal, Form, Select, App } from "antd";
import { useCreateStatus } from "../../../../hooks/data/useOrderData";
import { getAppConfig } from "../../../../utils";

const options = [
  {
    value: "qc_failed",
    label: "QC Failed",
  },
  {
    value: "payment_issues",
    label: "Payment Issues",
  },
  {
    value: "incomplete_address",
    label: "Incomplete Address",
  },
  {
    value: "unavailable",
    label: "Recipient Unavailable/Unreachable",
  },
  {
    value: "refused",
    label: "Refused Delivery/Return",
  },
];
const ActionModal = ({ order, userId, mutate }) => {
  const { appTitle } = getAppConfig();
  const { message } = App.useApp();
  const [open, setOpen] = useState(false);
  const { trigger, isMutating } = useCreateStatus();

  const onSubmit = (values) => {
    const { name, note } = values;

    let action =
      order?.attributes?.type === "return"
        ? "return_rescheduled"
        : "undelivered";

    if (name === "cancel") {
      action =
        order?.attributes?.type === "return"
          ? "return_cancel"
          : "rto_initiated";
    }

    let statusData = {
      order: order.id,
      rider: userId,
      company: appTitle,
      name: action,
      note,
      trackingNumber: order.id.toString(),
      happenedAt: new Date(),
    };

    trigger(
      { data: statusData },
      {
        onSuccess: () => {
          message.success(
            `Order has been successfully ${
              name === "cancel" ? "cancelled" : "rescheduled"
            }.`
          );
          mutate();
          setOpen(false);
        },
        onError: (err) => {
          const content =
            err?.response?.data?.error?.message ||
            "Unable to connect to the server.";
          message.error(content);
        },
      }
    );
  };
  return (
    <>
      <Button
        type="text"
        className="uppercase text-button text-xs"
        block
        onClick={() => setOpen(true)}
      >
        action
      </Button>

      <Modal
        title="Action"
        open={open}
        closable={false}
        onCancel={() => setOpen(false)}
        okText="Submit"
        okButtonProps={{
          htmlType: "submit",
          loading: isMutating,
        }}
        focusTriggerAfterClose={false}
        destroyOnClose={true}
        modalRender={(children) => (
          <Form
            layout="vertical"
            requiredMark={false}
            preserve={false}
            onFinish={onSubmit}
          >
            {children}
          </Form>
        )}
      >
        <Form.Item name="name" label="Select" className="pt-4">
          <Select
            placeholder="Select action"
            options={[
              {
                label: "Cancel",
                value: "cancel",
              },
              {
                label: "Reschedule",
                value: "reschedule",
              },
            ]}
            placement="topLeft"
          />
        </Form.Item>

        <Form.Item name="note" label="Reason">
          <Select
            placeholder="Select action"
            options={options}
            placement="topLeft"
          />
        </Form.Item>
      </Modal>
    </>
  );
};

export default ActionModal;
ActionModal.defaultProps = {
  order: {},
  mutate: () => {},
  userId: null,
};
