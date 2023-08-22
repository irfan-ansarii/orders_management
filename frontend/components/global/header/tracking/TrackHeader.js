import React, { useState } from "react";
import Link from "next/link";
import { useTheme } from "../../../../context/useTheme";
import { Layout, Row, Col, theme, Segmented, Typography, Button } from "antd";
import { MdLightMode, MdNightlight, MdApps } from "react-icons/md";
import MobileDrawer from "./MobileDrawer";
import Navigation from "./Navigation";
import { getMediaURL } from "../../../../utils";
import { usePublicData } from "../../../../hooks/data/useSettingData";
const { Text } = Typography;
const { Header } = Layout;

const TrackHeader = () => {
  const { onChange, mode, screen } = useTheme();

  const [open, setOpen] = useState(false);

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

  const {
    token: { colorBgContainer, boxShadowTertiary },
  } = theme.useToken();

  return (
    <div className="w-100 position-fixed" style={{ zIndex: "999" }}>
      <div className="header-container">
        <Header
          style={{
            background: colorBgContainer,
            boxShadow: boxShadowTertiary,
          }}
        >
          <Row className="w-100" align="middle">
            <Col span={8} lg={{ span: 0 }}>
              <Button
                type="text"
                size="large"
                className="btn-action"
                icon={<MdApps className="anticon text-xl" />}
                onClick={() => setOpen(!open)}
              ></Button>
            </Col>
            <Col span={8} lg={{ span: 6 }}>
              <Row align="middle" justify={screen.lg ? "start" : "center"}>
                <Col
                  span={24}
                  className={screen.lg ? "text-left" : "text-center"}
                >
                  {getLogo() ? (
                    <img src={getLogo()} className="logo rounded" alt="logo" />
                  ) : (
                    <Text className="text-lg font-medium d-block">
                      {data?.data?.data?.attributes?.company}
                    </Text>
                  )}
                </Col>
              </Row>
            </Col>
            <Col span={0} lg={{ span: 10 }} className="overflow-hidden">
              <Navigation
                mode="horizontal"
                style={{
                  border: "none",
                  background: "transparent",
                }}
                className="justify-center uppercase"
              />
            </Col>
            <Col span={8} lg={{ span: 8 }} className="text-right">
              <Row align="middle" justify="end">
                <Link href="/auth/login">
                  <Text className="uppercase text-xs font-medium login-link px-3">
                    Login
                  </Text>
                </Link>
                <div className="lg-d-none">
                  <Segmented
                    className="text-xs uppercase"
                    options={[
                      {
                        icon: <MdLightMode className="anticon text-md" />,
                        label: "Light",
                        value: "light",
                      },
                      {
                        icon: <MdNightlight className="anticon text-md" />,
                        label: "Dark",
                        value: "dark",
                      },
                    ]}
                    block
                    onChange={onChange}
                    defaultValue={mode}
                  />
                </div>
              </Row>
            </Col>
          </Row>
        </Header>
      </div>
      <MobileDrawer
        open={open}
        setOpen={setOpen}
        title={
          getLogo() ? (
            <img
              src={getLogo()}
              className="logo rounded"
              style={{ maxHeight: "40px" }}
              alt="logo"
            />
          ) : (
            <Text
              className={`text-lg font-medium d-block ${
                screen.lg ? "text-left" : "text-center"
              }`}
            >
              {data?.data?.data?.attributes?.company}
            </Text>
          )
        }
      />
    </div>
  );
};

export default TrackHeader;
