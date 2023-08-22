import React, { useState } from "react";
import { Modal, Form, Button, Input, App } from "antd";
import { MdModeEdit } from "react-icons/md";
import { useEditPublic } from "../../../../hooks/data/useSettingData";
import capitalize from "capitalize";
import { useSWRConfig } from "swr";

const EditPlatform = ({ links, index }) => {
  const [open, setOpen] = useState(false);
  const { mutate } = useSWRConfig();
  const { isMutating, trigger } = useEditPublic();
  const { message } = App.useApp();

  const handleOk = (values) => {
    const updatedLinks = [...links];
    updatedLinks[index] = { ...values };
    const data = { links: [...updatedLinks] };
    trigger(
      { data },
      {
        onSuccess: (res) => {
          setOpen(false);
          mutate("/public?populate=*");
          message.success("Link has been successfully saved.");
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
        type="text"
        className="text-button"
        onClick={() => setOpen(true)}
        icon={<MdModeEdit className="anticon" />}
      />

      <Modal
        title="Edit Link"
        focusTriggerAfterClose={false}
        open={open}
        onCancel={() => {
          setOpen(false);
        }}
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
          initialValue={links[index].label}
        >
          <Input size="large" />
        </Form.Item>
        <Form.Item label="Link" name="href" initialValue={links[index].href}>
          <Input size="large" />
        </Form.Item>
      </Modal>
    </>
  );
};

export default EditPlatform;
