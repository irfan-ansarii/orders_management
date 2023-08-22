import React, { useEffect } from "react";
import { Card, Form, Input, InputNumber, Row, Col, Tag } from "antd";
import { isEqual } from "lodash";
import numeral from "numeral";
const VariantsCard = ({ form, loading }) => {
  const formOptions = Form.useWatch("options", form) || [];

  const generateCombinations = (arr) => {
    const result = [];
    const generate = (current, index) => {
      if (index === arr.length) {
        const name = current.map((item) => item.value).join(" / ");
        const option = current.map((item) => item.value);

        result.push({
          name,
          option,
        });

        return;
      }

      const currentElement = arr[index];

      if (
        currentElement?.name !== undefined &&
        currentElement?.values !== undefined
      ) {
        const { name, values } = currentElement;
        values.forEach((value) => {
          const combination = [...current, { name, value }];
          generate(combination, index + 1);
        });
      } else {
        generate(current, index + 1);
      }
    };

    generate([], 0);

    return result;
  };

  const handleVariants = async () => {
    const oldVariants = form.getFieldValue("variations") || [];
    const valueFields = ["price", "salePrice", "stock", "sku"];

    const oldValues = valueFields.map((field) =>
      oldVariants.map((variant) => variant[field])
    );

    const hasAllOptions = formOptions.every(
      (item) => item?.name !== "" && item?.values?.length > 0
    );

    if (hasAllOptions) {
      const updatedVariants = generateCombinations(formOptions);
      if (!isEqual(oldVariants, updatedVariants)) {
        const newVariants = updatedVariants.map((variant, index) => {
          const newVariant = { ...variant };
          valueFields.forEach((field, i) => {
            newVariant[field] = oldValues[i][index] || "";
          });
          return newVariant;
        });

        await form.setFieldsValue({ variations: newVariants });
      }
    }
  };

  useEffect(() => {
    handleVariants();
  }, [formOptions]);

  // return of options are not available
  if (!formOptions?.[0]?.name || formOptions[0]?.values?.length === 0) {
    return;
  }

  return (
    <Card
      bordered={false}
      className="mb-6 table-card variant-card"
      title="Variants"
      loading={loading}
    >
      <Form.List name="variations">
        {(fields) =>
          fields.map(({ name, key, ...rest }, index) => (
            <Tag
              key={key}
              className={`w-100 mr-0 border-none px-6 py-2 ${
                index > 0 ? "mt-3" : ""
              }`}
            >
              <Row gutter={12} className="flex-grow-1">
                <Col span={24} sm={{ span: 4 }}>
                  <Form.Item hidden name={[name, "id"]}>
                    <Input disabled />
                  </Form.Item>
                  <Form.Item hidden name={[name, "option"]}>
                    <Input disabled />
                  </Form.Item>
                  <Form.Item
                    className="mb-2"
                    label="variant"
                    name={[name, "name"]}
                  >
                    <Input disabled size="large" />
                  </Form.Item>
                </Col>
                <Col span={12} sm={{ span: 5 }}>
                  <Form.Item
                    className="mb-2"
                    label="price"
                    name={[name, "price"]}
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
                <Col span={12} sm={{ span: 5 }}>
                  <Form.Item
                    className="mb-2"
                    label="sale price"
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
                      className="w-100"
                      prefix={<span className="input-icon">₹</span>}
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
                <Col span={12} sm={{ span: 5 }}>
                  <Form.Item
                    className="mb-2"
                    label="sku"
                    name={[name, "sku"]}
                    rules={[
                      {
                        required: true,
                        message: "SKU is required.",
                      },
                    ]}
                  >
                    <Input placeholder="SKU123456" size="large" />
                  </Form.Item>
                </Col>
                <Col span={12} sm={{ span: 5 }}>
                  <Form.Item
                    className="mb-2"
                    name={[name, "stock"]}
                    label="stock"
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
                      placeholder="0"
                      size="large"
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Tag>
          ))
        }
      </Form.List>
    </Card>
  );
};

export default VariantsCard;
VariantsCard.defaultProps = {
  loading: false,
};
