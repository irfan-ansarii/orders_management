import React from "react";
import { useRouter } from "next/router";
import { Row, Col } from "antd";
import SinglePage from "../../components/global/single-page-content/SinglePageContent";
import StatusCard from "../../components/views/checkouts/single/StatusCard";
import DetailsCard from "../../components/views/checkouts/single/DetailsCard";
import ItemsCard from "../../components/views/checkouts/single/ItemsCard";
import CustomerCard from "../../components/views/checkouts/single/CustomerCard";
import TimelineCard from "../../components/views/timeline/TimelineCard";
import EmptyPage from "../../components/global/empty/EmptyPage";
import CheckoutURLCard from "../../components/views/checkouts/single/CheckoutURLCard";
import { useCheckoutData } from "../../hooks/data/useCheckoutData";
const CheckoutSingle = () => {
  const router = useRouter();

  const { isLoading, data, error } = useCheckoutData(router.query.id);

  // if not loading and data is not available
  if (!isLoading && !data?.data?.data && router.isReady) {
    return <EmptyPage />;
  }

  return (
    <SinglePage>
      {/* error */}
      {error && !data && router.isReady && <EmptyPage description={error} />}

      {/* content */}
      {!error && (
        <Row className="lg-gutter-4">
          <Col span={24} lg={{ span: 15 }} className="mb-6">
            <StatusCard
              data={data?.data?.data}
              loading={isLoading || !router.isReady}
            />
            <DetailsCard
              data={data?.data?.data}
              loading={isLoading || !router.isReady}
            />
            <ItemsCard
              data={data?.data?.data}
              loading={isLoading || !router.isReady}
            />
            <CustomerCard
              data={data?.data?.data}
              loading={isLoading || !router.isReady}
            />
          </Col>
          <Col span={24} lg={{ span: 9 }} className="mb-6">
            <CheckoutURLCard
              data={data?.data?.data}
              loading={isLoading || !router.isReady}
            />
            <TimelineCard
              filters={{ ref: "checkouts", refId: data?.data?.data?.id }}
            />
          </Col>
        </Row>
      )}
    </SinglePage>
  );
};

export default CheckoutSingle;
