import React, { Fragment, useEffect } from "react";
import { Button, Divider, Form, Input, Row, Col, Tooltip } from "antd";
import { MdOutlineAdd, MdRemoveCircleOutline } from "react-icons/md";
import SimpleBar from "simplebar-react";

const EditCustomerForm = ({ onFinish, isMutating, customer }) => {
  const [form] = Form.useForm();

  const setValues = () => {
    if (!customer?.attributes) return;
    const name = form.getFieldValue("name");
    if (name) return;

    customer.attributes.addresses = [
      customer.attributes?.defaultAddress,
      ...(customer.attributes.addresses || []),
    ];
    form.setFieldsValue({
      addresses: customer.attributes.addresses,
      name: customer?.attributes?.name,
      phone: customer.attributes.phone,
      email: customer.attributes.email,
    });
  };
  useEffect(() => {
    setValues();
  }, [customer]);

  const handleAddress = ({ add }) => {
    form.validateFields().then((values) => {
      if (values.addresses?.some((address) => !address.address)) {
        values.addresses.forEach((address, index) => {
          if (!address.address) {
            form.setFields([
              {
                name: ["addresses"],
              },
            ]);
          }
        });
      } else {
        add();
      }
    });
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      requiredMark={false}
      className="d-flex flex-column h-100 px-6 py-4"
    >
      <SimpleBar className="flex-fill simple-bar drawer-form">
        <Form.Item
          label="Name"
          className="mb-4"
          hasFeedback
          name="name"
          rules={[
            {
              required: true,
              min: 5,
            },
          ]}
        >
          <Input placeholder="Name" size="large" />
        </Form.Item>
        <Form.Item
          label="Mobile"
          className="mb-4"
          hasFeedback
          name="phone"
          rules={[
            {
              required: true,
              message: "Please enter phone",
            },
          ]}
        >
          <Input placeholder="+91 98989 89898" size="large" />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          className="mb-4"
          hasFeedback
          rules={[
            {
              required: true,
              type: "email",
            },
          ]}
        >
          <Input placeholder="example@domain.com" size="large" />
        </Form.Item>

        {/* Address Field */}
        <Form.List
          name="addresses"
          initialValue={customer?.attributes?.addresses}
        >
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }, index) => (
                <Fragment key={key}>
                  <Divider className="mb-4" dashed />
                  <Row className="mb-6" align="middle">
                    <Col flex="1 1 auto">Address {index >= 1 && index + 1}</Col>
                    <Tooltip title="Remove">
                      <Button
                        onClick={() => remove(name)}
                        type="text"
                        className="d-inline-flex align-center justify-center"
                        icon={<MdRemoveCircleOutline className="text-lg" />}
                      ></Button>
                    </Tooltip>
                  </Row>

                  <Form.Item
                    name={[name, "name"]}
                    hasFeedback
                    rules={[
                      {
                        required: true,
                        message: "Please enter name",
                      },
                    ]}
                  >
                    <Input placeholder="Name" size="large" />
                  </Form.Item>
                  <Form.Item
                    name={[name, "address1"]}
                    hasFeedback
                    rules={[
                      {
                        required: true,
                        message: "Please enter address",
                      },
                    ]}
                  >
                    <Input placeholder="Address" size="large" />
                  </Form.Item>
                  <Form.Item
                    name={[name, "address2"]}
                    hasFeedback
                    rules={[
                      {
                        required: true,
                        message: "Please enter apartment",
                      },
                    ]}
                  >
                    <Input placeholder="Apartment, suite, etc." size="large" />
                  </Form.Item>
                  <Form.Item
                    name={[name, "city"]}
                    hasFeedback
                    rules={[
                      {
                        required: true,
                        message: "Please enter city",
                      },
                    ]}
                  >
                    <Input placeholder="City" size="large" />
                  </Form.Item>
                  <Form.Item
                    name={[name, "province"]}
                    hasFeedback
                    rules={[
                      {
                        required: true,
                        message: "Please enter state",
                      },
                    ]}
                  >
                    <Input placeholder="State" size="large" />
                  </Form.Item>
                  <Form.Item
                    name={[name, "zip"]}
                    hasFeedback
                    rules={[
                      {
                        required: true,

                        message: "Please enter valid 6 digit pincode",
                      },
                    ]}
                  >
                    <Input placeholder="Pincode" size="large" />
                  </Form.Item>
                  <Form.Item
                    name={[name, "phone"]}
                    hasFeedback
                    rules={[
                      {
                        message: "Please enter valid phone number",
                      },
                    ]}
                  >
                    <Input placeholder="phone" size="large" />
                  </Form.Item>
                </Fragment>
              ))}
              <Button
                block
                className="d-flex align-center justify-center"
                type="link"
                size="large"
                icon={<MdOutlineAdd className="text-lg mr-2" />}
                onClick={() => handleAddress({ add })}
              >
                Add Address
              </Button>
            </>
          )}
        </Form.List>
      </SimpleBar>

      <Button
        block
        className="mt-4"
        size="large"
        type="primary"
        htmlType="submit"
        loading={isMutating}
      >
        {isMutating ? "Saving..." : "Save"}
      </Button>
    </Form>
  );
};

export default EditCustomerForm;
