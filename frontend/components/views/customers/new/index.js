import React from "react";
import { Button, App, Drawer } from "antd";
import { MdWest, MdOutlineAdd } from "react-icons/md";

import AddCustomerForm from "./AddCustomerForm";
import capitalize from "capitalize";
import { useCreateCustomer } from "../../../../hooks/data/useCustomerData";

const AddCustomer = ({ open, setOpen }) => {
  const { message, notification } = App.useApp();

  const { isMutating, trigger } = useCreateCustomer();

  // handle create customer
  const onFinish = (value) => {
    trigger(
      { data: value },
      {
        onSuccess: (res) => {
          setOpen(false);
          notification.success({
            message: "Customer Created",
            description: capitalize(
              `New customer has been successfully created.`
            ),
            placement: "top",
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
  };

  return (
    <>
      <Button
        type="primary"
        size="large"
        className="d-inline-flex align-center justify-center px-8"
        icon={<MdOutlineAdd className="mr-2 text-lg" />}
        onClick={() => setOpen(true)}
      >
        Add
      </Button>

      <Drawer
        title="Add Customer"
        rootClassName="notification-drawer"
        placement="right"
        onClose={() => setOpen(false)}
        open={open}
        closeIcon={<MdWest className="text-lg" />}
      >
        <AddCustomerForm onFinish={onFinish} isLoading={isMutating} />
      </Drawer>
    </>
  );
};

export default AddCustomer;
