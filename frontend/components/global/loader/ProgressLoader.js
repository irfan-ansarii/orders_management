import React from "react";
import { Progress, Typography, Card } from "antd";
const ProgressLoader = () => {
  return (
    <div className="progress-container">
      <div className="progress-box">
        <Card bordered={false}>
          <Progress
            percent={100}
            showInfo={false}
            status="active"
            size="small"
            strokeColor="#aa1c6f"
            className="progress-loader"
          />
          <Typography.Paragraph className="mb-0">
            Please wait...
          </Typography.Paragraph>
        </Card>
      </div>
    </div>
  );
};

export default ProgressLoader;
