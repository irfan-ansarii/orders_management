import React, { useEffect } from "react";
import { Card } from "antd";
import { Input, Form, Row, Col, InputNumber, Select, Divider } from "antd";
import numeral from "numeral";
const GeneralCard = ({ loading, form }) => {
  const formOptions = Form.useWatch("options", form) || [];

  useEffect(() => {
    if (!formOptions?.[0]?.name || formOptions[0]?.values?.length === 0) {
      form.setFieldsValue({
        defaultOptions: [{ name: "Title", values: ["Default Title"] }],
        defaultVariants: [
          {
            name: "Default Title",
            option: ["Default Title"],
          },
        ],
      });
    } else {
      form.setFieldsValue({
        defaultOptions: [],
        defaultVariants: [],
      });
    }
  }, [formOptions]);

  return (
    <Card bordered={false} className="mb-6" loading={loading}>
      <Form.Item
        label="Status"
        name="status"
        rules={[{ required: true }]}
        hasFeedback
        initialValue={"active"}
        className="mb-0"
      >
        <Select
          className="w-100"
          size="large"
          options={[
            { label: "Active", value: "active" },
            { label: "Archived", value: "archived" },
          ]}
        ></Select>
      </Form.Item>
      <Divider className="my-6" dashed />
      <Form.Item
        label="Title"
        name="name"
        rules={[{ required: true }]}
        hasFeedback
      >
        <Input size="large"></Input>
      </Form.Item>
      <Form.Item
        label="Description"
        name="description"
        rules={[{ required: true }]}
        hasFeedback
      >
        <Input.TextArea rows={4} />
      </Form.Item>
      <Form.List name="defaultOptions">{(fields) => <div></div>}</Form.List>
      <Form.List name="defaultVariants">
        {(fields) =>
          fields.map(({ name, key, ...rest }) => (
            <Row key={key} gutter={24}>
              <Col span={24} sm={{ span: 12 }}>
                <Form.Item
                  name={[name, "price"]}
                  label="Price"
                  rules={[
                    {
                      required: true,
                      type: "number",
                      message: "Price is required.",
                    },
                  ]}
                >
                  <InputNumber
                    prefix={<span className="input-icon">₹</span>}
                    className="w-100"
                    placeholder="0.00"
                    size="large"
                    formatter={(value, info) => {
                      if (!info.userTyping && value) {
                        return numeral(value).format("0,0.00");
                      }
                    }}
                  />
                </Form.Item>
              </Col>
              <Col span={24} sm={{ span: 12 }}>
                <Form.Item
                  label="Sale Price"
                  name={[name, "salePrice"]}
                  rules={[
                    {
                      required: true,
                      type: "number",
                      message: "Sale price is required.",
                    },
                  ]}
                >
                  <InputNumber
                    prefix={<span className="input-icon">₹</span>}
                    className="w-100"
                    placeholder="0.00"
                    size="large"
                    formatter={(value, info) => {
                      if (!info.userTyping && value) {
                        return numeral(value).format("0,0.00");
                      }
                    }}
                  />
                </Form.Item>
              </Col>
              <Col span={24} sm={{ span: 12 }}>
                <Form.Item
                  label="SKU"
                  name={[name, "sku"]}
                  rules={[
                    {
                      required: true,

                      message: "SKU is required.",
                    },
                  ]}
                >
                  <Input size="large" placeholder="SKU12345" />
                </Form.Item>
              </Col>
              <Col span={24} sm={{ span: 12 }}>
                <Form.Item
                  label="Stock"
                  name={[name, "stock"]}
                  rules={[
                    {
                      required: true,
                      type: "number",
                      message: "Stock is required.",
                    },
                  ]}
                >
                  <InputNumber
                    className="w-100"
                    placeholder="0.00"
                    size="large"
                  />
                </Form.Item>
              </Col>
            </Row>
          ))
        }
      </Form.List>
    </Card>
  );
};

export default GeneralCard;

GeneralCard.defaultProps = {
  loading: false,
};
