import React, { useState, useEffect } from "react";
import { Layout } from "antd";
import { useRouter } from "next/router";
import { useSession } from "../context/useSession";
import AppHeader from "../components/global/header/app";
import Sidebar from "../components/global/sidebar/Sidebar";
import AppFooter from "../components/global/footer/AppFooter";
import Loading from "../components/global/loader/Loading";
import MobileBar from "../components/global/mobile-bar/MobileBar";
import ProgressLoader from "../components/global/loader/ProgressLoader";
const { Content, Footer } = Layout;

const AppLayout = ({ children }) => {
  const router = useRouter();
  const { loading, session, isValidating, logout } = useSession();
  const [collapsed, setCollapsed] = useState(true);

  useEffect(() => {
    if (session === false && !isValidating && router.isReady) {
      logout({ redirectURL: "/auth/login" });
    }
  }, [isValidating, session, router.isReady]);

  if (session === null || session === false) {
    return <ProgressLoader />;
  }

  return (
    <Layout hasSider>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <Layout className="app-layout">
        <AppHeader collapsed={collapsed} setCollapsed={setCollapsed} />
        <Content className="app-content d-flex flex-column">
          <Layout className={`app-content-inner ${loading ? "loading" : ""}`}>
            {loading ? <Loading /> : children}
          </Layout>
          <Footer className="app-footer">
            <AppFooter />
          </Footer>
        </Content>
      </Layout>
      <MobileBar collapsed={collapsed} setCollapsed={setCollapsed} />
    </Layout>
  );
};

export default AppLayout;
