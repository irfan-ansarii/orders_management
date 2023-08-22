import React from 'react'
import { Card, Input, Form, Button, App } from 'antd'
import { useChangePassword } from '../../../hooks/data/useUserData'
import capitalize from 'capitalize'
const ChangePassword = () => {
  const { trigger, isMutating } = useChangePassword()

  const { notification, message } = App.useApp()

  const onSubmit = (values) => {
    trigger(values, {
      onSuccess: () => {
        notification.success({
          message: 'Password Changed!',
          description: 'Your account password has been successfully changed.',
          placement: 'top',
        })
      },
      onError: (err) => {
        const content =
          err?.response?.data?.error?.message ||
          'Unable to connect to the server. Please try again'

        message.error({
          content: capitalize(content),
        })
      },
    })
  }
  return (
    <Card bordered={false} title="Change Password" className="mb-6">
      <Form layout="vertical" onFinish={onSubmit} requiredMark={false}>
        <Form.Item
          label="Current Password"
          name="currentPassword"
          rules={[{ required: true }]}
        >
          <Input.Password size="large" placeholder="••••••••" />
        </Form.Item>
        <Form.Item
          label="New Password"
          name="password"
          hasFeedback
          rules={[{ required: true, min: 8 }]}
        >
          <Input.Password size="large" placeholder="••••••••" />
        </Form.Item>
        <Form.Item
          label="Confirm Password"
          name="passwordConfirmation"
          hasFeedback
          dependencies={['password']}
          rules={[
            {
              required: true,
              message: 'Please confirm your password',
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve()
                }
                return Promise.reject(new Error('Password do not match'))
              },
            }),
          ]}
        >
          <Input.Password size="large" placeholder="••••••••" />
        </Form.Item>
        <Form.Item className="text-right mb-0">
          <Button
            htmlType="submit"
            size="large"
            type="primary"
            block
            loading={isMutating}
          >
            Save
          </Button>
        </Form.Item>
      </Form>
    </Card>
  )
}

export default ChangePassword
