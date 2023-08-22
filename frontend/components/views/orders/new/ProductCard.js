import React, { useState, useEffect, useMemo } from "react";
import {
  AutoComplete,
  Card,
  Input,
  Typography,
  List,
  Avatar,
  Row,
  Col,
  Divider,
  Tag,
  Empty,
  Form,
  Button,
  Tooltip,
  Space,
} from "antd";
import { useRouter } from "next/router";
import { MdSearch, MdAdd, MdDelete } from "react-icons/md";
import { RiImageFill } from "react-icons/ri";
import ProductEditModal from "./ProductEditModal";
import EditMetaModal from "./EditMetaModal";
import Loading from "../../../global/loader/Loading";
import { useVarientsData } from "../../../../hooks/data/useProductData";
import { useDebounce } from "use-debounce";
import { getMediaURL } from "../../../../utils";
import numeral from "numeral";

const ProductCard = ({ form }) => {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [debouncedValue] = useDebounce(query, 1000);
  const lineItems = Form.useWatch("lineItems", form) || [];

  const { isLoading, data } = useVarientsData({
    search: debouncedValue,
  });

  // handle product selection
  const handleSelect = (value, option) => {
    const tempLineItems = lineItems || [];

    const productIndex = tempLineItems?.findIndex(
      (item) => item.variant === option.variant
    );
    if (Array.isArray(tempLineItems) && productIndex !== -1) {
      tempLineItems[productIndex].quantity =
        tempLineItems[productIndex].quantity + 1;
      form.setFieldsValue({ lineItems: [...tempLineItems] });
      setQuery("");
      return;
    }

    const {
      product,
      variant,
      sku,
      price,
      salePrice,
      quantity,
      discount,
      name,
      variantName,
      image,
    } = option;

    const updatedProducts = [
      ...tempLineItems,
      {
        product,
        variant,
        sku,
        price,
        salePrice,
        quantity,
        discount,
        name,
        variantName,
        image,
      },
    ];

    form.setFieldsValue({ lineItems: updatedProducts });
    setQuery("");
  };

  // handle delete
  const handleDelete = (index) => {
    lineItems.splice(index, 1);
    form.setFieldsValue({ lineItems: [...lineItems] });
  };

  // ssuggestions
  const suggestions = useMemo(
    () =>
      data?.data?.data?.map((item) => ({
        value: item.id,
        label: (
          <Row className="py-1">
            <Avatar
              size={60}
              shape="square"
              className="d-flex align-center justify-center"
              src={getMediaURL(
                item?.attributes?.product?.data?.attributes?.image?.data
                  ?.attributes?.formats?.thumbnail?.url
              )}
              icon={<RiImageFill />}
            />

            <div className="ml-4">
              <div className="mb-1">
                {item?.attributes?.product?.data?.attributes?.name}
                {" - "}
                {item?.attributes?.name}
              </div>
              <Typography.Text
                className="d-block align-center text-xs uppercase"
                type="secondary"
              >
                SKU: {item?.attributes?.sku}
                <div className="text-xs">
                  {item?.attributes?.price > item?.attributes?.salePrice && (
                    <Typography.Text className="mr-2" type="secondary" delete>
                      {numeral(item?.attributes?.price).format("0,0.00")}
                    </Typography.Text>
                  )}
                  <Typography.Text>
                    {numeral(item?.attributes?.salePrice).format("0,0.00")}
                  </Typography.Text>
                  <span className="ml-4">
                    Stock: {item?.attributes?.stock || 0}
                  </span>
                </div>
              </Typography.Text>
            </div>
          </Row>
        ),
        variant: item?.id,
        product: item?.attributes?.product?.data?.id,
        sku: item?.attributes?.sku,
        name: item?.attributes?.product?.data?.attributes?.name,
        variantName: item?.attributes?.name,
        price: item?.attributes?.price,
        salePrice: item?.attributes?.salePrice,
        discount: 0,
        quantity: 1,
        tax: 0,
        image:
          item?.attributes?.product?.data?.attributes?.image?.data?.attributes
            ?.formats?.thumbnail?.url,
      })),
    [data]
  );

  useEffect(() => {
    const shippingTotal = form.getFieldValue("shippingTotal");

    const { subtotal, taxTotal, discountTotal } = lineItems?.reduce(
      (acc, item) => {
        return {
          subtotal: acc.subtotal + item.salePrice * item.quantity,
          taxTotal: acc.taxTotal + (Number(item.tax) || 0),
          discountTotal: acc.discountTotal + (Number(item.discount) || 0),
        };
      },
      { subtotal: 0, taxTotal: 0, discountTotal: 0 }
    );

    const formData = {
      subtotal,
      taxTotal,
      discountTotal,
      total: subtotal - discountTotal + shippingTotal,
    };

    form.setFieldsValue(formData);
  }, [lineItems]);

  return (
    <Card title="Products" className="mb-6 table-card" bordered={false}>
      <div className="px-6 pt-6">
        <AutoComplete
          className="w-100"
          value={query}
          options={
            isLoading
              ? [
                  {
                    value: "loading",
                    label: (
                      <div className="py-12">
                        <Loading />
                      </div>
                    ),
                    disabled: true,
                  },
                ]
              : suggestions
          }
          onChange={(e) => {
            setQuery(e);
          }}
          notFoundContent={<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
          onSelect={handleSelect}
        >
          <Input.Search
            prefix={<MdSearch className="input-icon text-lg" />}
            size="large"
            allowClear
            placeholder="Scan || Search..."
            enterButton={<MdAdd className="anticon text-lg" />}
            onSearch={(v, e) =>
              e.type === "click" && router.push("/products/new")
            }
          />
        </AutoComplete>
        <Form.Item shouldUpdate className="ma-0">
          {(!lineItems || lineItems.length === 0) && (
            <div style={{ color: "#d32029" }}>Product is required.</div>
          )}
        </Form.Item>
      </div>
      <List
        className="px-6 pb-4"
        dataSource={lineItems || []}
        renderItem={(item, index) => (
          <List.Item className="py-2 align-end">
            <List.Item.Meta
              avatar={
                <Avatar
                  size={68}
                  className="d-flex align-center justify-center"
                  shape="square"
                  src={getMediaURL(item.image)}
                  icon={<RiImageFill />}
                />
              }
              title={item.name}
              description={
                <div className="text-xs">
                  <Tag className="border-none  px-2">{item.variantName}</Tag>
                  <Space className="w-100">
                    {/* original price */}
                    {item.price > item.salePrice && (
                      <Typography.Text
                        type="secondary"
                        className="text-xs"
                        delete
                      >
                        {numeral(item.price).format("0.00")}
                      </Typography.Text>
                    )}
                    {/* sale prices */}
                    <Typography.Text type="secondary" className="text-xs">
                      {numeral(item.salePrice).format("0.00")}
                    </Typography.Text>

                    {/* quantity */}
                    <Typography.Text type="secondary" className="text-xs">
                      <span className="mr-1">x</span>
                      {item.quantity}
                    </Typography.Text>

                    {/* discount */}
                    {item.discount > 0 && (
                      <Typography.Text type="secondary" className="text-xs">
                        <span className="mr-1">-</span>
                        {numeral(item.discount).format("0,0.00")}
                      </Typography.Text>
                    )}
                  </Space>
                </div>
              }
            />

            <div className="text-right">
              <Typography.Text
                type="secondary"
                className="text-xs d-block uppercase font-medium mb-4"
              >
                Total
              </Typography.Text>

              <Typography.Text className="d-block mb-1">
                {numeral(item.salePrice * item.quantity - item.discount).format(
                  "0,0.00"
                )}
              </Typography.Text>
            </div>
            <div className="ml-2">
              <ProductEditModal index={index} form={form} />

              <div className="mt-1">
                <Tooltip title="Remove">
                  <Button
                    onClick={() => handleDelete(index)}
                    type="text"
                    className="text-button"
                    icon={<MdDelete className="text-md" />}
                  />
                </Tooltip>
              </div>
            </div>
          </List.Item>
        )}
      />
      <Row gutter={12} className="px-6">
        <Divider className="mt-1" />
        <Col span={24} className="mb-6">
          <span>Notes</span>
          <Form.Item name="note" className="ma-0">
            <Typography.Text className="d-block" type="secondary">
              {Form.useWatch("note")}
            </Typography.Text>
          </Form.Item>
          <div className="mt-6">
            <EditMetaModal form={form} />
          </div>
        </Col>
        <Col span={24} className="mb-6">
          {/*  */}

          <Tag className="mr-0 d-block border-none px-4 py-3">
            <Row justify="space-between" align="middle">
              <span>Subtotal</span>
              <Form.Item name="subtotal" className="ma-0">
                {numeral(Form.useWatch("subtotal") || 0).format("0,0.00")}
              </Form.Item>
            </Row>
            <Divider dashed className="my-1" />
            <Row justify="space-between" align="middle">
              <span>Discount</span>
              <Form.Item name="discountTotal" className="ma-0">
                {numeral(Form.useWatch("discountTotal") || 0).format("0,0.00")}
              </Form.Item>
            </Row>

            <Divider dashed className="my-1" />

            <Row justify="space-between" align="middle">
              <span>Tax</span>
              <Form.Item name="taxTotal" className="ma-0">
                {numeral(Form.useWatch("taxTotal") || 0).format("0,0.00")}
              </Form.Item>
            </Row>
            <Divider dashed className="my-1" />

            <Row justify="space-between" align="middle">
              <span>Shipping</span>
              <Form.Item name="shippingTotal" className="ma-0">
                {numeral(Form.useWatch("shippingTotal") || 0).format("0,0.00")}
              </Form.Item>
            </Row>
            <Divider dashed className="my-1" />
            <Row justify="space-between" align="middle">
              <span>Total</span>
              <Form.Item name="total" className="ma-0">
                {numeral(Form.useWatch("total") || 0).format("0,0.00")}
              </Form.Item>
            </Row>
          </Tag>
        </Col>
      </Row>
      <div className="d-none">
        <Form.List name="lineItems" shouldUpdate rules={[{ required: true }]}>
          {(fields) => <div></div>}
        </Form.List>
      </div>
    </Card>
  );
};

export default ProductCard;
