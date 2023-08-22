import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { Row, Col, App } from "antd";
import { useAppSettting } from "../../../context/useAppSettting";
import SinglePage from "../../../components/global/single-page-content/SinglePageContent";
import Actions from "../../../components/views/orders/single/Actions";
import DetailsCard from "../../../components/views/orders/single/DetailsCard";
import StatusCard from "../../../components/views/orders/single/StatusCard";
import ItemsCard from "../../../components/views/orders/single/ItemsCard";
import CustomerCard from "../../../components/views/orders/single/CustomerCard";
import TimelineCard from "../../../components/views/timeline/TimelineCard";
import { useOrderData } from "../../../hooks/data/useOrderData";
import EmptyPage from "../../../components/global/empty/EmptyPage";

const OrderSingle = () => {
  const router = useRouter();
  const { message } = App.useApp();
  const { setPageTitle } = useAppSettting();
  const { isLoading, data, error, mutate } = useOrderData({
    id: router?.query?.id,
  });

  useEffect(() => {
    if (!isLoading && error)
      message.open({
        type: "error",
        content:
          error?.response?.data?.error?.message ||
          "Unable to connect to the server. Please try again",
      });
  }, [router.isReady]);

  useEffect(() => {
    if (data) setPageTitle(data?.data?.data?.attributes?.name);
  }, [data?.data?.data]);

  return (
    <SinglePage
      action={
        <Actions loading={isLoading} data={data?.data?.data} mutate={mutate} />
      }
    >
      {/* error  */}
      {error && !isLoading && <EmptyPage description={error} />}

      {/* content */}
      {!error && (
        <Row className="lg-gutter-4">
          <Col span={24}>
            <StatusCard
              loading={isLoading || !router.isReady}
              data={data?.data?.data}
            />
          </Col>
          <Col span={24} lg={{ span: 15 }} className="mb-6">
            <DetailsCard
              isLoading={isLoading || !router.isReady}
              data={data?.data?.data}
            />

            <ItemsCard
              isLoading={isLoading || !router.isReady}
              data={data?.data?.data}
            />
            <CustomerCard
              isLoading={isLoading || !router.isReady}
              data={data?.data?.data}
            />
          </Col>
          <Col span={24} lg={{ span: 9 }} className="mb-6">
            <TimelineCard
              filters={{ ref: "orders", refId: data?.data?.data?.id }}
              loading={isLoading || !router.isReady}
            />
          </Col>
        </Row>
      )}
    </SinglePage>
  );
};

export default OrderSingle;
