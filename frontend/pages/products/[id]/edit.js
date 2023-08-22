import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { Col, Form, Button, App } from "antd";
import SinglePageContent from "../../../components/global/single-page-content/SinglePageContent";
import GeneralCard from "../../../components/views/products/new/GeneralCard";
import MediaCard from "../../../components/views/products/edit/MediaCard";
import OptionsCard from "../../../components/views/products/new/OptionsCard";
import VariantsCard from "../../../components/views/products/new/VariantsCard";
import {
  useEditProduct,
  useProductData,
} from "../../../hooks/data/useProductData";
import capitalize from "capitalize";

const NewProduct = () => {
  const router = useRouter();
  const [form] = Form.useForm();

  const { data, isLoading, mutate } = useProductData({
    id: router.query.id,
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  const { isMutating, trigger } = useEditProduct();
  const { message } = App.useApp();

  const getInitialValues = () => {
    if (!data || isLoading || !router.isReady) return;

    const { attributes } = data?.data?.data;
    const variants = attributes?.variants?.data;
    const { status, name, description, options } = attributes;

    form.setFieldsValue({ status, name, description });

    const isSingle = options?.length === 1 && options?.[0]?.name === "Title";

    const transformedVariants = variants.map(({ id, attributes }) => ({
      id,
      ...attributes,
    }));

    if (isSingle) {
      form.setFieldsValue({
        defaultOptions: options,
        defaultVariants: transformedVariants,
      });
    } else {
      form.setFieldsValue({
        options,
      });

      setTimeout(() => {
        form.setFieldsValue({ variations: transformedVariants });
      }, 500);
    }
  };
  useEffect(() => {
    getInitialValues();
  }, [data]);

  const handleSubmit = (values) => {
    const { options, variations, defaultOptions, defaultVariants } = values;

    if (!variations || variations.length === 0) {
      values.variations = defaultVariants;
    }
    if (!options || options.length === 0) {
      values.options = defaultOptions;
    }

    trigger(
      { data: { ...values, id: data?.data?.data?.id } },
      {
        onSuccess: (res) => {
          const title = res?.data?.data?.attributes?.name;
          message.success(
            capitalize(`${title} has been successfully updated.`)
          );
          router.replace("/products");
        },

        onError: (err) => {
          const content =
            err?.response?.data?.error?.message ||
            "Unable to connect to the server. Please try again";
          message.error(capitalize(content));
        },
      }
    );
  };

  return (
    <SinglePageContent
      title="new product"
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
      {/* mobile/tablet action buttons */}
      <Button className="btn-float" onClick={() => form.submit()}>
        {isMutating ? "Saving..." : "Save"}
      </Button>

      <Form
        layout="vertical"
        onFinish={handleSubmit}
        form={form}
        requiredMark={false}
      >
        <Col span={24} lg={{ span: 20, push: 2 }} xl={{ span: 16, push: 4 }}>
          <GeneralCard form={form} loading={isLoading || !router.isReady} />
          <MediaCard
            images={data?.data?.data?.attributes?.images}
            loading={isLoading || !router.isReady}
            refId={data?.data?.data?.id}
            mutate={mutate}
          />
          <OptionsCard form={form} loading={isLoading || !router.isReady} />
          <VariantsCard form={form} loading={isLoading || !router.isReady} />
        </Col>
      </Form>
    </SinglePageContent>
  );
};

export default NewProduct;
