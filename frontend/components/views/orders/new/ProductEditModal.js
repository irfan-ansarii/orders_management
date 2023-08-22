import { useState } from "react";
import { Button, Modal, InputNumber, Form, Tooltip, Typography } from "antd";
import numeral from "numeral";
import { MdModeEdit } from "react-icons/md";

const ProductEditModal = ({ index, form }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const products = form.getFieldValue("lineItems");

  const handleOk = (value) => {
    setIsModalOpen(false);

    products[index] = {
      ...products[index],
      salePrice: value.salePrice,
      quantity: value.quantity,
      discount: value.discount,
      tax: value.tax,
    };
    form.setFieldsValue({ lineItems: [...products] });
  };

  return (
    <>
      <Tooltip title="Edit">
        <Button
          type="text"
          icon={<MdModeEdit className="text-md" />}
          className="text-button"
          onClick={() => {
            setIsModalOpen(true);
          }}
        />
      </Tooltip>
      <Modal
        title="Edit Product"
        focusTriggerAfterClose={false}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        okText="Save"
        okButtonProps={{ size: "large", htmlType: "submit" }}
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
          name="salePrice"
          label="Price"
          className="pt-4"
          initialValue={products[index].salePrice}
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
          name="quantity"
          label="Quantity"
          initialValue={products[index].quantity}
        >
          <InputNumber size="large" className="w-100" placeholder="0" />
        </Form.Item>
        <Form.Item name="tax" label="Tax" initialValue={products[index].tax}>
          <InputNumber
            formatter={(value, info) => {
              if (!info.userTyping && value) {
                return numeral(value).format("0,0.00");
              }
            }}
            size="large"
            prefix={<Typography.Text type="secondary mr-1">₹</Typography.Text>}
            className="w-100"
            placeholder="0.00"
          />
        </Form.Item>
        <Form.Item
          name="discount"
          label="Product Discount"
          initialValue={products[index].discount}
        >
          <InputNumber
            formatter={(value, info) => {
              if (!info.userTyping && value) {
                return numeral(value).format("0,0.00");
              }
            }}
            size="large"
            prefix={<Typography.Text type="secondary mr-1">₹</Typography.Text>}
            className="w-100"
            placeholder="0.00"
          />
        </Form.Item>
      </Modal>
    </>
  );
};
export default ProductEditModal;
