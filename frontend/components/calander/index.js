import React, { useState } from 'react'
import {
  Drawer,
  Calendar,
  Row,
  Col,
  Button,
  Typography,
  Select,
  theme,
} from 'antd'
import { useTheme } from '../../context/useTheme'
const ranges = [
  {
    label: (
      <Typography.Text className="uppercase text-xs">today</Typography.Text>
    ),
    value: 'today',
  },
  {
    label: (
      <Typography.Text className="uppercase text-xs">yesterday</Typography.Text>
    ),
    value: 'yesterday',
  },
  {
    label: (
      <Typography.Text className="uppercase text-xs">
        Last 7 days
      </Typography.Text>
    ),
    value: 'last 7 days',
  },
  {
    label: (
      <Typography.Text className="uppercase text-xs">
        Last 30 Days
      </Typography.Text>
    ),
    value: 'last 30 days',
  },
  {
    label: (
      <Typography.Text className="uppercase text-xs">
        Last Month
      </Typography.Text>
    ),
    value: 'last month',
  },
  {
    label: (
      <Typography.Text className="uppercase text-xs">
        This Month
      </Typography.Text>
    ),
    value: 'this month',
  },
]

const CalanderDrawer = ({ open, onClose, selected, onApply }) => {
  const [value, setValue] = useState(selected)

  const {
    token: { colorBgMask, colorBgContainer },
  } = theme.useToken()

  return (
    <Drawer
      autoFocus
      destroyOnClose
      headerStyle={{ display: 'none' }}
      bodyStyle={{ padding: '0', background: colorBgContainer }}
      contentWrapperStyle={{
        borderTopLeftRadius: '.5rem',
        borderTopRightRadius: '.5rem',
        overflow: 'hidden',
      }}
      placement="bottom"
      height="auto"
      push={0}
      onClose={onClose}
      open={open}
      className="calander-drawer"
    >
      <Row className="flex-column position-relative">
        <Col flex="1 1 auto" className="pt-9">
          <span
            onClick={onClose}
            className="drawer-close"
            style={{
              background: colorBgMask,
            }}
          ></span>

          <Col className="px-3">
            <Select
              type="text"
              size="small"
              className="w-100 text-xs"
              options={ranges}
              placeholder="DD-MM-YYYY"
            />
          </Col>
          <Calendar fullscreen={false} onSelect={(value) => setValue(value)} />
        </Col>
        <Col flex="0 0 auto" className="px-1 pb-3">
          <Row>
            <Col span={12} className="px-2">
              <Button block onClick={onClose}>
                {value ? 'Clear' : 'Cancel'}
              </Button>
            </Col>
            <Col span={12} className="px-2">
              <Button
                block
                type="primary"
                onClick={() => {
                  onClose(), onApply(value)
                }}
              >
                Apply
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </Drawer>
  )
}

export default CalanderDrawer
