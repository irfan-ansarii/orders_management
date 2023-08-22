import React from "react";
import { useRouter } from "next/router";
import { Row, Col } from "antd";
import EmptyPage from "../../../components/global/empty/EmptyPage";
import Pagination from "../../../components/global/pagination/Pagination";
import CompletedOrderCard from "../../../components/views/rider/orders/CompletedOrderCard";
import { useCompletedOrdersData } from "../../../hooks/data/useOrderData";
import { useSession } from "../../../context/useSession";

const CompletedOrders = () => {
  const router = useRouter();
  const { user } = useSession();
  const { data, error, isLoading, mutate } = useCompletedOrdersData({
    userId: user?.id,
  });
  return (
    <>
      <div style={{ marginTop: "-4rem" }}>
        {/* orders card */}
        {data?.data?.data?.length > 0 && (
          <>
            <Row gutter={24}>
              {data?.data?.data?.map((el) => (
                <Col key={el.id} span={24} lg={{ span: 8 }} className="mb-6">
                  <CompletedOrderCard loading={false} data={el} />
                </Col>
              ))}
            </Row>
            <Pagination pagination={data?.data?.meta?.pagination} />
          </>
        )}
        {/* loading card */}
        {(isLoading || !router.isReady) && (
          <Row gutter={24}>
            {[...Array(10)].map((el, i) => (
              <Col key={i} span={24} lg={{ span: 8 }} className="mb-6">
                <CompletedOrderCard loading={true} />
              </Col>
            ))}
          </Row>
        )}
      </div>

      {/* empty order error card */}
      {((error && !data) || (!isLoading && data?.data?.data?.length < 1)) && (
        <EmptyPage description={error} />
      )}
    </>
  );
};

export default CompletedOrders;
