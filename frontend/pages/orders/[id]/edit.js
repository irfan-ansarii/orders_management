import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Button, Row, Col, Form, App } from "antd";
import SinglePageContent from "../../../components/global/single-page-content/SinglePageContent";
import DetailsCard from "../../../components/views/orders/new/DetailsCard";
import CustomerCard from "../../../components/views/orders/new/CustomerCard";
import ProductCard from "../../../components/views/orders/new/ProductCard";
import { useAppSettting } from "../../../context/useAppSettting";
import { useOrderData, useEditOrder } from "../../../hooks/data/useOrderData";
import dayjs from "dayjs";
const EditOrder = () => {
  const [disabled, setDisabled] = useState(false);
  const [form] = Form.useForm();
  const { message } = App.useApp();

  const router = useRouter();

  const { data, isLoading } = useOrderData({
    id: router.query.id,
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
  const { trigger, isMutating } = useEditOrder();
  const { setPageTitle } = useAppSettting();

  const setFormData = async (attributes) => {
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
      createdAt,
      currentStatus,
      cancelledAt,
    } = attributes;

    const formData = {
      platform: platform?.data?.id,
      orderDate: dayjs(orderDate || createdAt, "YYYY-MM-DD"),
      name,
      paymentMode,
      customer: customer?.data?.id,
      shippingAddress,
      type,
      lineItems:
        lineItems?.data?.map((item) => {
          const { variant, product } = item?.attributes;

          return {
            value: item?.id,
            variant: variant?.data?.id,
            product: product?.data?.id,
            sku: variant?.data?.attributes?.sku,
            tax: item?.attributes?.tax,
            name: item?.attributes?.name,
            variantName: item?.attributes?.variantName,
            price: item?.attributes?.price,
            salePrice: item?.attributes?.salePrice,
            discount: item?.attributes?.discount,
            quantity: item?.attributes?.quantity,
            image:
              product?.data?.attributes?.image?.data?.attributes?.formats
                ?.thumbnail?.url,
          };
        }) || [],
      shippingTotal: Number(shippingTotal) || 0,
      subtotal: Number(subtotal) || 0,
      taxTotal: Number(taxTotal) || 0,
      discountTotal: Number(discountTotal) || 0,
      total: Number(total) || 0,
      outstandingTotal: Number(outstandingTotal) || 0,
    };

    await form.setFieldsValue(formData);

    const status = currentStatus?.data?.attributes?.name;

    if ((!status || status === "confirmed") && cancelledAt === null) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  };

  const onSubmit = (values) => {
    const { shippingAddress: newShipping } = values;
    const previousShipping = data?.data?.attributes?.shippingAddress;
    values.shippingAddress = { ...previousShipping, ...newShipping };
    values.id = data?.data?.data?.id;

    trigger(
      { data: values },
      {
        onSuccess: (res) => {
          const { id } = res.data.data;
          message.success(`Order has been updated successfully.`);
          router.replace(`/orders/${id}`);
        },
        onError: (err) => {
          const content =
            err?.response?.data?.error?.message ||
            "Unable to connect to the server. Please try again.";
          message.error(content);
        },
      }
    );
  };

  useEffect(() => {
    const { attributes } = data?.data?.data || {};
    setFormData(attributes);
    setPageTitle("Edit Order");
  }, [data, isLoading]);

  return (
    <SinglePageContent
      action={
        !disabled && (
          <Button
            type="primary"
            size="large"
            className="px-8"
            loading={isMutating}
            onClick={() => form.submit()}
          >
            {isMutating ? "Updating..." : "Update"}
          </Button>
        )
      }
    >
      {!disabled && (
        <Button
          className="btn-float"
          onClick={() => form.submit()}
          loading={isMutating}
        >
          {isMutating ? "Updating..." : "Update"}
        </Button>
      )}
      <Form
        layout="vertical"
        onFinish={onSubmit}
        form={form}
        requiredMark={false}
        disabled={disabled}
      >
        <Row>
          <Col span={24} lg={{ span: 20, push: 2 }} xl={{ span: 16, push: 4 }}>
            <DetailsCard loading={isLoading || !router.isReady} />
            <CustomerCard form={form} loading={isLoading || !router.isReady} />
            <ProductCard form={form} loading={isLoading || !router.isReady} />
          </Col>
        </Row>
      </Form>
    </SinglePageContent>
  );
};

export default EditOrder;
