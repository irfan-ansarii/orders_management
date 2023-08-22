import React, { useMemo } from "react";
import { useRouter } from "next/router";
import { List, Avatar, Typography } from "antd";
import Loading from "../../../../global/loader/Loading";
import { useProductsData } from "../../../../../hooks/data/useProductData";
import { useOrdersData } from "../../../../../hooks/data/useOrderData";
import { useCustomersData } from "../../../../../hooks/data/useCustomerData";

const SearchResults = ({ searchTerm }) => {
  const router = useRouter();
  const products = useProductsData({ search: searchTerm });
  const orders = useOrdersData({ search: searchTerm });
  const customers = useCustomersData({ search: searchTerm });

  const results = useMemo(() => {
    // loop throught each items
    if (products.isLoading || orders.isLoading || customers.isLoading) {
      return [];
    }

    if (!searchTerm) return [];

    const tempP = products?.data?.data?.data?.map(({ id, attributes }) => ({
      id,
      name: attributes.name,
      href: `/products/${id}`,
    }));
    const tempO = orders?.data?.data?.data?.map(({ id, attributes }) => ({
      id,
      name: attributes.name,
      description: `${attributes.shippingAddress?.phone} ${attributes.customer?.data?.attributes?.email}`,
      href: `/orders/${id}`,
    }));
    const tempC = customers?.data?.data?.data?.map(({ id, attributes }) => ({
      id,
      name: attributes.name,
      description: `${attributes.phone} ${attributes.email}`,
      href: `/customers/${id}`,
    }));

    const temp = [...tempP, ...tempO, ...tempC];

    return temp.filter(
      (item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, orders, customers]);

  return (
    <div style={{ minHeight: "400px", overflow: "auto" }}>
      {/* loading indicator */}
      {(products.isLoading || orders.isLoading || customers.isLoading) && (
        <div style={{ height: "400px" }}>
          <Loading />
        </div>
      )}

      {/* result */}
      {results.length > 0 && (
        <List
          itemLayout="horizontal"
          loading={
            products.isLoading || orders.isLoading || customers.isLoading
          }
          dataSource={results}
          renderItem={(item, index) => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar>{item.id}</Avatar>}
                title={
                  <div
                    onClick={(e) => {
                      router.push(item.href);
                    }}
                  >
                    {item.name}
                  </div>
                }
                description={
                  <Typography.Text ellipsis type="secondary">
                    {item.description}
                  </Typography.Text>
                }
              />
            </List.Item>
          )}
        />
      )}
    </div>
  );
};

export default SearchResults;
