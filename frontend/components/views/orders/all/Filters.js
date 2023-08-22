import React, { useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Row, Col, Segmented, Divider, Button, App, Dropdown } from "antd";
import { BsBoxFill } from "react-icons/bs";
import {
  MdOutlineSync,
  MdOutlineAdd,
  MdInbox,
  MdSync,
  MdCancel,
  MdReplay,
  MdCheckCircle,
  MdSyncAlt,
  MdSaveAlt,
  MdMoreVert,
  MdLocalShipping,
} from "react-icons/md";
import SearchInput from "../../../global/search/SearchInput";
import DateFilter from "../../../global/filter/DateFilter";
import useQuery from "../../../../hooks/useQuery";
import FilterBar from "../../../global/filter/FilterBar";
import {
  useExportOrders,
  useSyncOrders,
} from "../../../../hooks/data/useOrderData";
import capitalize from "capitalize";
import { getFileURL } from "../../../../utils";
import { useAppSettting } from "../../../../context/useAppSettting";

const items = [
  {
    key: "1",
    label: "Sync",
    icon: <MdOutlineSync />,
  },

  {
    key: "2",
    label: "Export",
    icon: <MdSaveAlt />,
  },
];

const Filters = () => {
  const { message } = App.useApp();
  const { value, onChange } = useQuery();
  const router = useRouter();
  const { setAction } = useAppSettting();
  const exportOrders = useExportOrders();
  const syncOrders = useSyncOrders();

  const triggerAction = (action, actionData) => {
    message.loading({ content: "Please wait...", key: "loading", duration: 0 });
    action.trigger(actionData, {
      onSuccess: (res) => {
        message.destroy("loading");
        if (res.data.fileUrl) {
          window.open(getFileURL(res.data.fileUrl));
        } else {
          message.success(capitalize(res?.data?.message));
        }
      },
      onError: (err) => {
	console.log(err)
        message.destroy("loading");
        message.error(
          capitalize(
            err?.response?.data?.error?.message ||
              "Unable to connect to the server. Please try again"
          )
        );
      },
    });
  };

  const handleMenuClick = (e) => {
    if (e.key === "2") {
      triggerAction(exportOrders, value);
    }
    if (e.key === "1") {
      triggerAction(syncOrders, {});
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
      />
    </Dropdown>
  );

  useEffect(() => {
    router.events.on("routeChangeComplete", () => setAction(singleAction));
    return () =>
      router.events.off("routeChangeComplete", () => setAction(null));
  }, [router.events]);

  return (
    <FilterBar>
      <Col span={24}>
        <Segmented
          className="scroll-segmented"
          block
          defaultValue={value.status}
          onChange={(e) => {
            onChange({ key: "status", value: e });
          }}
          options={[
            {
              label: <span className="uppercase text-xs">all</span>,
              value: "",
              icon: <MdInbox className="anticon text-md" />,
            },
            {
              label: <span className="uppercase text-xs">processing</span>,
              value: "processing",
              icon: <MdSync className="anticon text-md" />,
            },
            {
              label: <span className="uppercase text-xs">packed</span>,
              value: "packed",
              icon: <BsBoxFill className="anticon" />,
            },
            {
              label: <span className="uppercase text-xs">shipped</span>,
              value: "shipped",
              icon: <MdLocalShipping className="anticon text-md" />,
            },
            {
              label: <span className="uppercase text-xs">delivered</span>,
              value: "delivered",
              icon: <MdCheckCircle className="anticon text-md" />,
            },
            {
              label: <span className="uppercase text-xs">return</span>,
              value: "return",
              icon: <MdReplay className="anticon text-md" />,
            },
            {
              label: <span className="uppercase text-xs">exchange</span>,
              value: "exchange",
              icon: <MdSyncAlt className="anticon text-md" />,
            },
            {
              label: <span className="uppercase text-xs">cancelled</span>,
              value: "cancelled",
              icon: <MdCancel className="text-md" />,
            },
          ]}
          size="large"
        />
      </Col>
      <Col span={0} lg={{ span: 24 }}>
        <Divider dashed className="my-2" />
      </Col>
      <Col span={0} lg={{ span: 9 }}>
        <SearchInput size="large" />
      </Col>
      <Col span={0} lg={{ span: 9 }}>
        <DateFilter
          size="large"
          placement="bottomRight"
          btnClassName="px-3 text-button w-aut flex-grow-1"
          btnType="text"
        />
      </Col>

      <Col span={0} lg={{ span: 6 }}>
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
              loading={exportOrders.isMutating || syncOrders.isMutating}
              icon={<MdMoreVert className="text-lg" />}
              className="text-button"
            />
          </Dropdown>
          <Link href="/orders/new">
            <Button
              size="large"
              type="primary"
              className="d-inline-flex align-center justify-center px-8"
              block
              icon={<MdOutlineAdd />}
            >
              Add
            </Button>
          </Link>
        </Row>
      </Col>
    </FilterBar>
  );
};

export default Filters;
