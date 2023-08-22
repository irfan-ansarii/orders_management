import React, { useEffect } from "react";
import { Row, Col, App, Button, Card } from "antd";
import Filters from "../../components/views/orders/all/Filters";
import OrderCard from "../../components/views/orders/all/OrderCard";
import EmptyPage from "../../components/global/empty/EmptyPage";
import { useOrdersData } from "../../hooks/data/useOrderData";
import Pagination from "../../components/global/pagination/Pagination";
import { useRouter } from "next/router";
import { MdAdd } from "react-icons/md";
const Orders = () => {
  const { message } = App.useApp();
  const router = useRouter();

  const { isLoading, data, error } = useOrdersData(router.query);

  useEffect(() => {
    if (error && router.isReady && !isLoading)
      message.error(
        error?.response?.data?.error?.message ||
          "Unable to connect to the server. Please try again"
      );
  }, [error]);

  return (
    <div className="orders-page">
      <Filters />

      {/* fixed button */}
      <Button
        className="btn-float"
        icon={<MdAdd />}
        onClick={() => router.push("/orders/new")}
      >
        Add
      </Button>

      {/* order cards */}
      {data?.data?.data?.length > 0 && router.isReady && (
        <>
          <Row className="md-gutter-4">
            {data?.data?.data?.map((order) => (
              <Col span={24} lg={{ span: 12 }} key={order.id} className="mb-6">
                <OrderCard loading={false} data={order} />
              </Col>
            ))}
          </Row>

          <Pagination pagination={data?.data?.meta?.pagination} />
        </>
      )}
      {/* loading card */}
      {(isLoading || !router.isReady) && (
        <Row className="md-gutter-4">
          {[...Array(10)].map((val, key) => (
            <Col span={24} lg={{ span: 12 }} key={key} className="mb-6">
              <OrderCard loading={true} data={{}} />
            </Col>
          ))}
        </Row>
      )}

      {/* Error or empty */}
      {((error && !data) || (!isLoading && data?.data?.data?.length < 1)) && (
        <EmptyPage description={error} />
      )}
    </div>
  );
};

export default Orders;
