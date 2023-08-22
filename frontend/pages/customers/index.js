import { useEffect } from "react";
import { useRouter } from "next/router";
import { Col, Row, App } from "antd";
import { useCustomersData } from "../../hooks/data/useCustomerData";
import { useTheme } from "../../context/useTheme";
import EmptyPage from "../../components/global/empty/EmptyPage";
import Filter from "../../components/views/customers/all/Filter";

import CustomerCard from "../../components/views/customers/all/CustomerCard";
import Pagination from "../../components/global/pagination/Pagination";

const Customers = () => {
  const router = useRouter();

  const { message } = App.useApp();
  const { screen } = useTheme();

  const { isLoading, error, data } = useCustomersData(router.query);

  useEffect(() => {
    if (error && router.isReady)
      message.open({
        type: "error",
        content:
          error?.response?.data?.error?.message ||
          "Unable to connect to the server. Please try again",
      });
  }, [error, router.isReady]);

  return (
    <>
      <Filter />

      {data?.data?.data?.length > 0 && router.isReady && (
        <>
          <Row
            className="md-gutter-4"
            style={{ marginTop: screen.lg ? "0" : "-60px" }}
          >
            {data?.data?.data?.map((data) => (
              <Col span={24} md={{ span: 12 }} key={data?.id}>
                <CustomerCard
                  data={data}
                  loading={isLoading || !router.isReady}
                />
              </Col>
            ))}
          </Row>
          {!isLoading && router.isReady && (
            <Pagination pagination={data?.data?.meta?.pagination} />
          )}
        </>
      )}

      {/* loading card */}
      {(isLoading || !router.isReady) && (
        <Row className="md-gutter-4">
          {Array(10)
            .fill()
            .map((val, key) => (
              <Col key={key} span={24} md={{ span: 12 }}>
                <CustomerCard loading />
              </Col>
            ))}
        </Row>
      )}

      {/* Error or empty */}
      {((error && !data) || data?.data?.data?.length <= 0) &&
        router.isReady && <EmptyPage description={error} />}
    </>
  );
};
export default Customers;
