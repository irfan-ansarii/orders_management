import React from "react";
import { Modal, Form, DatePicker, Select, Input, App } from "antd";
import {
  useEditOrder,
  useOrderData,
} from "../../../../hooks/data/useOrderData";
const PaymentModal = ({ open, setOpen, id }) => {
  const { isMutating, trigger } = useEditOrder();
  const { mutate } = useOrderData({ id });
  const { message } = App.useApp();
  const onSubmit = (values) => {
    const data = { ...values, id };

    trigger(
      { data },
      {
        onSuccess: () => {
          mutate();
          message.success("Payment details has been saved successfully.");
        },
        onError: (err) => {
          const content =
            err?.response?.data?.error?.message ||
            "Unable to connect to the server. Please try again.";
          message.error(capitalize(content));
        },
      }
    );
    setOpen(false);
  };
  return (
    <Modal
      title="Add Payment"
      open={open}
      closable={false}
      onCancel={() => setOpen(false)}
      okText="Save"
      okButtonProps={{ size: "large", htmlType: "submit", loading: isMutating }}
      cancelButtonProps={{ size: "large" }}
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
      <Form.Item
        name={["remittance", "date"]}
        label="Transaction Date"
        className="pt-4"
        rules={[{ required: true, message: "Transaction date is required." }]}
      >
        <DatePicker className="w-100" size="large" placeholder="DD-MM-YYYY" />
      </Form.Item>
      <Form.Item
        name={["remittance", "utr"]}
        label="UTR"
        tooltip="URT is a transaction reference number."
        rules={[{ required: true, message: "URT is required." }]}
      >
        <Input size="large" placeholder="ABC1234567890" />
      </Form.Item>
      <Form.Item
        name={["remittance", "status"]}
        label="Status"
        rules={[{ required: true, message: "Status is required." }]}
      >
        <Select
          size="large"
          placeholder="Success"
          options={[
            {
              value: "pending",
              label: "Pending",
            },
            {
              value: "success",
              label: "Success",
            },
            {
              value: "failed",
              label: "Failed",
            },
          ]}
        />
      </Form.Item>

      <Form.Item name={["remittance", "remarks"]} label="Remarks">
        <Input.TextArea rows={3} />
      </Form.Item>
    </Modal>
  );
};

export default PaymentModal;
