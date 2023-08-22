import React, { useState } from "react";
import { Modal, Form, Button, Input, App } from "antd";
import { BsPlusLg } from "react-icons/bs";
import { useEditPublic } from "../../../../hooks/data/useSettingData";
import capitalize from "capitalize";
import { useSWRConfig } from "swr";
const NewNav = ({ links }) => {
  const [open, setOpen] = useState();
  const { mutate } = useSWRConfig();
  const { message } = App.useApp();
  const { isMutating, trigger } = useEditPublic();

  const handleOk = (values) => {
    const data = { links: [...links, { ...values }] };

    trigger(
      { data },
      {
        onSuccess: (res) => {
          setOpen(false);
          mutate("/public?populate=*");
          message.success(`Navigation has been successfully saved.`);
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
        title="New Link"
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
            layout="vertical"
            onFinish={handleOk}
            requiredMark={false}
            preserve={false}
          >
            {children}
          </Form>
        )}
      >
        <Form.Item
          label="Label"
          name="label"
          className="pt-6"
          rules={[{ required: true, type: "string" }]}
        >
          <Input size="large" />
        </Form.Item>
        <Form.Item
          label="Link"
          name="href"
          rules={[{ required: true, type: "url" }]}
        >
          <Input size="large" />
        </Form.Item>
      </Modal>
    </>
  );
};

export default NewNav;
