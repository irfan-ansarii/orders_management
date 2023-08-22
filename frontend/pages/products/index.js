import { useEffect } from "react";
import { useRouter } from "next/router";
import { Col, Row, App, Button } from "antd";
import Filter from "../../components/views/products/all/Filter";
import Pagination from "../../components/global/pagination/Pagination";
import ProductCard from "../../components/views/products/all/ProductCard";
import EmptyPage from "../../components/global/empty/EmptyPage";
import { useProductsData } from "../../hooks/data/useProductData";
import { MdAdd } from "react-icons/md";
const Products = () => {
  const { message } = App.useApp();
  const router = useRouter();

  const { isLoading, data, error } = useProductsData(router.query);

  const isEmpty = data?.data?.data?.length < 1;

  useEffect(() => {
    if (error && router.isReady && !isLoading)
      message.error(
        error?.response?.data?.error?.message ||
          "Unable to connect to the server. Please try again"
      );
  }, [error]);

  return (
    <>
      <Filter />
      {/* product cards */}
      <Button
        className="btn-float"
        icon={<MdAdd />}
        onClick={() => router.push("/products/new")}
      >
        Add
      </Button>
      {!isLoading && data?.data?.data?.length >= 1 && router.isReady && (
        <>
          <Row className="md-gutter-4">
            {data?.data?.data?.map((product) => (
              <Col span={24} lg={{ span: 12 }} key={product?.id}>
                <ProductCard data={product} loading={!router.isReady} />
              </Col>
            ))}
          </Row>

          <Pagination pagination={data?.data?.meta?.pagination} />
        </>
      )}
      {/* loading card */}
      {(isLoading || !router.isReady) && (
        <Row className="md-gutter-4">
          {Array(10)
            .fill()
            .map((val, key) => (
              <Col span={24} lg={{ span: 12 }} key={key}>
                <ProductCard loading />
              </Col>
            ))}
        </Row>
      )}

      {/* Error or empty */}
      {((error && !data) || isEmpty) && router.isReady && (
        <EmptyPage description={error} />
      )}
    </>
  );
};
export default Products;
