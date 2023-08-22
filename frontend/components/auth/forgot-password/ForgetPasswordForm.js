import React from 'react'
import Link from 'next/link'
import { MailOutlined } from '@ant-design/icons'
import { Button, Form, Input, Divider } from 'antd'
import FormTitle from '../../form/FormTitle'

const ForgetPasswordForm = ({ onFinish, loading }) => {
  return (
    <>
      <FormTitle
        title="Forgot Password"
        desc="Enter your registered email address and we will send you an email with instructions to reset password."
      />
      <Form
        layout="vertical"
        requiredMark={false}
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
      >
        <Form.Item
          name="email"
          label="Email"
          rules={[
            {
              required: true,
              type: 'email',
              message: 'Enter a valid email address',
            },
          ]}
        >
          <Input
            size="large"
            prefix={<MailOutlined className="input-icon" />}
            placeholder="Email"
          />
        </Form.Item>

        <Form.Item className="mt-16">
          <Button
            block
            size="large"
            type="primary"
            htmlType="submit"
            loading={loading}
          >
            Send Link
          </Button>
        </Form.Item>
      </Form>
      <Divider>OR</Divider>

      <Link href="/auth/login">
        <Button block size="large">
          Back to Login
        </Button>
      </Link>
    </>
  )
}

export default ForgetPasswordForm
