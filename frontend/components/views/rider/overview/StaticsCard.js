import React from "react";
import { Row, Col } from "antd";
import StaticCard from "../../dashboard/StaticCard";
import { MdAutorenew } from "react-icons/md";
import { RiShoppingBag3Fill, RiTimeFill, RiHome5Fill } from "react-icons/ri";

const StaticsCard = ({ loading, data }) => {
  return (
    <Row gutter={24}>
      <Col span={24} sm={{ span: 12 }} xl={{ span: 6 }} className="mb-6">
        <StaticCard
          loading={loading}
          title="total Orders"
          value={data.total}
          color="magenta"
          icon={<RiShoppingBag3Fill />}
          progress={[
            {
              value: data.total ? 100 : 0,
            },
          ]}
        />
      </Col>
      <Col span={24} sm={{ span: 12 }} xl={{ span: 6 }} className="mb-6">
        <StaticCard
          loading={loading}
          title="active"
          value={data.active}
          color="blue"
          icon={<MdAutorenew />}
          progress={[
            {
              value: (data.active / data.total) * 100,
            },
          ]}
        />
      </Col>
      <Col span={24} sm={{ span: 12 }} xl={{ span: 6 }} className="mb-6">
        <StaticCard
          loading={loading}
          title="rescheduled"
          value={data.rescheduled}
          color="volcano"
          icon={<RiTimeFill />}
          progress={[
            {
              value: (data.rescheduled / data.total) * 100,
            },
          ]}
        />
      </Col>
      <Col span={24} sm={{ span: 12 }} xl={{ span: 6 }} className="mb-6">
        <StaticCard
          loading={loading}
          title="completed"
          value={data.completed}
          color="success"
          icon={<RiHome5Fill />}
          progress={[
            {
              value: (data.completed / data.total) * 100,
            },
          ]}
        />
      </Col>
    </Row>
  );
};

export default StaticsCard;
StaticsCard.defaultProps = {
  data: {
    total: 0,
    active: 0,
    rescheduled: 0,
    completed: 0,
  },
};
