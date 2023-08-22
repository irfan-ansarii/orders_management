import React from "react";
import { Drawer, Button, App } from "antd";
import { MdWest, MdOutlineAdd } from "react-icons/md";
import { useCreateUser } from "../../../../hooks/data/useUserData";
import useQuery from "../../../../hooks/useQuery";
import AddUserForm from "./AddUserForm";
import capitalize from "capitalize";
const AddUser = () => {
  const { onChange, value } = useQuery();
  const { message, notification } = App.useApp();

  const { isMutating, trigger } = useCreateUser();

  // handle create user
  const onFinish = (value) => {
    value.username = value.email?.split("@")?.[0];
    trigger(value, {
      onSuccess: (res) => {
        onChange({ key: "modal", value: "" });
        notification.success({
          message: "Congratulations!",
          description: capitalize(
            `${res?.data?.user?.userRole} account has been successfully created.`
          ),
          placement: "bottom",
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
    });
  };

  return (
    <>
      <Button
        type="primary"
        size="large"
        className="px-8"
        icon={<MdOutlineAdd />}
        onClick={() => onChange({ key: "modal", value: "new" })}
      >
        Add
      </Button>

      <Drawer
        title="Add User"
        rootClassName="notification-drawer"
        destroyOnClose={true}
        placement="right"
        onClose={() => onChange({ key: "modal", value: "" })}
        open={value.modal}
        closeIcon={<MdWest className="text-lg" />}
      >
        <AddUserForm
          onFinish={onFinish}
          onChange={onChange}
          isMutating={isMutating}
        />
      </Drawer>
    </>
  );
};

export default AddUser;
