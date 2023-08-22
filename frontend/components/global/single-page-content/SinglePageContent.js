import React from "react";
import { MdWest } from "react-icons/md";
import { Row, Col, Button, Typography } from "antd";
import { useRouter } from "next/router";

import { useAppSettting } from "../../../context/useAppSettting";
import FilterBar from "../filter/FilterBar";
const SinglePageContent = ({ title, action, children }) => {
  const router = useRouter();
  const app = useAppSettting();

  return (
    <div className="single-page-content">
      <div className="lg-d-none">
        <FilterBar>
          <Col span={24}>
            <Row
              align="middle"
              justify="space-between"
              gutter={0}
              className="w-100"
            >
              <Col>
                <Button
                  className="btn-action px-0"
                  icon={<MdWest className="mr-4" />}
                  type="text"
                  onClick={() => router.back()}
                >
                  <Typography.Text className="uppercase text-sm ">
                    {title || app.pageTitle}
                  </Typography.Text>
                </Button>
              </Col>

              <Col className="text-right gap-4 d-flex">{action}</Col>
            </Row>
          </Col>
        </FilterBar>
      </div>
      {children}
    </div>
  );
};

export default SinglePageContent;
