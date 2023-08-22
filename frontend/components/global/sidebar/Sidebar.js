import React from "react";
import Link from "next/link";
import { MdLogout, MdWest } from "react-icons/md";
import { BsFillMoonFill, BsSunFill } from "react-icons/bs";
import {
  Card,
  Row,
  Button,
  Avatar,
  Drawer,
  Badge,
  Typography,
  Tooltip,
  Col,
  Segmented,
} from "antd";
import SimpleBar from "simplebar-react";
import { useTheme } from "../../../context/useTheme";
import { useSession } from "../../../context/useSession";
import { getAvatarName } from "../../../utils";
import Navigation from "./Navigation";
import { getMediaURL } from "../../../utils";

import { usePublicData } from "../../../hooks/data/useSettingData";
const { Text } = Typography;

const Sidebar = ({ collapsed, setCollapsed }) => {
  const { logout, user } = useSession();
  const { mode, onChange, screen } = useTheme();
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
    <Drawer
      title={
        getLogo() ? (
          <img
            src={getLogo()}
            className="logo rounded"
            style={{ maxHeight: "54px" }}
            alt="logo"
          />
        ) : (
          <Typography.Text className="text-lg font-medium d-block">
            {data?.data?.data?.attributes?.company}
          </Typography.Text>
        )
      }
      rootClassName={`app-sidebar mode-${mode}`}
      placement="left"
      destroyOnClose={true}
      open={screen.lg ? true : !collapsed}
      onClose={() => setCollapsed(true)}
      closeIcon={<MdWest className="text-xl" />}
      zIndex={999}
    >
      <Row className="flex-column h-100 flex-nowrap">
        <Col flex="0 0 auto">
          <Card
            bordered={false}
            size="small"
            className="ml-2 mb-4 mr-2 dark-bg-card"
          >
            <Row wrap={false} justify="space-between">
              <Link href="/profile">
                <Row
                  align="middle"
                  className="flex-grow-1 flex-shrink-0"
                  wrap={false}
                >
                  <Badge dot={true} color="green" offset={[-5, 35]}>
                    <Avatar
                      shape="square"
                      size={40}
                      className="sidebar-profile uppercase"
                      src={getMediaURL(user?.image?.url)}
                    >
                      {getAvatarName(user?.name || user?.username)}
                    </Avatar>
                  </Badge>
                  <Text
                    className="text-xs font-medium uppercase text-secondary ml-2"
                    ellipsis={true}
                  >
                    {user?.name || user?.username}
                    <div style={{ fontSize: "10px" }}>{user?.userRole}</div>
                  </Text>
                </Row>
              </Link>
              <Tooltip title="Logout">
                <Button
                  onClick={logout}
                  type="text"
                  danger
                  className="text-button"
                  size="large"
                  icon={<MdLogout />}
                />
              </Tooltip>
            </Row>
          </Card>
        </Col>
        <SimpleBar className="flex-fill overflow-y-auto simple-bar">
          <Navigation setCollapsed={setCollapsed} />
        </SimpleBar>
        <Col className="pb-4 pl-2 pr-2" flex="0 0 auto">
          <Segmented
            size="large"
            options={[
              {
                icon: <BsSunFill className="anticon" />,
                label: "Light",
                value: "light",
              },
              {
                icon: <BsFillMoonFill className="anticon " />,
                label: "Dark",
                value: "dark",
              },
            ]}
            block
            onChange={onChange}
            defaultValue={mode}
          />
        </Col>
      </Row>
    </Drawer>
  );
};

export default Sidebar;
