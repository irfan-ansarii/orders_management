import React from 'react'
import { Progress, theme, Row, Card, Col, Typography } from 'antd'
const Loading = ({ description }) => {
  const {
    token: { colorPrimary },
  } = theme.useToken()

  return (
    <Row justify="center" align="middle" className="h-100">
      <Col
        span={24}
        className="loading-screen d-flex justify-center align-center"
      >
        <Card bordered={false} size="small">
          <Progress
            className="loader"
            strokeColor={colorPrimary}
            type="circle"
            percent={25}
            size={30}
            format={() => ''}
          />
        </Card>
      </Col>
      {description && (
        <Typography.Text type="secondary" className="text-xs mt-2">
          {description}
        </Typography.Text>
      )}
    </Row>
  )
}

export default Loading

Loading.defaultProps = {
  description: '',
}
