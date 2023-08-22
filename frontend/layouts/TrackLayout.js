import React from "react";
import Router from "next/router";
import TrackHeader from "../components/global/header/tracking/TrackHeader";
import { Row, Col, Layout } from "antd";
import Loading from "../components/global/loader/Loading";
import useLoading from "../hooks/useLoading";
import { usePublicData } from "../hooks/data/useSettingData";
import { getMediaURL } from "../utils";
const TrackLayout = ({ children }) => {
  const loading = useLoading([Router.events]);
  const { data } = usePublicData();

  const getBgImage = () => {
    const url = data?.data?.data?.attributes?.trackingBg?.data?.attributes?.url;

    if (url) return `url(${getMediaURL(url)})`;

    return `linear-gradient(315deg, #ffac81 0%, #ff928b 74%)`;
  };
  return (
    <>
      <TrackHeader />
      <Layout.Content>
        <Row className="h-100">
          <Col span={24} lg={{ span: 12 }} className="h-100">
            <Col className="d-flex flex-column track-content h-100">
              {loading ? <Loading /> : children}
            </Col>
          </Col>

          <Col span={0} lg={{ span: 12 }}>
            <div
              style={{
                backgroundImage: getBgImage(),
                backgroundSize: "cover",
                backgroundPosition: "center",
                height: "100%",
              }}
            ></div>
          </Col>
        </Row>
      </Layout.Content>
    </>
  );
};

export default TrackLayout;
