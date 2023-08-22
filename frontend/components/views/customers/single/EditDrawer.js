import React from "react";
import { Drawer, App } from "antd";
import { MdWest } from "react-icons/md";
import useQuery from "../../../../hooks/useQuery";
import EditCustomerForm from "./EditForm";
import { useEditCustomer } from "../../../../hooks/data/useCustomerData";
import capitalize from "capitalize";

const EditDrawer = ({ customer }) => {
  const { onChange, value } = useQuery();
  const { isMutating, trigger } = useEditCustomer();

  const { message } = App.useApp();

  const onFinish = (values) => {
    values.defaultAddresss = values.addresses[0];
    trigger(
      { data: { ...values, id: customer?.id } },
      {
        onSuccess: (res) => {
          onChange({ key: "modal", value: "" });
          message.success(
            capitalize(`Customer details has been successfully updated.`)
          );
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
  };

  return (
    <>
      <Drawer
        title="Edit"
        rootClassName="notification-drawer"
        destroyOnClose={true}
        placement="right"
        onClose={() => {
          onChange({ key: "modal", value: "" });
        }}
        open={value.modal === "edit"}
        closeIcon={<MdWest className="text-lg" />}
      >
        <EditCustomerForm
          onFinish={onFinish}
          customer={customer}
          isMutating={isMutating}
        />
      </Drawer>
    </>
  );
};

export default EditDrawer;
