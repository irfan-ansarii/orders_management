import React from "react";
import { Layout } from "antd";
import { useRouter } from "next/router";
import { useTheme } from "../../../../context/useTheme";
import AppHeader from "./AppHeader";
import PageHeader from "../app/PageHeader";

const Header = ({ collapsed, setCollapsed }) => {
  const router = useRouter();
  const { screen } = useTheme();

  const header = () => {
    const path = router.asPath?.split("?")?.[0];
    if (screen.lg || path === "/dashboard" || path === "/rider/overview") {
      return <AppHeader collapsed={collapsed} setCollapsed={setCollapsed} />;
    }

    return <PageHeader />;
  };

  return <Layout.Header className="app-header">{header()}</Layout.Header>;
};

export default Header;
