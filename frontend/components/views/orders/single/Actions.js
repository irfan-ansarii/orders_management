import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Dropdown, Button, App, Modal } from "antd";
import { MdMoreVert } from "react-icons/md";
import { useAppSettting } from "../../../../context/useAppSettting";
import {
  useEditOrder,
  useExportOrder,
  useExportInvoice,
  useSyncOrder,
} from "../../../../hooks/data/useOrderData";
import { getFileURL } from "../../../../utils";
import { getActionsByStatus } from "../../../../utils/order";
import PaymentModal from "./PaymentModal";
import StatusModal from "./StatusModal";
const DropdownActions = ({ data, loading, mutate }) => {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [items, setItems] = useState([]);
  const { setAction } = useAppSettting();
  const { modal, message } = App.useApp();

  const router = useRouter();
  const syncOrder = useSyncOrder();
  const editOrder = useEditOrder();
  const exportOrder = useExportOrder();
  const exportInvoice = useExportInvoice();

  const triggerAction = (action, actionData, responseMessage) => {
    message.loading({ content: "Please wait...", key: "loading", duration: 0 });

    return action.trigger(actionData, {
      onSuccess: (res) => {
        mutate();
        if (res.data.fileUrl) {
          window.open(getFileURL(res.data.fileUrl), "_blank");
          return;
        }

        message.destroy("loading");
        message.success(responseMessage);
        return true;
      },
      onError: (err) => {
        const content =
          err?.response?.data?.error?.message ||
          "Unable to connect to the server. Please try again";
        message.error(content);
        return true;
      },
    });
  };

  const handleClick = async (e) => {
    switch (e.key) {
      // hanlde edit
      case "edit":
        router.push(`/orders/${data.id}/edit`);
        break;

      // handle sync
      case "sync":
        triggerAction(
          syncOrder,
          { id: data.id },
          "Syncing has been completed successfully."
        );
        break;

      // hanlde duplicate
      case "duplicate":
        localStorage.setItem(
          "newOrderData",
          JSON.stringify({
            ...data.attributes,
            paymentMode: "prepaid",
            type: "exchange",
          })
        );
        router.push("/orders/new");
        break;

      // handle export
      case "export":
        triggerAction(exportOrder, { id: data.id });
        break;

      // hanlde invoice
      case "invoice":
        triggerAction(exportInvoice, { id: data.id });
        break;
      // hanlde payment
      case "add_payment":
        setIsPaymentModalOpen(true);
        break;
      // hanlde update status
      case "update_status":
        setIsStatusModalOpen(true);
        break;
      // handle create return
      case "create_return":
        localStorage.setItem(
          "newOrderData",
          JSON.stringify({
            ...data.attributes,
            type: "return",
            shippingTotal: 0,
            paymentMode: "prepaid",
          })
        );
        router.push("/orders/new");
        break;

      // hanlde cancel
      case "cancel":
        modal.confirm({
          okButtonProps: { danger: true },
          title: "Are you sure?",
          closable: true,
          content:
            "Please note that once the order is cancelled, it cannot be undone.",
          onOk: async () => {
            triggerAction(
              editOrder,
              {
                data: {
                  cancelledAt: new Date(),
                  id: data.id,
                  currentStatus: null,
                },
              },
              "Order has been cancelled successfully."
            );
          },
        });

        break;
      default:
        break;
    }
  };

  useEffect(() => {
    const menuItems = getActionsByStatus(data?.attributes);
    setItems(menuItems);
  }, [data]);
  const Action = (
    <Dropdown menu={{ items, onClick: handleClick }}>
      <Button
        loading={syncOrder.isMutating || editOrder.isMutating}
        type="text"
        icon={<MdMoreVert className="text-lg" />}
        className="btn-action"
      />
    </Dropdown>
  );
  useEffect(() => {
    setAction(Action);
  }, [data, loading]);

  return (
    <>
      {/* payment modal */}
      <PaymentModal
        open={isPaymentModalOpen}
        setOpen={setIsPaymentModalOpen}
        id={data?.id}
      />

      {/* status modal */}
      <StatusModal
        open={isStatusModalOpen}
        setOpen={setIsStatusModalOpen}
        order={data}
      />

      {/* action */}
      <Dropdown
        menu={{ items, onClick: handleClick }}
        overlayStyle={{ width: "180px" }}
      >
        <Button
          type="text"
          size="large"
          icon={<MdMoreVert className="text-lg" />}
          className="text-button"
          loading={syncOrder.isMutating}
        />
      </Dropdown>
    </>
  );
};

export default DropdownActions;
