import React from "react";
import { Card, Button, Form, Input, App } from "antd";
import {
  useSettingsData,
  useEditSettings,
} from "../../../hooks/data/useSettingData";
import capitalize from "capitalize";
const Integration = () => {
  const { message } = App.useApp();
  const { data, mutate } = useSettingsData();
  const { trigger, isMutating } = useEditSettings();

  const onSubmit = (values) => {
    trigger(
      { data: values },
      {
        onSuccess: () => {
          mutate("/setting?populate=*");
          message.success("Integration has been successfully saved.");
        },
        onError: (err) => {
          const content =
            err?.response?.data?.error?.message ||
            "Unable to connect to the server. Please try again";
          message.error(capitalize(content));
        },
      }
    );
  };

  return (
    <>
      <Card className="mb-6" title="Shiprocket" bordered={false}>
        <Form layout="vertical" requiredMark="optional" onFinish={onSubmit}>
          <Form.Item
            label="API Email"
            name="shiprocketApiEmail"
            rules={[
              { required: true, type: "email", message: "Email is required." },
            ]}
            tooltip="Enter API user email address"
            initialValue={data?.data?.data?.attributes?.shiprocketApiEmail}
          >
            <Input size="large" />
          </Form.Item>
          <Form.Item
            label="API Password"
            name="shiprocketApiPassword"
            rules={[{ required: true, message: "Password is required." }]}
            tooltip="Enter API user password"
          >
            <Input.Password size="large" placeholder="••••••••" />
          </Form.Item>
          <Form.Item
            label="Base URL"
            name="shiprocketApiBaseURL"
            rules={[
              {
                required: true,
                type: "url",
                message: "Invalid API base URL.",
              },
            ]}
            tooltip="Enter base URL of shiprocket API."
            initialValue={data?.data?.data?.attributes?.shiprocketApiBaseURL}
          >
            <Input size="large" />
          </Form.Item>

          <Button
            htmlType="submit"
            size="large"
            block
            type="primary"
            loading={isMutating}
          >
            Save
          </Button>
        </Form>
      </Card>
      <Card className="mb-6" title="Interakt" bordered={false}>
        <Form layout="vertical" requiredMark="optional" onFinish={onSubmit}>
          <Form.Item
            label="Token"
            name="interaktApiToken"
            rules={[{ required: true, message: "API token is required." }]}
            tooltip="Enter Interakt API token, can be found in developer setting."
          >
            <Input.Password
              size="large"
              placeholder="••••••••••••••••••••••••••••••••••••••••"
            />
          </Form.Item>
          <Form.Item
            label="Base URL"
            name="interaktApiBaseURL"
            rules={[
              { required: true, type: "url", message: "Invalid API base URL." },
            ]}
            tooltip="Enter base URL of interakt API."
            initialValue={data?.data?.data?.attributes?.interaktApiBaseURL}
          >
            <Input size="large" />
          </Form.Item>

          <Button
            htmlType="submit"
            size="large"
            block
            type="primary"
            loading={isMutating}
          >
            Save
          </Button>
        </Form>
      </Card>
    </>
  );
};

export default Integration;
