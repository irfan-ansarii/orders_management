import React, { useState } from "react";
import { Modal, Form, Button, Upload, Input, App, Select } from "antd";
import { BsPlusLg } from "react-icons/bs";
import { useCreatePlatform } from "../../../../hooks/data/useSettingData";
import capitalize from "capitalize";
import { useSWRConfig } from "swr";
const NewPlatform = ({ platforms }) => {
  const [form] = Form.useForm();
  const channel = Form.useWatch("name", form);

  const [logo, setLogo] = useState();
  const [open, setOpen] = useState();
  const { mutate } = useSWRConfig();
  const { notification, message } = App.useApp();
  const { isMutating, trigger } = useCreatePlatform();

  const handleOk = (values) => {
    const form = new FormData();
    form.append("files.logo", values?.logo?.file?.originFileObj);
    delete values.logo;
    form.append("data", JSON.stringify(values));
    trigger(form, {
      onSuccess: (res) => {
        setOpen(false);
        mutate("/platforms?populate=*");
        notification.success({
          message: capitalize(`Platform has been successfully saved.`),
          placement: "top",
        });
      },
      onError: (err) => {
        const content =
          err?.response?.data?.error?.message ||
          "Unable to connect to the server. Please try again";
        message.error(capitalize(content));
      },
    });
  };

  const isDisabled = (name) => {
    const index = platforms?.findIndex(
      (p) => p.attributes.name.toLowerCase() === name.toLowerCase()
    );
    // return index == -1 ? false : true;
    return false;
  };
  return (
    <>
      <Button
        block
        type="dashed"
        size="large"
        icon={<BsPlusLg className="anticon" />}
        className="mt-10"
        onClick={() => setOpen(true)}
      >
        Add New
      </Button>
      <Modal
        title="Add Platform"
        focusTriggerAfterClose={false}
        open={open}
        onCancel={() => setOpen(false)}
        okText="Save"
        okButtonProps={{
          size: "large",
          htmlType: "submit",
          loading: isMutating,
        }}
        cancelButtonProps={{ size: "large" }}
        destroyOnClose={true}
        modalRender={(children) => (
          <Form
            form={form}
            layout="vertical"
            onFinish={handleOk}
            requiredMark={false}
            preserve={false}
          >
            {children}
          </Form>
        )}
      >
        <Form.Item name="logo" className="mb-3 pt-6">
          <Upload
            listType="picture-card"
            fileList={logo}
            onChange={async ({ file }) => {
              setLogo([file]);
            }}
            showUploadList={{
              showPreviewIcon: false,
              showRemoveIcon: false,
            }}
          >
            <div>
              <BsPlusLg />
              <div>{logo?.length ? "Change" : "Upload"}</div>
            </div>
          </Upload>
        </Form.Item>
        <Form.Item
          label="Name"
          name="name"
          className={channel !== "website" ? "mb-14" : ""}
          rules={[{ required: true, message: "Platfrom name is required" }]}
        >
          <Select
            size="large"
            placeholder="Select"
            options={[
              {
                value: "website",
                label: "Website",
                disabled: isDisabled("website"),
              },
              {
                value: "nykaa",
                label: "Nykaa",
                disabled: isDisabled("nykaa"),
              },
              {
                value: "offline",
                label: "Offline",
                disabled: isDisabled("nykaa"),
              },
            ]}
          />
        </Form.Item>
        {channel === "website" && (
          <>
            <Form.Item
              label="Store URL"
              name="url"
              rules={[{ required: true, message: "Store URL is required" }]}
            >
              <Input size="large" />
            </Form.Item>
            <Form.Item
              label="Accesss Token"
              name="apiKey"
              rules={[{ required: true, message: "Access token is required" }]}
              className="mb-10"
            >
              <Input size="large" />
            </Form.Item>
          </>
        )}
      </Modal>
    </>
  );
};

export default NewPlatform;
