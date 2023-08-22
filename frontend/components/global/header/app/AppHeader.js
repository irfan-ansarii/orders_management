import React from "react";
import { Row, Col, Button, Typography } from "antd";
import { MdApps } from "react-icons/md";
import Profile from "./components/Profile";
import Notifications from "./components/Notifications";
import ExternalLinks from "./components/ExternalLinks";
import Search from "./components/Search";
import SearchDrawer from "./components/SearchDrawer";
import { useTheme } from "../../../../context/useTheme";
import { getMediaURL } from "../../../../utils";
import { usePublicData } from "../../../../hooks/data/useSettingData";

const AppHeader = ({ collapsed, setCollapsed }) => {
  const { mode, screen } = useTheme();
  const { data } = usePublicData();

  const getLogo = () => {
    const lightLogo = data?.data?.data?.attributes?.logo?.data?.attributes?.url;
    const darkLogo =
      data?.data?.data?.attributes?.logoDark?.data?.attributes?.url;
    if (mode === "light" && lightLogo) {
      return getMediaURL(lightLogo);
    }
    if (mode === "dark" && darkLogo) {
      return getMediaURL(darkLogo);
    }

    return getMediaURL(lightLogo || darkLogo);
  };

  return (
    <Row className="h-100" wrap={false}>
      <Col span={7} lg={{ span: 0 }} className="">
        <Row align="middle" className="h-100 gap-2">
          <Button
            icon={<MdApps />}
            size="large"
            type="text"
            onClick={() => {
              setCollapsed(!collapsed);
            }}
          ></Button>
          <SearchDrawer />
        </Row>
      </Col>
      <Col span={0} lg={{ span: 10 }}>
        <SearchDrawer />
      </Col>

      <Col span={10} lg={{ span: 0 }} className="text-center overflow-hidden">
        {getLogo() ? (
          <img
            src={getLogo()}
            className="logo rounded"
            style={{
              height: "auto",
              maxWidth: "100%",
              mixBlendMode: "multiply",
            }}
            alt="logo"
          />
        ) : (
          <Typography.Text className="text-lg font-medium d-block">
            {data?.data?.data?.attributes?.company}
          </Typography.Text>
        )}
      </Col>

      <Col span={7} lg={{ span: 14 }}>
        <Row
          className={`h-100 ${screen.lg ? "gap-3" : ""}`}
          align="middle"
          justify="end"
          wrap={false}
        >
          {/* <ExternalLinks /> */}
          <Notifications />
          <Profile />
        </Row>
      </Col>
    </Row>
  );
};

export default AppHeader;
