import React from 'react'
import { Typography } from 'antd'
const { Title, Paragraph } = Typography
const FormTitle = ({ title, desc, style }) => {
  return (
    <div style={style}>
      {title && <Title level={2}>{title}</Title>}
      <Paragraph className="mb-10" type="secondary">
        {desc}
      </Paragraph>
    </div>
  )
}

export default FormTitle

FormTitle.defaultProps = {
  title: 'Welcome Back',
  desc: 'Enter your login credentials to access your account.',
}
