import React from "react";
import { Row, Col, Divider, Typography } from "antd";
import { usePublicData } from "../../../hooks/data/useSettingData";
const { Paragraph } = Typography;
const AppFooter = () => {
  const { data } = usePublicData();

  return (
    <Row>
      <Divider dashed className="mt-0 mb-4" />
      <Col span={12}>
        <Paragraph className="text-xs" type="secondary">
          {data?.data?.data?.attributes?.footerLeft}
        </Paragraph>
      </Col>
      <Col span={12} className="text-right">
        <Paragraph className="text-xs" type="secondary">
          {data?.data?.data?.attributes?.footerRight}
        </Paragraph>
      </Col>
    </Row>
  );
};

export default AppFooter;
