import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { Row, Col } from "antd";
import EmptyPage from "../../../components/global/empty/EmptyPage";
import Pagination from "../../../components/global/pagination/Pagination";
import NewOrderCard from "../../../components/views/rider/orders/NewOrderCard";
import { usePackedOrdersData } from "../../../hooks/data/useOrderData";
import { useAppSettting } from "../../../context/useAppSettting";
import { useSession } from "../../../context/useSession";
const NewOrders = () => {
  const router = useRouter();
  const { user } = useSession();
  const { data, isLoading, error, mutate } = usePackedOrdersData();
  const { setPageTitle } = useAppSettting();

  useEffect(() => {
    setPageTitle("new orders");
  }, []);
  return (
    <>
      <div style={{ marginTop: "-4rem" }}>
        {/* orders card */}
        {router.isReady && data?.data?.data?.length > 0 && (
          <>
            <Row gutter={24}>
              {data?.data?.data?.map((el) => (
                <Col key={el.id} span={24} lg={{ span: 8 }} className="mb-6">
                  <NewOrderCard
                    loading={false}
                    data={el}
                    mutate={mutate}
                    user={user}
                  />
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
                <NewOrderCard loading={true} />
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

export default NewOrders;
