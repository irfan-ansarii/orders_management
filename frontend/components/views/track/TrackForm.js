import React, { useState } from "react";
import { useRouter } from "next/router";
import { Form, Button, Input, App } from "antd";
import { useTrackOrders } from "../../../hooks/data/useOrderData";

const TrackForm = () => {
  const [loading, setLoading] = useState(false);
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const router = useRouter();
  const { trigger } = useTrackOrders();

  const onFinish = (value) => {
    setLoading(true);

    trigger(value, {
      onSuccess: (res) => {
        // if order id found
        if (res?.data?.data?.length > 0) {
          router.push(`tracking/${value.query}`);
          return;
        }

        // if not found set form error
        form.setFields([
          {
            name: "query",
            errors: ["Invalid order number or awb number"],
          },
        ]);

        // open error message
        message.open({
          type: "error",
          content: "Invalid order number or awb number",
          className: "auth-message",
        });
        // hide loader
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      },
      onError: (err) => {
        // open error
        message.open({
          type: "error",
          content:
            err?.response?.data?.error?.message ||
            "Unable to connect to the server. Please try again",
        });
        // hide loader
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      },
    });
  };

  return (
    <Form
      layout="vertical"
      requiredMark={false}
      initialValues={{
        remember: true,
      }}
      form={form}
      onFinish={onFinish}
    >
      <Form.Item
        name="query"
        rules={[
          {
            required: true,
            message: "Please enter order number or awb number",
          },
        ]}
      >
        <Input size="large" placeholder="Type here..." />
      </Form.Item>

      <Form.Item className="mt-10">
        <Button
          block
          size="large"
          type="primary"
          htmlType="submit"
          loading={loading}
        >
          Track
        </Button>
      </Form.Item>
    </Form>
  );
};

export default TrackForm;
