import React from "react";
import { MdDashboardCustomize } from "react-icons/md";
import { Button, Popover, Row, Col, Tag, Typography } from "antd";

const ExternalLinks = () => {
  return (
    <Popover
      arrow={false}
      content={
        <Row
          style={{ width: "300px", height: "240px" }}
          className="pa-2"
          gutter={20}
        >
          <Col span={12} className="text-center mb-6">
            <a
              href="#"
              className="d-flex flex-column align-center justify-center h-100"
            >
              <Tag color="blue" className="mr-0 pa-3 mb-3 d-inline-flex">
                <MdDashboardCustomize className="text-xl" />
              </Tag>
              <Typography.Text>Website</Typography.Text>
            </a>
          </Col>
          <Col span={12} className="text-center mb-6">
            <a
              href="#"
              className="d-flex flex-column align-center justify-center h-100"
            >
              <Tag color="blue" className="mr-0 pa-3 mb-3 d-inline-flex">
                <MdDashboardCustomize className="text-xl" />
              </Tag>
              <Typography.Text>Admin Panel</Typography.Text>
            </a>
          </Col>
          <Col span={12} className="text-center">
            <a
              href="#"
              className="d-flex flex-column align-center justify-center h-100"
            >
              <Tag color="blue" className="mr-0 pa-3 mb-3 d-inline-flex">
                <MdDashboardCustomize className="text-xl" />
              </Tag>
              <Typography.Text>Shiprocket</Typography.Text>
            </a>
          </Col>
          <Col span={12} className="text-center">
            <a
              href="#"
              className="d-flex flex-column align-center justify-center h-100"
            >
              <Tag color="blue" className="mr-0 pa-3 mb-3 d-inline-flex">
                <MdDashboardCustomize className="text-xl" />
              </Tag>
              <Typography.Text>Nykaa</Typography.Text>
            </a>
          </Col>
        </Row>
      }
    >
      <Button
        type="text"
        size="large"
        icon={<MdDashboardCustomize className="text-xl" />}
      ></Button>
    </Popover>
  );
};

export default ExternalLinks;
