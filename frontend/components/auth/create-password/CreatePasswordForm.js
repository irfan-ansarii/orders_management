import React from 'react'
import { Button, Form, Input } from 'antd'
import { LockOutlined } from '@ant-design/icons'
import FormTitle from '../../form/FormTitle'
const CreatePasswordForm = ({ onFinish }) => {
  return (
    <>
      <FormTitle
        title="Create Password"
        desc="Your new password must be different from previous used passwords and must contain atleast 8 characters."
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
          name="password"
          size="large"
          label="Password"
          rules={[
            {
              required: true,
              message: 'Enter a password',
            },
          ]}
        >
          <Input.Password
            size="large"
            prefix={<LockOutlined className="input-icon" />}
            type="password"
            name="password"
            placeholder="••••••••"
          />
        </Form.Item>

        <Form.Item
          name="password"
          size="large"
          label="Confirm Password"
          rules={[
            {
              required: true,
              message: 'Enter confirm password',
            },
          ]}
        >
          <Input
            size="large"
            prefix={<LockOutlined className="form-icon" />}
            name="password"
            placeholder="••••••••"
          />
        </Form.Item>

        <Form.Item className="mt-16">
          <Button
            block
            size="large"
            type="primary"
            htmlType="submit"
            loading={false}
          >
            Reset Password
          </Button>
        </Form.Item>
      </Form>
    </>
  )
}

export default CreatePasswordForm
