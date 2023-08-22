import React from 'react'
import Link from 'next/link'
import { Card, Space, Button, Typography, Progress } from 'antd'
import FormTitle from '../../form/FormTitle'

const EmailSuccess = ({ onResend }) => {
  return (
    <div className="d-flex flex-column justify-space-between">
      <Space className="d-flex justify-center mb-12">
        <Card bordered={false}>
          <Progress type="circle" percent={100} size={80} />
        </Card>
      </Space>
      <FormTitle
        style={{ textAlign: 'center' }}
        title="Email has been sent!"
        desc="We have sent an email with instructions to reset your password. Click on the link received to reset your password."
      />
      <Link href="/auth/login" className="mb-16">
        <Button block size="large" type="primary">
          Login
        </Button>
      </Link>
      <Typography.Text type="secondary" className="mb-4 text-center">
        Did not receive email? Check your spam filter!
      </Typography.Text>
      <Space direction="vertical" size="middle">
        <Button size="large" block onClick={onResend}>
          Resend
        </Button>
        <Link href="/auth/forgot-password">
          <Button block size="large">
            Try another email address.
          </Button>
        </Link>
      </Space>
    </div>
  )
}

export default EmailSuccess
