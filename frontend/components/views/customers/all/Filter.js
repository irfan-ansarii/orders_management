import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

/** antd component */
import { Col, Button, Row, Dropdown, App } from "antd";

/** app context */
import { useAppSettting } from "../../../../context/useAppSettting";

/** hooks */
import {
  useExportCustomers,
  useSyncCustomers,
} from "../../../../hooks/data/useCustomerData";
import useQuery from "../../../../hooks/useQuery";

/** utils */
import { getFileURL } from "../../../../utils";
import capitalize from "capitalize";

/** components */
import AddCustomer from "../new";
import SearchInput from "../../../global/search/SearchInput";
import FilterBar from "../../../global/filter/FilterBar";
/** icons */
import {
  MdSaveAlt,
  MdOutlineSync,
  MdOutlineAdd,
  MdWhatsapp,
  MdEmail,
  MdMoreVert,
} from "react-icons/md";

const Filter = () => {
  const { message } = App.useApp();
  const [open, setOpen] = useState(false);
  const { value, onChange } = useQuery();
  const { setAction } = useAppSettting();
  const { isMutating, trigger } = useExportCustomers();
  const sync = useSyncCustomers();
  const router = useRouter();

  /** handle action dropdown click */
  const handleMenuClick = (e) => {
    /** export */
    if (e.key === "4") {
      message.open({
        type: "loading",
        content: "Please wait...",
      });
      trigger(value, {
        onSuccess: (res) => {
          window.open(getFileURL(res.data.fileUrl));
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

    /** sync */
    if (e.key === "1") {
      message.open({
        type: "loading",
        content: "Syncing has started. Please wait...",
      });
      sync.trigger(
        {},
        {
          onSuccess: (res) => {
            message.open({
              type: "success",
              content: capitalize(res?.data?.message),
            });
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
        }
      );
    }
  };

  /** dropdown items */
  const items = [
    {
      key: "1",
      label: "Sync",
      icon: <MdOutlineSync />,
    },

    {
      key: "2",
      label: "Email",
      icon: <MdEmail />,
      disabled: true,
    },
    {
      key: "3",
      label: "Message",
      icon: <MdWhatsapp />,
      disabled: true,
    },
    {
      key: "4",
      label: "Export",
      icon: <MdSaveAlt />,
    },
  ];

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
        loading={isMutating || sync.isMutating}
        icon={<MdMoreVert className="text-lg" />}
        className="btn-action"
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
      {/* float button */}
      <Button
        className="btn-float"
        icon={<MdOutlineAdd />}
        onClick={() => setOpen(true)}
      >
        Add
      </Button>

      <FilterBar className="lg-d-none">
        <Col span={0} lg={{ span: 10 }}>
          <SearchInput size="large" />
        </Col>
        <Col span={14}>
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
                loading={isMutating || sync.isMutating}
                icon={<MdMoreVert className="text-lg" />}
                className="text-button"
              />
            </Dropdown>

            <AddCustomer open={open} setOpen={setOpen} />
          </Row>
        </Col>
      </FilterBar>
    </>
  );
};

export default Filter;
