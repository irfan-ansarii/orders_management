import React from "react";
import { useRouter } from "next/router";
import { Col, Form, Button, Spin, App } from "antd";
import SinglePageContent from "../../components/global/single-page-content/SinglePageContent";
import GeneralCard from "../../components/views/products/new/GeneralCard";
import MediaCard from "../../components/views/products/new/MediaCard";
import OptionsCard from "../../components/views/products/new/OptionsCard";
import VariantsCard from "../../components/views/products/new/VariantsCard";
import Loading from "../../components/global/loader/Loading";
import capitalize from "capitalize";
import { useCreateProduct } from "../../hooks/data/useProductData";

const NewProduct = () => {
  const router = useRouter();
  const { isMutating, trigger } = useCreateProduct();
  const { message } = App.useApp();
  const [form] = Form.useForm();

  const handleSubmit = (values) => {
    const formData = new FormData();

    const { images, options, variations, defaultOptions, defaultVariants } =
      values;

    if (!variations || variations.length === 0) {
      values.variations = defaultVariants;
    }
    if (!options || options.length === 0) {
      values.options = defaultOptions;
    }

    images?.fileList?.forEach((file, i) => {
      if (i == 0) {
        formData.append("files.image", file.originFileObj);
      }
      formData.append("files.images", file.originFileObj);
    });

    formData.append("data", JSON.stringify(values));

    trigger(formData, {
      onSuccess: (res) => {
        const title = res?.data?.data?.attributes?.name;
        message.success(capitalize(`${title} has been successfully saved.`));
        router.replace("/products");
      },

      onError: (err) => {
        const content =
          err?.response?.data?.error?.message ||
          "Unable to connect to the server. Please try again";
        message.open({
          type: "error",
          conetnt: capitalize(content),
        });
      },
    });
  };

  return (
    <Spin spinning={isMutating} indicator={<Loading />}>
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
          save
        </Button>
        <Form
          layout="vertical"
          onFinish={handleSubmit}
          form={form}
          requiredMark={false}
          preserve={false}
          initialValues={{
            defaultOptions: [{ name: "Title", option: ["Default Title"] }],
            defaultVariants: [
              { name: "Default Title", values: ["Default Title"] },
            ],
          }}
        >
          <Col span={24} lg={{ span: 20, push: 2 }} xl={{ span: 16, push: 4 }}>
            <GeneralCard form={form} loading={!router.isReady} />
            <MediaCard images={[]} loading={!router.isReady} />
            <OptionsCard form={form} loading={!router.isReady} />
            <VariantsCard form={form} loading={!router.isReady} />
          </Col>
        </Form>
      </SinglePageContent>
    </Spin>
  );
};

export default NewProduct;
