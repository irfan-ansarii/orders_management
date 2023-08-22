import React from "react";
import { Input, Card, Button, Form, Tag, Select, Col } from "antd";
import { RiDeleteBinFill, RiAddFill } from "react-icons/ri";

const OptionsCard = ({ form, loading }) => {
  const handleAddOption = async (callback) => {
    const options = form.getFieldValue("options") || [];

    for (let i = 0; i < options.length; i++) {
      const { name, values } = options[i] || {};

      if (!name) {
        await form.setFields([
          {
            name: ["options", i, "name"],
            errors: ["Option name is required."],
          },
        ]);
        return;
      }

      if (!values || values.length < 1) {
        await form.setFields([
          {
            name: ["options", i, "values"],
            errors: ["Option value is required."],
          },
        ]);
        return;
      }
    }

    callback();
  };

  return (
    <Card bordered={false} className="mb-6" title="Options" loading={loading}>
      <Form.List name="options">
        {(options, { add, remove }) => (
          <>
            {options.map(({ name, key, ...rest }) => (
              <Tag
                gutter={24}
                key={key}
                className="d-flex mb-6 pa-4 mr-0 border-none w-100 gap-4"
              >
                <Col flex={1}>
                  <Form.Item
                    {...rest}
                    name={[name, "name"]}
                    initialValue=""
                    rules={[
                      { required: true, message: "Option name is required." },
                    ]}
                  >
                    <Input placeholder="Option name" size="large" />
                  </Form.Item>

                  <Form.Item
                    name={[name, "values"]}
                    initialValue={[]}
                    rules={[
                      {
                        required: true,
                        message: "Option value is required.",
                      },
                    ]}
                    className="mb-0"
                  >
                    <Select
                      placeholder="Option value"
                      size="large"
                      popupClassName="hidden"
                      showSearch={false}
                      suffixIcon=""
                      mode="tags"
                    />
                  </Form.Item>
                </Col>
                <Button
                  type="text"
                  className="text-button"
                  size="large"
                  icon={<RiDeleteBinFill className="anticon text-md" />}
                  onClick={(e) => remove(name)}
                ></Button>
              </Tag>
            ))}

            <Button
              onClick={() => handleAddOption(add)}
              icon={<RiAddFill />}
              className="w-100 text-button text-xs"
              size="large"
              type="text"
            >
              ADD OPTION
            </Button>
          </>
        )}
      </Form.List>
    </Card>
  );
};

export default OptionsCard;
OptionsCard.defaultProps = {
  loading: false,
};
