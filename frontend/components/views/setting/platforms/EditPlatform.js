import React, { useState } from "react";
import { Modal, Form, Button, Input, App, Tooltip, Radio } from "antd";
import { MdModeEdit } from "react-icons/md";
import { useEditPlatform } from "../../../../hooks/data/useSettingData";
import capitalize from "capitalize";
import { useSWRConfig } from "swr";

const EditPlatform = ({ platform }) => {
  const [open, setOpen] = useState(false);
  const { mutate } = useSWRConfig();

  const { message } = App.useApp();
  const { isMutating, trigger } = useEditPlatform();

  const handleOk = (values) => {
    const form = new FormData();

    values.id = platform.id;
    form.append("data", JSON.stringify(values));

    trigger(form, {
      onSuccess: (res) => {
        setOpen(false);
        mutate("/platforms?populate=*");
        message.success(`Platform has been successfully saved.`);
      },
      onError: (err) => {
        const content =
          err?.response?.data?.error?.message ||
          "Unable to connect to the server. Please try again";
        message.error(capitalize(content));
      },
    });
  };

  return (
    <>
      <Tooltip title="Edit">
        <Button
          type="text"
          onClick={() => setOpen(true)}
          className="text-button"
          icon={<MdModeEdit className="anticon" />}
        />
      </Tooltip>

      <Modal
        title="Edit Platform"
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
          label="Name"
          name="name"
          className="pt-6"
          initialValue={platform.attributes.name}
        >
          <Input size="large" />
        </Form.Item>
        <Form.Item
          label="URL"
          name="url"
          initialValue={platform.attributes.url}
        >
          <Input size="large" />
        </Form.Item>
        <Form.Item
          label="API KEY"
          name="apiKey"
          initialValue={platform.attributes.apiKey}
        >
          <Input.Password
            size="large"
            placeholder="••••••••••••••••••••••••••••••••••••••••"
          />
        </Form.Item>
        <Form.Item
          label="Status"
          name="active"
          initialValue={platform.attributes.active || false}
        >
          <Radio.Group size="large">
            <Radio.Button value={true}>Active</Radio.Button>
            <Radio.Button value={false}>Inactive</Radio.Button>
          </Radio.Group>
        </Form.Item>
      </Modal>
    </>
  );
};

export default EditPlatform;
