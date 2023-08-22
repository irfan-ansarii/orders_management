import React from "react";
import { Row, Col, Segmented } from "antd";
import FilterBar from "../../components/global/filter/FilterBar";
const Timelines = () => {
  return (
    <>
      <FilterBar>
        <Col span={24}>
          <Segmented
            block
            className="scroll-segmented"
            size="large"
            options={[
              {
                label: <span className="uppercase text-xs">orders</span>,
                value: "applications",
              },
              {
                label: <span className="uppercase text-xs">checkouts</span>,
                value: "notifications",
              },
              {
                label: <span className="uppercase text-xs">products</span>,
                value: "platforms",
              },

              {
                label: <span className="uppercase text-xs">customers</span>,
                value: "fulfillments",
              },
            ]}
          />
        </Col>
      </FilterBar>

      <Row>
        <Col span={24} lg={{ span: 20, push: 2 }} xl={{ span: 16, push: 4 }}>
          col
        </Col>
      </Row>
    </>
  );
};

export default Timelines;
