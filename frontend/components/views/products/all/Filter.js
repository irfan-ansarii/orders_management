import React, { useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Col, Segmented, Button, App, Row, Dropdown } from "antd";
import useQuery from "../../../../hooks/useQuery";
import SearchInput from "../../../global/search/SearchInput";
import FilterBar from "../../../global/filter/FilterBar";
import {
  MdOutlineAdd,
  MdOutlineSync,
  MdSaveAlt,
  MdMoreVert,
} from "react-icons/md";

import { useAppSettting } from "../../../../context/useAppSettting";
import {
  useSyncProducts,
  useExportProducts,
} from "../../../../hooks/data/useProductData";
import { getFileURL } from "../../../../utils";
import capitalize from "capitalize";
const items = [
  {
    key: "sync",
    label: "Sync",
    icon: <MdOutlineSync />,
  },
  {
    key: "export",
    label: "Export",
    icon: <MdSaveAlt />,
  },
  {
    key: "adjustment",
    label: "Stock Adjustment",
    icon: <MdOutlineSync />,
    disabled: true,
  },
];

const Filter = () => {
  const { onChange, value } = useQuery();
  const { setAction } = useAppSettting();
  const router = useRouter();
  const { message } = App.useApp();

  const syncProducts = useSyncProducts();
  const exportProducts = useExportProducts();

  const handleMenuClick = (e) => {
    message.loading({
      key: "loading",
      content: "Please wait...",
      duration: 0,
    });
    if (e.key === "sync") {
      syncProducts.trigger(
        {},
        {
          onSuccess: (res) => {
            message.destroy("loading");
            message.success(capitalize(res?.data?.message));
          },
          onError: (err) => {
            message.destroy("loading");
            const content =
              err?.response?.data?.error?.message ||
              "Unable to connect to the server. Please try again";
            message.error(capitalize(content));
          },
        }
      );
    }

    // export
    if (e.key === "export") {
      message.open({
        type: "loading",
        content: "Please wait...",
      });
      exportProducts.trigger(value, {
        onSuccess: (res) => {
          window.open(getFileURL(res.data.fileUrl), "_blank");
        },
        onError: (err) => {
          const content =
            err?.response?.data?.error?.message ||
            "Unable to connect to the server. Please try again";
          message.open({
            type: "error",
            content: capitalize(content),
          });
        },
      });
    }
  };

  /** action component for small devices */
  const singleAction = (
    <Dropdown
      menu={{
        items,
        onClick: handleMenuClick,
      }}
    >
      <Button
        type="text"
        size="large"
        icon={<MdMoreVert className="text-lg" />}
        className="btn-action"
        loading={syncProducts.isMutating || exportProducts.isMutating}
      />
    </Dropdown>
  );

  useEffect(() => {
    router.events.on("routeChangeComplete", () => setAction(singleAction));
    return () =>
      router.events.off("routeChangeComplete", () => setAction(null));
  }, [router.events]);

  return (
    <>
      <Button
        className="btn-float"
        icon={<MdOutlineAdd />}
        onClick={() => router.push(`/products/new`)}
      >
        Add
      </Button>

      <FilterBar>
        <Col span={0} lg={{ span: 9 }}>
          <SearchInput size="large" />
        </Col>
        <Col span={24} lg={{ span: 10 }}>
          <Segmented
            onChange={(e) => onChange({ key: "stock", value: e })}
            block
            className="scroll-segmented"
            value={value.stock}
            size="large"
            options={[
              {
                label: <span className="uppercase text-xs">all</span>,
                value: "",
              },
              {
                label: <span className="uppercase text-xs">in stock</span>,
                value: "in stock",
              },
              {
                label: (
                  <span
                    className="uppercase text-xs"
                    style={{ whiteSpace: "nowrap" }}
                  >
                    out of stock
                  </span>
                ),
                value: "out of stock",
              },
            ]}
          />
        </Col>

        <Col span={0} lg={{ span: 5 }} className="text-right">
          <Row className="gap-3" justify="end" wrap={false}>
            <Dropdown
              menu={{
                items,
                onClick: handleMenuClick,
              }}
            >
              <Button
                type="text"
                size="large"
                icon={<MdMoreVert className="text-lg" />}
                className="text-button"
                loading={syncProducts.isMutating || exportProducts.isMutating}
              />
            </Dropdown>
            <Link href="/products/new">
              <Button
                block
                size="large"
                type="primary"
                className="px-8"
                icon={<MdOutlineAdd />}
              >
                Add
              </Button>
            </Link>
          </Row>
        </Col>
      </FilterBar>
    </>
  );
};

export default Filter;
