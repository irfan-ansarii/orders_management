import React from "react";
import { Button, App } from "antd";
import { MdDelete } from "react-icons/md";
import { useEditPublic } from "../../../../hooks/data/useSettingData";
import { useSWRConfig } from "swr";
import capitalize from "capitalize";

const DeleteNav = ({ links, index }) => {
  const { message, modal } = App.useApp();
  const { isMutating, trigger } = useEditPublic();
  const { mutate } = useSWRConfig();

  const handleDelete = () => {
    modal.confirm({
      title: "Remove",
      content: "Are you sure you want to remove this link?",
      okText: "Delete",
      cancelText: "Cancel",
      okButtonProps: { danger: true, loading: isMutating },
      onOk() {
        const updatedLinks = [...links];
        updatedLinks.splice(index, 1);
        const data = { links: [...updatedLinks] };
        trigger(
          { data },
          {
            onSuccess: (res) => {
              mutate("/public?populate=*");
              message.success("Link has been successfully removed.");
            },
            onError: (err) => {
              const content =
                err?.response?.data?.error?.message ||
                "Unable to connect to the server. Please try again";
              message.error(capitalize(content));
            },
          }
        );
      },
    });
  };
  return (
    <Button
      type="text"
      icon={<MdDelete />}
      className="text-button"
      onClick={() => handleDelete()}
    />
  );
};

export default DeleteNav;
