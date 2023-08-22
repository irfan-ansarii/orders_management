import React from "react";
import { Card, Typography, Tag, Row, Progress, Tooltip } from "antd";

const StaticCard = ({ loading, title, value, color, icon, progress }) => {
  return (
    <Card bordered={false} className="statics-card" loading={loading}>
      <Row align="top" justify="space-between" className="mb-2">
        <div>
          <Typography.Text type="secondary uppercase font-medium text-xs d-block">
            {title}
          </Typography.Text>
          <Typography.Title level={4} type="d-block mt-3">
            {value}
          </Typography.Title>
        </div>
        <Tag
          color={color}
          className="d-inline-flex ma-0 align-center justify-center d-block border-none text-xl"
          style={{ width: "3rem", height: "3rem" }}
        >
          {icon}
        </Tag>
      </Row>

      {progress?.map((p, i) => (
        <Tooltip title={p.title} key={`${p.title}${i}`}>
          <Progress
            percent={p?.value}
            size="small"
            className="mb-0 mr-0"
            strokeColor={p?.color}
            format={(p) => `${Math.round(p)}%`}
          />
        </Tooltip>
      ))}
    </Card>
  );
};

export default StaticCard;
