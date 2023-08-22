import React from "react";
import { Col, Segmented } from "antd";
import { MdSync, MdAccessTimeFilled } from "react-icons/md";
import SearchInput from "../../global/search/SearchInput";
import useQuery from "../../../hooks/useQuery";
import FilterBar from "../../global/filter/FilterBar";
import { RiHome5Fill, RiInboxFill } from "react-icons/ri";
const Filter = () => {
  const { value, onChange } = useQuery();

  return (
    <FilterBar>
      <Col span={0} lg={{ span: 9 }}>
        <SearchInput size="large" />
      </Col>
      <Col span={24} lg={{ span: 15 }}>
        <Segmented
          className="scroll-segmented"
          block
          defaultValue={value.status}
          onChange={(e) => {
            onChange({ key: "status", value: e });
          }}
          options={[
            {
              label: <span className="uppercase text-xs">all</span>,
              value: "",
              icon: <RiInboxFill className="anticon text-md" />,
            },
            {
              label: <span className="uppercase text-xs">active</span>,
              value: "active",
              icon: <MdSync className="anticon text-md" />,
            },
            {
              label: <span className="uppercase text-xs">rescheduled</span>,
              value: "rescheduled",
              icon: <MdAccessTimeFilled className="anticon" />,
            },
            {
              label: <span className="uppercase text-xs">completed</span>,
              value: "completed",
              icon: <RiHome5Fill className="anticon text-md" />,
            },
          ]}
          size="large"
        />
      </Col>

      <Col span={0} lg={{ span: 5 }} className="text-right"></Col>
    </FilterBar>
  );
};

export default Filter;
