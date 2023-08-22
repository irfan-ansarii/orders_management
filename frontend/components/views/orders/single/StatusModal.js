import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Select, App } from "antd";
import { useRouter } from "next/router";
import {
  NEW_EDIT_STATUS,
  RETURN_EDIT_STATUS,
} from "../../../../utils/_ORDER_ACTIONS";
import capitalize from "capitalize";
import {
  useCreateStatus,
  useOrderData,
} from "../../../../hooks/data/useOrderData";
import { getAppConfig } from "../../../../utils";

const StatusModal = ({ open, setOpen, order }) => {
  const router = useRouter();
  const [options, setOptions] = useState([]);
  const [form] = Form.useForm();
  const { message } = App.useApp();
  const { trigger, isMutating } = useCreateStatus();
  const { mutate } = useOrderData({ id: order?.id });
  const { appTitle } = getAppConfig();
  // handle form submit
  const onSubmit = (values) => {
    const data = {
      ...values,
      trackingNumber: values.trackingNumber?.toString(),
      order: order.id || router.query.id,
      happenedAt: new Date(),
    };

    trigger(
      { data },
      {
        onSuccess: () => {
          mutate();
          message.success("Order status has been updated successfully.");
          setOpen(false);
        },
        onError: (err) => {
          const content =
            err?.response?.data?.error?.message ||
            "Unable to connect to the server. Please try again.";
          message.error(capitalize(content));
          setOpen(false);
        },
      }
    );
  };

  // validate form fields
  const validateDependentItem = async (_, value) => {
    const status = form.getFieldValue("name");

    if (status === "packed" || status === "confirmed") return true;
    if (!value) {
      throw new Error("This field is required.");
    }
  };

  // disable  status option
  const getUpdateStatusOptions = (type, status) => {
    if (!type) return [];
    let options =
      type === "return" ? [...RETURN_EDIT_STATUS] : [...NEW_EDIT_STATUS];

    const activeIndex = options.findIndex((option) => option.value === status);

    const updatedOptions = options.map((option, index) => {
      if (index <= activeIndex) {
        return { ...option, disabled: true };
      }
      return option;
    });

    // disable delivered option
    const deliveredConditions = ["rto_initiated", "rto_in_transit"];
    if (deliveredConditions.includes(status)) {
      updatedOptions[8] = { ...updatedOptions[8], disabled: true };
    }
    // return updated options
    return updatedOptions;
  };

  useEffect(() => {
    const type = order?.attributes?.type;
    const currentStatus =
      order?.attributes?.currentStatus?.data?.attributes?.name;
    const updatedOptions = getUpdateStatusOptions(type, currentStatus);
    setOptions(updatedOptions);
  }, [order]);

  return (
    <Modal
      title="Update Status"
      open={open}
      closable={false}
      onCancel={() => setOpen(false)}
      okText="Save"
      okButtonProps={{ size: "large", htmlType: "submit", loading: isMutating }}
      cancelButtonProps={{ size: "large" }}
      focusTriggerAfterClose={false}
      destroyOnClose={true}
      modalRender={(children) => (
        <Form
          layout="vertical"
          requiredMark={false}
          preserve={false}
          onFinish={onSubmit}
          form={form}
        >
          {children}
        </Form>
      )}
    >
      <Form.Item name="name" label="Status" className="pt-4">
        <Select options={options} size="large" />
      </Form.Item>
      <Form.Item
        name="company"
        label="Courier Company"
        rules={[{ validator: validateDependentItem }]}
        initialValue={
          order?.attributes?.currentStatus?.data?.attributes?.company ||
          appTitle
        }
      >
        <Input size="large" />
      </Form.Item>
      <Form.Item
        name="fulfillmentId"
        hidden
        initialValue={
          order?.attributes?.currentStatus?.data?.attributes?.fulfillmentId
        }
      >
        <Input size="large" />
      </Form.Item>
      <Form.Item
        name="rider"
        hidden
        initialValue={
          order?.attributes?.currentStatus?.data?.attributes?.rider?.data?.id
        }
      >
        <Input size="large" />
      </Form.Item>
      <Form.Item
        name="trackingNumber"
        label="AWB"
        rules={[{ validator: validateDependentItem }]}
        initialValue={
          order?.attributes?.currentStatus?.data?.attributes?.trackingNumber ||
          order?.id
        }
      >
        <Input size="large" />
      </Form.Item>
      <Form.Item
        name="note"
        label="Note"
        initialValue={order?.attributes?.currentStatus?.data?.attributes?.note}
      >
        <Input.TextArea rows={3} />
      </Form.Item>
    </Modal>
  );
};

export default StatusModal;
StatusModal.defaultProps = {
  order: {},
  open: false,
  setOpen: () => {},
};
