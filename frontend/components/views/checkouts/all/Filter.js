import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { Col, Segmented, Button, Dropdown, App } from "antd";
import SearchInput from "../../../global/search/SearchInput";
import useQuery from "../../../../hooks/useQuery";
import { MdOutlineSync, MdSaveAlt, MdMoreVert } from "react-icons/md";
import { useAppSettting } from "../../../../context/useAppSettting";
import FilterBar from "../../../global/filter/FilterBar";
import { getFileURL } from "../../../../utils";
import {
  useExportCheckouts,
  useSyncCheckouts,
} from "../../../../hooks/data/useCheckoutData";
import capitalize from "capitalize";
import { duration } from "moment";

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

const Filter = () => {
  const { value, onChange } = useQuery();
  const { setAction } = useAppSettting();
  const router = useRouter();
  const { message } = App.useApp();

  const exportCheckouts = useExportCheckouts();
  const sync = useSyncCheckouts();

  const handleMenuClick = (e) => {
    message.loading({
      content: "Please wait...",
      key: "loading",
      duration: 0,
    });
    if (e.key === "2") {
      exportCheckouts.trigger(value, {
        onSuccess: (res) => {
          window.open(getFileURL(res.data.fileUrl), "_blank");
          message.destroy("loading");
        },
        onError: (err) => {
          message.destroy("loading");
          const content =
            err?.response?.data?.error?.message ||
            "Unable to connect to the server. Please try again";
          message.success(capitalize(content));
        },
      });
    }
    if (e.key === "1") {
      sync.trigger(
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
        loading={exportCheckouts.isMutating || sync.isMutating}
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
      <Col span={0} lg={{ span: 9 }}>
        <SearchInput />
      </Col>
      <Col span={24} lg={{ span: 10 }}>
        <Segmented
          onChange={(e) => onChange({ key: "recovered", value: e })}
          block
          className="scroll-segmented"
          defaultValue={value.spam}
          size="large"
          options={[
            {
              label: <span className="uppercase text-xs">all</span>,
              value: "",
            },
            {
              label: <span className="uppercase text-xs">recovered</span>,
              value: "true",
            },
            {
              label: (
                <span
                  className="uppercase text-xs"
                  style={{ whiteSpace: "nowrap" }}
                >
                  not recovered
                </span>
              ),
              value: "false",
            },
          ]}
        />
      </Col>
      <Col span={0} lg={{ span: 5 }} className="text-right">
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
            loading={exportCheckouts.isMutating || sync.isMutating}
          />
        </Dropdown>
      </Col>
    </FilterBar>
  );
};

export default Filter;
