import React from "react";
import { Col, Segmented } from "antd";
import AddUser from "../add-user";
import useQuery from "../../../../hooks/useQuery";
import SearchInput from "../../../global/search/SearchInput";
import FilterBar from "../../../global/filter/FilterBar";
const Filter = () => {
  const { onChange, value } = useQuery();

  return (
    <FilterBar>
      <Col span={0} lg={{ span: 9 }}>
        <SearchInput size="large" />
      </Col>
      <Col span={24} lg={{ span: 10 }}>
        <Segmented
          onChange={(e) => onChange({ key: "blocked", value: e })}
          block
          defaultValue={value.blocked}
          size="large"
          options={[
            {
              label: <span className="uppercase text-xs">all</span>,
              value: "",
            },
            {
              label: <span className="uppercase text-xs">active</span>,
              value: "false",
            },
            {
              label: <span className="uppercase text-xs">inactive</span>,
              value: "true",
            },
          ]}
        />
      </Col>

      <Col span={0} lg={{ span: 5 }} className="text-right">
        <AddUser />
      </Col>
    </FilterBar>
  );
};

export default Filter;
