import React, { useEffect } from "react";
import { useRouter } from "next/router";
import {
  MdMoreVert,
  MdOutlineSync,
  MdWhatsapp,
  MdEmail,
  MdEdit,
} from "react-icons/md";
import capitalize from "capitalize";
import { useAppSettting } from "../../../../context/useAppSettting";
import { Button, Dropdown, App } from "antd";
import { useSyncCustomer } from "../../../../hooks/data/useCustomerData";

const Actions = ({ customer }) => {
  const { setAction } = useAppSettting();
  const { isMutating, trigger } = useSyncCustomer();
  const router = useRouter();
  const { message } = App.useApp();
  const handleMenuClick = (e) => {
    if (e.key === "1") {
      router.push({
        pathname: `/customers/${customer.id}`,
        query: { modal: "edit" },
      });
    }
    if (e.key === "2") {
      message.open({
        type: "loading",
        key: "loading",
        content: "Syncing has started. Please wait...",
      });
      trigger(
        { customerId: customer.attributes.customerId },
        {
          onSuccess: () => {
            message.destroy("loading");
            message.open({
              type: "success",

              content: "Syncing has been completed successfully.",
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

  const items = [
    {
      key: "1",
      label: "Edit",
      icon: <MdEdit />,
    },
    {
      key: "2",
      label: "Sync",
      icon: <MdOutlineSync />,
      disabled: customer?.attributes?.customerId ? false : true,
    },

    {
      key: "3",
      label: "Email",
      icon: <MdEmail />,
      disabled: true,
    },
    {
      key: "4",
      label: "Message",
      icon: <MdWhatsapp />,
      disabled: true,
    },
  ];

  const SingleAction = (
    <Dropdown
      menu={{
        items,
        onClick: handleMenuClick,
      }}
    >
      <Button
        type="text"
        size="large"
        loading={isMutating}
        icon={<MdMoreVert className="text-lg" />}
        className="btn-action"
      />
    </Dropdown>
  );

  useEffect(() => {
    setAction(SingleAction);
  }, [router.events]);

  return (
    <Dropdown
      menu={{
        items,
        onClick: handleMenuClick,
      }}
    >
      <Button
        type="text"
        size="large"
        loading={isMutating}
        icon={<MdMoreVert className="text-lg" />}
        className="text-button"
      />
    </Dropdown>
  );
};

export default Actions;
