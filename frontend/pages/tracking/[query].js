import React, { useEffect } from "react";
import { useRouter } from "next/router";
import TrackLayout from "../../layouts/TrackLayout";
import Header from "../../components/views/track/Header";
import OrderDetails from "../../components/views/track/OrderDetails";
import StatusCard from "../../components/views/track/StatusCard";
import SimpleBar from "simplebar-react";
import { Col, App, Card, Badge, Button } from "antd";
import { useTrackOrders } from "../../hooks/data/useOrderData";
import InfoCard from "../../components/views/track/InfoCard";
import ItemDetails from "../../components/views/track/ItemDetails";
import EmptyPage from "../../components/global/empty/EmptyPage";
import OrderAction from "../../components/views/track/OrderAction";

const TrackingDetails = () => {
  const router = useRouter();
  const { message } = App.useApp();
  const { isMutating, data, trigger, error } = useTrackOrders();

  useEffect(() => {
    trigger(router.query, {
      onError: (err) => {
        // open error
        message.open({
          type: "error",
          content:
            err?.response?.data?.error?.message ||
            "Unable to connect to the server. Please try again",
        });
      },
    });
  }, [router.isReady]);

  return (
    <>
      <Col flex="0 0 auto">
        <Header />
      </Col>
      <SimpleBar className="overflow-y-auto flex-fill simple-bar">
        {/* error */}
        {((!isMutating && router.isReady && error) ||
          data?.data?.data?.length <= 0) && <EmptyPage description={error} />}
        {/* loading */}
        {(isMutating || !router.isReady) && <Card loading bordered={false} />}

        {/* content */}
        {router.isReady &&
          data &&
          data?.data?.data?.map((order) => (
            <Badge.Ribbon
              color={
                order?.attributes?.type === "return"
                  ? "red"
                  : data?.attributes?.type === "exchange"
                  ? "geekblue"
                  : "magenta"
              }
              text={order?.attributes?.type}
              className="rotate"
              key={order.id}
            >
              <Card
                bordered={false}
                key={order.id}
                className="px-2 pt-4 mb-6"
                size="small"
              >
                <StatusCard data={order} />

                <InfoCard data={order} />
                <OrderAction data={order} />
                <ItemDetails data={order} />
                <OrderDetails data={order} />
              </Card>
            </Badge.Ribbon>
          ))}
      </SimpleBar>
    </>
  );
};

export default TrackingDetails;

TrackingDetails.getLayout = (page) => <TrackLayout>{page}</TrackLayout>;
