import React from "react";
import { useRouter } from "next/router";
import { Row, Col, Button, Typography } from "antd";
import { MdWest } from "react-icons/md";
import HeaderSearch from "./pageHeaderComp/HeaderSearch";
import { useAppSettting } from "../../../../context/useAppSettting";
import FilterDrawer from "./pageHeaderComp/FilterDrawer";

const PageHeader = ({ config }) => {
  const router = useRouter();
  const { pageTitle, action } = useAppSettting();

  return (
    <Row align="middle" className="h-100" wrap={false}>
      <Col flex="1 1 auto" className="overflow-hidden">
        <Button
          className="btn-action px-2"
          icon={<MdWest className="mr-4" />}
          type="text"
          onClick={() => {
            router.back();
          }}
        >
          <Typography.Text className="uppercase font-medium text-xs">
            {pageTitle}
          </Typography.Text>
        </Button>
      </Col>

      <Col flex="0 0 auto" className="d-flex align-center gap-2">
        <HeaderSearch showFilter={config?.showFilter} />
        {/* <FilterDrawer /> */}
        {action}
      </Col>
    </Row>
  );
};

export default PageHeader;
