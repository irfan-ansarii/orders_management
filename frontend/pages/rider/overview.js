import React, { useMemo } from "react";
import { useRouter } from "next/router";
import Filter from "../../components/views/dashboard/Filter";
import StaticsCard from "../../components/views/rider/overview/StaticsCard";
import OrdersCard from "../../components/views/rider/overview/OrdersCard";
import { useLocalDeliveryData } from "../../hooks/data/useOrderData";
import { useSession } from "../../context/useSession";
const Overview = () => {
  const router = useRouter();
  const { user } = useSession();
  const { data, isLoading, error } = useLocalDeliveryData({
    userId: user.id,
    ...router.query,
  });

  const total = useMemo(() => {
    return data?.data?.data?.length || 0;
  }, [data]);

  const active = useMemo(() => {
    if (!data?.data?.data) return 0;
    return data?.data?.data?.reduce((acc, cur) => {
      const criteria = [
        "out_for_delivery",
        "out_for_pickup",
        "in_transit",
        "rto_initiated",
      ];

      const current = cur?.attributes?.currentStatus?.data?.attributes?.name;
      if (criteria.includes(current)) {
        return acc + 1;
      }
      return acc;
    }, 0);
  }, [data]);

  const rescheduled = useMemo(() => {
    if (!data?.data?.data) return 0;
    return data?.data?.data?.reduce((acc, cur) => {
      const criteria = ["undelivered", "return_rescheduled"];

      const current = cur?.attributes?.currentStatus?.data?.attributes?.name;
      if (criteria.includes(current)) {
        return acc + 1;
      }
      return acc;
    }, 0);
  }, [data]);

  const completed = useMemo(() => {
    if (!data?.data?.data) return 0;
    return data?.data?.data.reduce((acc, cur) => {
      const criteria = [
        "delivered",
        "returned",
        "return_cancelled",
        "rto_delivered",
      ];

      const current = cur?.attributes?.currentStatus?.data?.attributes?.name;

      if (criteria.includes(current)) {
        return acc + 1;
      }
      return acc;
    }, 0);
  }, [data]);

  return (
    <>
      <Filter title="overview" />
      <StaticsCard
        data={{
          total,
          active,
          rescheduled,
          completed,
        }}
        loading={isLoading || !router.isReady}
      />
      <OrdersCard
        data={data?.data?.data}
        loading={isLoading || !router.isReady}
      />
    </>
  );
};

export default Overview;
