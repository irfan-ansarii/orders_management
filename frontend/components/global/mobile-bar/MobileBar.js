import React, { useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Row, Col, Typography, theme } from "antd";
import { MdApps } from "react-icons/md";
const { Text } = Typography;
import { useTheme } from "../../../context/useTheme";
import { useSession } from "../../../context/useSession";
import { RIDER_MENU, ADMIN_MENU } from "../../../utils/_MENU";
const MobileBar = ({ collapsed, setCollapsed }) => {
  const { screen } = useTheme();
  const { user } = useSession();
  const {
    theme: { id },
    token: {
      colorBgContainer,
      colorPrimary,
      boxShadowSecondary,
      colorTextSecondary,
    },
  } = theme.useToken();
  const router = useRouter();

  const menuItems = useMemo(() => {
    if (user.userRole === "admin") {
      const temp = [...ADMIN_MENU];
      temp.splice(2, 2);
      return temp.slice(0, 3);
    }
    return RIDER_MENU.slice(0, 3);
  }, [user]);

  const isActive = (path) => {
    return router.asPath.includes(path);
  };
  if (screen.lg) {
    return;
  }

  return (
    <div
      className="app-bar"
      style={{
        background: colorBgContainer,
        boxShadow: id === 1 ? "2px 0 20px 10px #000" : boxShadowSecondary,
      }}
    >
      <Row className="h-100 uppercase font-medium" align="middle">
        {menuItems.map((item) => (
          <Col
            key={item.key}
            span={6}
            className="text-center h-100 d-flex flex-column align-center justify-center px-3 py-2"
          >
            <Text className="d-block w-100" type="secondary">
              <Link
                href={`/${item.key}`}
                style={{
                  color: isActive(item.key) ? colorPrimary : colorTextSecondary,
                }}
              >
                <div>{item.icon}</div>
                <div className="text-xxs"> {item.label}</div>
              </Link>
            </Text>
          </Col>
        ))}

        <Col
          span={6}
          className="text-center h-100 d-flex flex-column align-center justify-center px-3 py-2"
        >
          <Text
            onClick={() => setCollapsed(!collapsed)}
            className="d-block w-100"
            style={{ color: collapsed ? colorTextSecondary : colorPrimary }}
          >
            <div>
              <MdApps className="text-lg" />
            </div>
            <div className="text-xxs"> More</div>
          </Text>
        </Col>
      </Row>
    </div>
  );
};

export default MobileBar;
