import React, { useEffect } from "react";
import { useSession } from "../context/useSession";
import { Row, Col, Layout } from "antd";
import { useRouter } from "next/router";
import Loading from "../components/global/loader/Loading";
import ProgressLoader from "../components/global/loader/ProgressLoader";
import { usePublicData } from "../hooks/data/useSettingData";
import { getMediaURL } from "../utils";
const AuthLayout = ({ children }) => {
  const { loading, session, isValidating } = useSession();
  const router = useRouter();
  const { data } = usePublicData();

  const getBgImage = () => {
    const url = data?.data?.data?.attributes?.authBg?.data?.attributes?.url;

    if (url) return `url(${getMediaURL(url)})`;

    return ``;
  };

  useEffect(() => {
    if (session === true && !isValidating && router.isReady) {
      router.replace("/dashboard");
    }
  }, [isValidating, session, router.isReady]);

  if (isValidating || session === true || session === null) {
    return <ProgressLoader />;
  }

  return (
    <Layout.Content>
      <Row className="h-100">
        <Col span={24} lg={{ span: 10 }}>
          {loading ? (
            <Loading />
          ) : (
            <Col className="auth-form px-4 pt-16 h-100">{children}</Col>
          )}
        </Col>
        <Col
          span={0}
          lg={{ span: 14 }}
          className="auth-bg"
          style={{
            backgroundImage: getBgImage(),
          }}
        ></Col>
      </Row>
    </Layout.Content>
  );
};

export default AuthLayout;
