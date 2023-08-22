import React, { Fragment } from 'react'
import { Button, Divider, Form, Input, Row, Col } from 'antd'
import { MdOutlineAdd, MdRemoveCircleOutline } from 'react-icons/md'
import SimpleBar from 'simplebar-react'

const AddCustomerForm = ({ onFinish, isLoading }) => {
  const [form] = Form.useForm()

  const handleAddress = ({ add }) => {
    form.validateFields().then((values) => {
      if (values.addresses?.some((address) => !address.address)) {
        values.addresses.forEach((address, index) => {
          if (!address.address) {
            form.setFields([
              {
                name: ['addresses'],
              },
            ])
          }
        })
      } else {
        add()
      }
    })
  }
  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      requiredMark={false}
      className="d-flex flex-column h-100 py-4 px-6"
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
          name="mobile"
          rules={[
            {
              required: true,
              len: 10,
              pattern: '[0-9]{10}',
              message: 'Please enter Mobile',
            },
          ]}
        >
          <Input placeholder="9898989898" size="large" />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          className="mb-4"
          hasFeedback
          rules={[
            {
              required: true,
              type: 'email',
            },
          ]}
        >
          <Input placeholder="name@mail.com" size="large" />
        </Form.Item>

        {/* Address Field */}
        <Form.List name="addresses">
          {(fields, { add, remove }, { errors }) => (
            <>
              {fields.map(({ key, name, ...restField }, index) => (
                <Fragment key={key}>
                  <Divider className="mb-4" dashed />
                  <Row className="mb-6" align="middle">
                    <Col flex="1 1 auto">Address {index >= 1 && index + 1}</Col>
                    <Button
                      onClick={() => remove(name)}
                      type="text"
                      className="d-inline-flex align-center justify-center"
                      icon={<MdRemoveCircleOutline className="text-lg" />}
                    ></Button>
                  </Row>

                  <Form.Item
                    name={[name, 'address']}
                    hasFeedback
                    rules={[
                      {
                        required: true,
                        message: 'Please enter address',
                      },
                    ]}
                  >
                    <Input placeholder="Address" size="large" />
                  </Form.Item>
                  <Form.Item
                    name={[name, 'apartment']}
                    hasFeedback
                    rules={[
                      {
                        required: true,
                        message: 'Please enter apartment',
                      },
                    ]}
                  >
                    <Input placeholder="Apartment, suite, etc." size="large" />
                  </Form.Item>
                  <Form.Item
                    name={[name, 'city']}
                    hasFeedback
                    rules={[
                      {
                        required: true,
                        message: 'Please enter city',
                      },
                    ]}
                  >
                    <Input placeholder="City" size="large" />
                  </Form.Item>
                  <Form.Item
                    name={[name, 'state']}
                    hasFeedback
                    rules={[
                      {
                        required: true,
                        message: 'Please enter state',
                      },
                    ]}
                  >
                    <Input placeholder="State" size="large" />
                  </Form.Item>
                  <Form.Item
                    name={[name, 'pincode']}
                    hasFeedback
                    rules={[
                      {
                        required: true,
                        pattern: '[0-9]{6}',
                        message: 'Please enter valid 6 digit pincode',
                      },
                    ]}
                  >
                    <Input placeholder="Pincode" size="large" />
                  </Form.Item>
                  <Form.Item
                    name={[name, 'mobile']}
                    hasFeedback
                    rules={[
                      {
                        pattern: '[0-9]{10}',
                        message: 'Please enter valid mobile number',
                      },
                    ]}
                  >
                    <Input placeholder="Mobile" size="large" />
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
        loading={isLoading}
      >
        {isLoading ? 'Saving...' : 'Save'}
      </Button>
    </Form>
  )
}

export default AddCustomerForm
