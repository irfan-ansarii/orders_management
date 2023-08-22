import React from "react";
import { Col, Typography, Tooltip, Button } from "antd";
import FilterBar from "../../global/filter/FilterBar";
import DateFilter from "../../global/filter/DateFilter";
import { MdSync } from "react-icons/md";
const Filter = ({ title }) => {
  return (
    <FilterBar>
      <Col span={0} lg={{ span: 8 }} className="lg-d-none d-flex align-center">
        <Typography.Text className="uppercase text-xs font-medium">
          {title}
        </Typography.Text>
      </Col>
      <Col
        span={24}
        lg={{ span: 8, push: 8 }}
        className="text-right d-flex gap-2"
      >
        <DateFilter
          defaultValue={[new Date(), new Date()]}
          placement="bottomRight"
          btnClassName="px-3 text-button w-auto flex-grow-1"
          btnType="text"
        />
        <Tooltip title="Refresh">
          <Button
            type="primary"
            className="d-inline-flex align-center justify-center flex-shrink-0"
            icon={<MdSync className="anticon text-md" />}
          />
        </Tooltip>
      </Col>
    </FilterBar>
  );
};

export default Filter;
Filter.defaultProps = {
  title: "dashboard",
};
