import { useState } from "react";
import { Modal, Input, InputNumber, Tag, Form, Typography } from "antd";
import { MdAdd } from "react-icons/md";
import numeral from "numeral";
const EditMetaModal = ({ form }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = (values) => {
    const formData = {
      discountTotal: values.discount,
      shippingTotal: values.shipping,
      outstandingTotal: values.outstanding,
      note: values.note,
    };
    form.setFieldsValue(formData);

    setIsModalOpen(false);
  };
  return (
    <>
      <Tag
        onClick={() => {
          setIsModalOpen(true);
        }}
        className="mr-0 border-none pointer px-4 py-1 d-inline-flex align-center"
        color="pink"
      >
        <MdAdd className="text-md mr-1" />
        Add shipping charge, discount and note
      </Tag>
      <Modal
        title="Add Charges"
        open={isModalOpen}
        closable={false}
        onCancel={() => setIsModalOpen(false)}
        okText="Save"
        okButtonProps={{ size: "large", htmlType: "submit" }}
        cancelButtonProps={{ size: "large" }}
        focusTriggerAfterClose={false}
        destroyOnClose={true}
        modalRender={(children) => (
          <Form
            layout="vertical"
            onFinish={handleSubmit}
            requiredMark={false}
            preserve={false}
          >
            {children}
          </Form>
        )}
      >
        <Form.Item
          name="discount"
          label="Discount"
          className="pt-4"
          initialValue={form.getFieldValue("discountTotal")}
        >
          <InputNumber
            size="large"
            formatter={(value, info) => {
              if (!info.userTyping && value) {
                return numeral(value).format("0,0.00");
              }
            }}
            className="w-100"
            prefix={<Typography.Text type="secondary mr-1">₹</Typography.Text>}
            placeholder="0.00"
          />
        </Form.Item>
        <Form.Item
          name="shipping"
          label="Shipping Charges"
          initialValue={form.getFieldValue("shippingTotal")}
        >
          <InputNumber
            size="large"
            formatter={(value, info) => {
              if (!info.userTyping && value) {
                return numeral(value).format("0,0.00");
              }
            }}
            className="w-100"
            prefix={<Typography.Text type="secondary mr-1">₹</Typography.Text>}
            placeholder="0.00"
          />
        </Form.Item>

        <Form.Item
          name="outstanding"
          label="Due"
          initialValue={form.getFieldValue("outstandingTotal")}
        >
          <InputNumber
            size="large"
            formatter={(value, info) => {
              if (!info.userTyping && value) {
                return numeral(value).format("0,0.00");
              }
            }}
            className="w-100"
            prefix={<Typography.Text type="secondary mr-1">₹</Typography.Text>}
            placeholder="0.00"
          />
        </Form.Item>

        <Form.Item
          name="note"
          label="Note"
          initialValue={form.getFieldValue("note")}
        >
          <Input.TextArea rows={3} />
        </Form.Item>
      </Modal>
    </>
  );
};
export default EditMetaModal;
