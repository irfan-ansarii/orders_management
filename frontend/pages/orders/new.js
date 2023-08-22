import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { Button, Row, Col, Form, App } from "antd";
import SinglePageContent from "../../components/global/single-page-content/SinglePageContent";
import DetailsCard from "../../components/views/orders/new/DetailsCard";
import CustomerCard from "../../components/views/orders/new/CustomerCard";
import ProductCard from "../../components/views/orders/new/ProductCard";
import { useAppSettting } from "../../context/useAppSettting";
import { useCreateOrder } from "../../hooks/data/useOrderData";
import dayjs from "dayjs";
import capitalize from "capitalize";

const NewOrder = () => {
  const [form] = Form.useForm();
  const { message } = App.useApp();
  const router = useRouter();
  const { isMutating, trigger } = useCreateOrder();
  const { setPageTitle } = useAppSettting();

  const setFormData = async (newOrderData) => {
    const {
      platform,
      orderDate,
      name,
      paymentMode,
      type,
      shippingAddress,
      lineItems,
      shippingTotal,
      subtotal,
      taxTotal,
      discountTotal,
      total,
      outstandingTotal,
      customer,
    } = newOrderData || {};

    const formData = {
      platform: platform?.data?.id,
      orderDate: dayjs(orderDate || dayjs(), "YYYY-MM-DD"),
      name,
      paymentMode: paymentMode || "cod",
      customer: customer?.data?.id,
      shippingAddress,
      type: type || "new",
      lineItems:
        lineItems?.data?.map((item) => {
          return {
            variant: item?.attributes?.variant?.data?.id,
            product: item?.attributes?.product?.data?.id,
            sku: item?.attributes?.variant?.data?.attributes?.sku,
            tax: item?.attributes?.tax,
            name: item?.attributes?.name,
            variantName: item?.attributes?.variantName,
            price: item?.attributes?.price,
            salePrice: item?.attributes?.salePrice,
            discount: item?.attributes?.discount,
            quantity: item?.attributes?.quantity,
            image:
              item?.attributes?.product?.data?.attributes?.image?.data
                ?.attributes?.formats?.thumbnail?.url,
          };
        }) || [],
      shippingTotal: Number(shippingTotal) || 0,
      subtotal: Number(subtotal) || 0,
      taxTotal: Number(taxTotal) || 0,
      discountTotal: Number(discountTotal) || 0,
      total: Number(total) || 0,
      outstandingTotal: Number(outstandingTotal) || 0,
    };
    const orderName = form.getFieldValue("name");
    if (!orderName) await form.setFieldsValue(formData);

    localStorage.removeItem("newOrderData");
  };

  useEffect(() => {
    setPageTitle("new order");
  }, []);

  useEffect(() => {
    const json = localStorage.getItem("newOrderData");
    const parsedOrderData = JSON.parse(json);
    setFormData(parsedOrderData);
  }, [router.isReady]);

  const onSubmit = (values) => {
    values.billingAddress = values.shippingAddress;

    trigger(
      { data: values },
      {
        onSuccess: (res) => {
          const type = res.data.data.attributes.type;
          const query =
            type === "return"
              ? { status: "return" }
              : type === "exchange"
              ? { status: "exchange" }
              : {};

          message.success(
            capitalize(`${type} order has been created successfully.`)
          );
          setTimeout(() => {
            router.replace({ pathname: "/orders", query: query });
          }, 1000);
        },
        onError: (err) => {
          const content =
            err?.response?.data?.error?.message ||
            "Unable to connect to the server. Please try again.";
          message.error(capitalize(content));
        },
      }
    );
  };

  return (
    <SinglePageContent
      action={
        <Button
          type="primary"
          size="large"
          className="px-8"
          loading={isMutating}
          onClick={() => form.submit()}
        >
          {isMutating ? "Saving..." : "Save"}
        </Button>
      }
    >
      <Form
        layout="vertical"
        onFinish={onSubmit}
        form={form}
        requiredMark={false}
        preserve={false}
      >
        <Row>
          <Col span={24} lg={{ span: 20, push: 2 }} xl={{ span: 16, push: 4 }}>
            <DetailsCard form={form} loading={!router.isReady} />
            <CustomerCard form={form} loading={!router.isReady} />
            <ProductCard form={form} loading={!router.isReady} />
          </Col>
        </Row>
      </Form>
    </SinglePageContent>
  );
};

export default NewOrder;
