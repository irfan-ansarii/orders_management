import React, { useEffect } from "react";
import dynamic from "next/dynamic";
import { Row, Col, Segmented } from "antd";
import useQuery from "../../hooks/useQuery";
import FilterBar from "../../components/global/filter/FilterBar";

const Application = dynamic(
  () => import("../../components/views/setting/Application"),
  { ssr: false }
);
const Integration = dynamic(
  () => import("../../components/views/setting/Integration"),
  { ssr: false }
);
const Platforms = dynamic(
  () => import("../../components/views/setting/platforms/Platforms"),
  { ssr: false }
);
const Notifications = dynamic(
  () => import("../../components/views/setting/Notifications"),
  { ssr: false }
);

const Tracking = dynamic(
  () => import("../../components/views/setting/tracking_page/Tracking"),
  { ssr: false }
);

const Settings = () => {
  const { onChange, value } = useQuery();

  const getComponent = (query) => {
    switch (query) {
      case "notifications":
        return <Notifications />;
      case "integration":
        return <Integration />;
      case "platforms":
        return <Platforms />;

      case "tracking":
        return <Tracking />;
      default:
        return <Application />;
    }
  };
  useEffect(() => {
    getComponent(value);
  }, [value]);

  return (
    <>
      <FilterBar>
        <Col span={24}>
          <Segmented
            onChange={(e) => onChange({ key: "section", value: e })}
            block
            className="scroll-segmented font-medium "
            defaultValue={value.section}
            size="large"
            options={[
              {
                label: <span className="uppercase text-xs">application</span>,
                value: "applications",
              },
              {
                label: <span className="uppercase text-xs">integrations</span>,
                value: "integration",
              },
              {
                label: <span className="uppercase text-xs">notifications</span>,
                value: "notifications",
              },
              {
                label: <span className="uppercase text-xs">Platforms</span>,
                value: "platforms",
              },

              {
                label: (
                  <span className="uppercase text-xs">tracking Navigation</span>
                ),
                value: "tracking",
              },
            ]}
          />
        </Col>
      </FilterBar>

      <Row>
        <Col span={24} lg={{ span: 20, push: 2 }} xl={{ span: 16, push: 4 }}>
          {getComponent(value.section)}
        </Col>
      </Row>
    </>
  );
};

export default Settings;
