import React from 'react'
import FormTitle from '../../form/FormTitle'
import { Card, Space, Progress, Button } from 'antd'
const SuccessPage = () => {
  return (
    <div className="d-flex flex-column justify-space-between py-16">
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

      <Button size="large" type="primary">
        Login
      </Button>
    </div>
  )
}

export default SuccessPage
