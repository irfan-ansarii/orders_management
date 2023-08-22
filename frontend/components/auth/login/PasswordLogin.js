import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { MdLock, MdPerson } from "react-icons/md";
import { Row, Col, Button, Checkbox, Form, Input } from "antd";

const PasswordLogin = ({ handleSubmit, loading }) => {
  const router = useRouter();
  const [form] = Form.useForm();

  useEffect(() => {
    const identifier = localStorage.getItem("identifier");
    const password = localStorage.getItem("password");

    form.setFieldsValue({ identifier, password });
  }, [router.events]);
  return (
    <>
      <Form
        layout="vertical"
        requiredMark={false}
        onFinish={handleSubmit}
        form={form}
      >
        <Form.Item
          name="identifier"
          label="Email"
          rules={[
            {
              required: true,
              type: "email",
              message: "Enter a valid email address",
            },
          ]}
        >
          <Input
            size="large"
            prefix={<MdPerson className="input-icon anticon text-md" />}
            placeholder="Email"
          />
        </Form.Item>
        <Form.Item
          name="password"
          size="large"
          label="Password"
          rules={[
            {
              required: true,
              message: "Enter a password",
            },
          ]}
        >
          <Input.Password
            size="large"
            prefix={<MdLock className="input-icon anticon text-md" />}
            type="password"
            name="password"
            placeholder="••••••••"
          />
        </Form.Item>
        <Form.Item>
          <Row justify="between">
            <Col span={12}>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Remember me</Checkbox>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Link className="text-right d-block" href="/auth/forgot-password">
                Forgot password?
              </Link>
            </Col>
          </Row>
        </Form.Item>

        <Form.Item>
          <Button
            block
            size="large"
            type="primary"
            htmlType="submit"
            loading={loading}
          >
            {loading ? "Login in..." : "Login"}
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default PasswordLogin;
