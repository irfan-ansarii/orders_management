import React, { useEffect, useLayoutEffect } from "react";
import { useRouter } from "next/router";
import { MdMoreVert, MdEdit, MdSync, MdSaveAlt } from "react-icons/md";
import { useAppSettting } from "../../../../context/useAppSettting";
import { Button, App, Dropdown } from "antd";
import {
  useSyncProduct,
  useExportProduct,
} from "../../../../hooks/data/useProductData";

import { getFileURL } from "../../../../utils";

const Actions = ({ data }) => {
  const router = useRouter();
  const { message } = App.useApp();
  const { setAction } = useAppSettting();
  const syncProduct = useSyncProduct();
  const exportProduct = useExportProduct();

  const triggerAction = (action, actionData, responseMessage) => {
    message.loading({ content: "Please wait...", key: "loading" });

    action.trigger(actionData, {
      onSuccess: (res) => {
        if (res.data.fileUrl) {
          window.open(getFileURL(res.data.fileUrl), "_blank");
          return;
        }

        message.destroy("loading");
        message.success(responseMessage);
      },
      onError: (err) => {
        const content =
          err?.response?.data?.error?.message ||
          "Unable to connect to the server. Please try again";
        message.error(content);
      },
    });
  };

  const handleClick = (e) => {
    if (e.key === "edit") router.push(`${data.id}/edit`);
    if (e.key === "sync") {
      triggerAction(
        syncProduct,
        { productId: data?.attributes?.productId },
        "Syncing has been completed successfully."
      );
    }
    if (e.key === "export") {
      triggerAction(
        exportProduct,
        router.query,
        "Syncing has been completed successfully."
      );
    }
  };

  const items = [
    {
      key: "edit",
      label: "Edit",
      icon: <MdEdit />,
    },
    {
      key: "sync",
      label: "Sync",
      icon: <MdSync />,
      disabled: data?.attributes?.productId ? false : true,
    },
    {
      key: "export",
      label: "Export PDF",
      icon: <MdSaveAlt />,
    },
  ];

  const singleAction = (
    <Dropdown
      menu={{
        items,
        onClick: handleClick,
      }}
    >
      <Button
        type="text"
        size="large"
        icon={<MdMoreVert />}
        className="btn-action"
        loading={syncProduct.isMutating || exportProduct.isMutating}
      />
    </Dropdown>
  );

  useEffect(() => {
    setAction(singleAction);
  }, [router.events]);

  return (
    <Dropdown
      menu={{
        items,
        onClick: handleClick,
      }}
    >
      <Button
        type="text"
        size="large"
        icon={<MdMoreVert className="text-lg" />}
        className="text-button"
        loading={syncProduct.isMutating || exportProduct.isMutating}
      />
    </Dropdown>
  );
};

export default Actions;
