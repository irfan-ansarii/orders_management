import React from 'react'
import Link from 'next/link'
import { Card, Space, Button, Progress } from 'antd'
import FormTitle from '../../form/FormTitle'

const CreateSuccess = () => {
  return (
    <div className="d-flex flex-column justify-space-between">
      <Space className="d-flex justify-center mb-12">
        <Card bordered={false}>
          <Progress type="circle" percent={100} size={80} />
        </Card>
      </Space>
      <FormTitle
        style={{ textAlign: 'center' }}
        title="Password Changed!"
        desc="Your password has been successfully changed. You can now log in to your account using your new password."
      />
      <Link href="/auth/login">
        <Button block size="large" type="primary" className="mb-16">
          Login
        </Button>
      </Link>
    </div>
  )
}

export default CreateSuccess
