import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useAppSettting } from "../../context/useAppSettting";
import { Row, Col, Button, App } from "antd";
import { useCustomerData } from "../../hooks/data/useCustomerData";
import CustomerCard from "../../components/views/customers/single/CustomerCard";
import DefaultAddressCard from "../../components/views/customers/single/DefaultAddressCard";
import AddressesCard from "../../components/views/customers/single/AddressesCard";
import SinglePageContent from "../../components/global/single-page-content/SinglePageContent";
import EditDrawer from "../../components/views/customers/single/EditDrawer";
import EmptyPage from "../../components/global/empty/EmptyPage";
import Actions from "../../components/views/customers/single/Actions";
import OrdersCard from "../../components/views/customers/single/OrdersCard";

const CustomerDetails = () => {
  const { setPageTitle, pageTitle } = useAppSettting();
  const router = useRouter();

  const { message } = App.useApp();
  const { isLoading, data, error } = useCustomerData(router.query.id);

  useEffect(() => {
    const name = data?.data?.data?.attributes?.name;
    if (name) setPageTitle(name);
  }, [data]);

  useEffect(() => {
    if (error && router.isReady)
      message.open({
        type: "error",
        content:
          error?.response?.data?.error?.message ||
          "Unable to connect to the server. Please try again",
      });
  }, [error]);
  return (
    <SinglePageContent
      title={pageTitle}
      action={<Actions customer={data?.data?.data} />}
    >
      {/* Edit drawer */}
      <EditDrawer customer={data?.data?.data} />

      {/* content */}
      {!error && (
        <Row className="lg-gutter-4">
          <Col span={24} lg={{ span: 15 }}>
            <CustomerCard
              data={data?.data?.data}
              loading={isLoading || !router.isReady}
            />
            <DefaultAddressCard
              data={data?.data?.data}
              loading={isLoading || !router.isReady}
            />
            <OrdersCard
              data={data?.data?.data}
              loading={isLoading || !router.isReady}
            />
          </Col>
          <Col span={24} lg={{ span: 9 }}>
            <AddressesCard
              data={data?.data?.data}
              loading={isLoading || !router.isReady}
            />
          </Col>
        </Row>
      )}

      {/* error */}
      {error && !data && router.isReady && <EmptyPage description={error} />}
    </SinglePageContent>
  );
};

export default CustomerDetails;
