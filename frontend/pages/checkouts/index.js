import { useEffect } from "react";
import { useRouter } from "next/router";
import { Col, Row, App } from "antd";
import EmptyPage from "../../components/global/empty/EmptyPage";
import Filter from "../../components/views/checkouts/all/Filter";
import CheckoutCard from "../../components/views/checkouts/all/CheckoutCard";
import Pagination from "../../components/global/pagination/Pagination";
import { useCheckoutsData } from "../../hooks/data/useCheckoutData";

const Abandoned = () => {
  const router = useRouter();
  const { message } = App.useApp();

  const { isLoading, error, data } = useCheckoutsData(router.query);

  useEffect(() => {
    if (error)
      message.open({
        type: "error",
        content: "Unable to connect to the server. Please try again",
      });
  }, [error]);

  return (
    <>
      <Filter />

      {/* data card */}
      {data?.data?.data?.length > 0 && !isLoading && router.isReady && (
        <>
          <Row className="md-gutter-4">
            {data.data.data.map((data) => (
              <Col span={24} md={{ span: 12 }} key={data.id}>
                <CheckoutCard data={data} />
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
            <Col span={24} md={{ span: 12 }} key={key}>
              <CheckoutCard loading />
            </Col>
          ))}
        </Row>
      )}

      {/* Error or empty */}
      {(error || data?.data?.data?.length <= 0) && (
        <EmptyPage description={error} />
      )}
    </>
  );
};
export default Abandoned;
