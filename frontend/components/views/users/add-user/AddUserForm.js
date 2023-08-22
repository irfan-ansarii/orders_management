import React from "react";
import { Button, Form, Input, Radio } from "antd";
const AddUserForm = ({ onFinish, isMutating }) => {
  return (
    <Form
      layout="vertical"
      onFinish={onFinish}
      requiredMark={false}
      className="px-6 py-4 d-flex flex-column h-100"
    >
      <div className="flex-fill">
        <Form.Item
          name="userRole"
          rules={[
            {
              required: true,
              message: "Please select user role",
            },
          ]}
        >
          <Radio.Group className="d-flex text-center uppercase" size="large">
            <Radio.Button value="admin" className="flex-fill">
              Admin
            </Radio.Button>
            <Radio.Button value="rider" className="flex-fill">
              Rider
            </Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          label="Name"
          hasFeedback
          name="name"
          rules={[
            {
              required: true,
              min: 5,
            },
          ]}
        >
          <Input placeholder="Name" size="large" />
        </Form.Item>
        <Form.Item
          label="Mobile"
          hasFeedback
          name="mobile"
          rules={[
            {
              required: true,
              len: 10,
              pattern: "[0-9]{10}",
              message: "Please enter valid Mobile number",
            },
          ]}
        >
          <Input placeholder="9898989898" size="large" />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          hasFeedback
          rules={[
            {
              required: true,
              type: "email",
            },
          ]}
        >
          <Input placeholder="example@domain.com" size="large" />
        </Form.Item>
        <Form.Item
          label="Password"
          name="pass"
          hasFeedback
          rules={[
            {
              required: true,
              min: 8,
            },
          ]}
        >
          <Input.Password placeholder="••••••••" size="large" />
        </Form.Item>
        <Form.Item
          label="Confirm Password"
          name="password"
          hasFeedback
          dependencies={["pass"]}
          rules={[
            {
              required: true,
              message: "Please confirm your password",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("pass") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Password do not match"));
              },
            }),
          ]}
        >
          <Input.Password placeholder="••••••••" size="large" />
        </Form.Item>
      </div>

      <Button
        block
        size="large"
        type="primary"
        htmlType="submit"
        loading={isMutating}
        className="mt-4"
      >
        {isMutating ? "Adding..." : "Add"}
      </Button>
    </Form>
  );
};

export default AddUserForm;
