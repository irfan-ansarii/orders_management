import React from "react";
import { useRouter } from "next/router";
import { Row, Col } from "antd";

import Filter from "../../components/views/dashboard/Filter";
import StaticsCard from "../../components/views/dashboard/StaticsCard";
import OverviewCard from "../../components/views/dashboard/OverviewCard";
import CODvsPrepaidCard from "../../components/views/dashboard/CODvsPrepaidCard";
import OrderLocationCard from "../../components/views/dashboard/OrderLocationCard";
import ShippingPerformanceCard from "../../components/views/dashboard/ShippingPerformanceCard";
import CustomerOverviewCard from "../../components/views/dashboard/CustomerOverviewCard";
import RevenueCard from "../../components/views/dashboard/RevenueCard";
import LocalDeliveryCard from "../../components/views/dashboard/LocalDeliveryCard";
import TopCustomersCard from "../../components/views/dashboard/TopCustomersCard";
import BestSellersCard from "../../components/views/dashboard/BestSellersCard";
import {
  useOrdersData,
  useLocalDeliveryData,
} from "../../hooks/data/useOrderData";
import { useCheckoutsData } from "../../hooks/data/useCheckoutData";

const Dashboard = () => {
  const router = useRouter();
  const orders = useOrdersData({ ...router.query, pageSize: 100 });
  const checkouts = useCheckoutsData({ ...router.query, pageSize: 100 });
  const localDelivery = useLocalDeliveryData({
    ...router.query,
    pageSize: 100,
  });

  return (
    <>
      <Filter />
      <Row gutter={24}>
        <StaticsCard
          loading={orders.isLoading || !router.isReady || checkouts.isLoading}
          orders={orders?.data?.data?.data}
          checkouts={checkouts?.data?.data?.data}
        />
        <Col span={24} xl={{ span: 16 }} className="mb-6">
          <OverviewCard
            loading={orders.isLoading || !router.isReady}
            orders={orders?.data?.data?.data}
          />
        </Col>

        <Col span={24} md={{ span: 12 }} xl={{ span: 8 }} className="mb-6">
          <CustomerOverviewCard
            loading={orders.isLoading || !router.isReady}
            orders={orders?.data?.data?.data}
          />
        </Col>
        <Col span={24} md={{ span: 12 }} xl={{ span: 8 }} className="mb-6">
          <CODvsPrepaidCard
            loading={orders.isLoading || !router.isReady}
            orders={orders?.data?.data?.data}
          />
        </Col>
        <Col span={24} md={{ span: 12 }} xl={{ span: 8 }} className="mb-6">
          <OrderLocationCard
            loading={orders.isLoading || !router.isReady}
            orders={orders?.data?.data?.data}
          />
        </Col>
        <Col span={24} md={{ span: 12 }} xl={{ span: 8 }} className="mb-6">
          <ShippingPerformanceCard
            loading={orders.isLoading || !router.isReady}
            orders={orders?.data?.data?.data}
          />
        </Col>
        <Col span={24} xl={{ span: 16 }} className="mb-6">
          <RevenueCard
            loading={orders.isLoading || !router.isReady}
            orders={orders?.data?.data?.data}
          />
        </Col>
        <Col span={24} xl={{ span: 8 }} className="mb-6">
          <TopCustomersCard
            loading={orders.isLoading || !router.isReady}
            orders={orders?.data?.data?.data}
          />
        </Col>

        <Col span={24} xl={{ span: 16 }} className="mb-6">
          <LocalDeliveryCard
            loading={localDelivery.isLoading || !router.isReady}
            localDelivery={localDelivery?.data?.data?.data}
          />
        </Col>

        <Col span={24} xl={{ span: 8 }} className="mb-6">
          <BestSellersCard
            loading={orders.isLoading || !router.isReady}
            orders={orders?.data?.data?.data}
          />
        </Col>
      </Row>
    </>
  );
};

export default Dashboard;
