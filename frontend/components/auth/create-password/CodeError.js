import React from 'react'
import Link from 'next/link'
import { Card, Space, Button, Progress } from 'antd'
import FormTitle from '../../form/FormTitle'

const CodeError = () => {
  return (
    <div className="d-flex flex-column justify-space-between">
      <Space className="d-flex justify-center mb-12">
        <Card bordered={false}>
          <Progress type="circle" percent={100} size={80} status="exception" />
        </Card>
      </Space>
      <FormTitle
        style={{ textAlign: 'center' }}
        title="Link Expired!"
        desc="The authentication link you are trying to use has expired. Please request a new  password reset link to change your password."
      />
      <Link href="/auth/forgot-password">
        <Button block size="large" type="primary" className="mb-16">
          Send New Link
        </Button>
      </Link>
    </div>
  )
}

export default CodeError
