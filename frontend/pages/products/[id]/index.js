import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useAppSettting } from "../../../context/useAppSettting";
import { Row, Col, App, Button } from "antd";
import SinglePageContent from "../../../components/global/single-page-content/SinglePageContent";
import ProductCard from "../../../components/views/products/single/ProductCard";
import TimelineCard from "../../../components/views/timeline/TimelineCard";
import VariantsCard from "../../../components/views/products/single/VariantsCard";
import { useProductData } from "../../../hooks/data/useProductData";
import EmptyPage from "../../../components/global/empty/EmptyPage";
import Actions from "../../../components/views/products/single/Actions";

import { MdAdd } from "react-icons/md";

const Single = () => {
  const router = useRouter();
  const { message } = App.useApp();
  const { pageTitle, setPageTitle } = useAppSettting();
  const { isLoading, data, error } = useProductData({ id: router?.query?.id });

  useEffect(() => {
    if (error && router.isReady)
      message.open({
        type: "error",
        content:
          error?.response?.data?.error?.message ||
          "Unable to connect to the server. Please try again",
      });
  }, [error]);

  useEffect(() => {
    if (data) setPageTitle(data?.data?.data?.attributes?.name);
  }, [data]);

  return (
    <SinglePageContent
      title={pageTitle}
      action={<Actions data={data?.data?.data} />}
    >
      {/* mobile/tablet action buttons */}
      <Button
        className="btn-float"
        icon={<MdAdd />}
        onClick={() => router.push("/orders/new")}
      >
        Add
      </Button>
      {/* error */}
      {error && !data && router.isReady && <EmptyPage description={error} />}
      {/* content */}
      {!error && (
        <Row className="lg-gutter-4">
          <Col span={24} lg={{ span: 15 }}>
            <ProductCard
              data={data?.data?.data}
              loading={isLoading || !router.isReady}
            />

            <VariantsCard
              data={data?.data?.data}
              loading={isLoading || !router.isReady}
            />
          </Col>
          <Col span={24} lg={{ span: 9 }} className="mb-6">
            <TimelineCard
              filters={{ ref: "products", refId: data?.data?.data?.id }}
            />
          </Col>
        </Row>
      )}
    </SinglePageContent>
  );
};

export default Single;
