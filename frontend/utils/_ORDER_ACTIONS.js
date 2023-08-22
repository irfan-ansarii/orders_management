import {
  MdCancel,
  MdSaveAlt,
  MdOutlineSync,
  MdEdit,
  MdDescription,
  MdContentCopy,
  MdCurrencyRupee,
  MdBlock,
  MdMoney,
} from "react-icons/md";
import { RiFileAddLine, RiDraftLine, RiArrowGoBackLine } from "react-icons/ri";

// new order action
export const ACTIONS = [
  {
    key: "edit",
    label: "Edit",
    icon: <MdEdit />,
  },
  {
    key: "sync",
    label: "Sync",
    icon: <MdOutlineSync />,
  },
  {
    key: "invoice",
    label: "Invoice",
    icon: <MdDescription />,
    disabled: true,
  },
  {
    key: "duplicate",
    label: "Duplicate",
    icon: <MdContentCopy />,
  },
  {
    key: "export",
    label: "Export PDF",
    icon: <MdSaveAlt />,
    disabled: true,
  },
  {
    key: "add_payment",
    label: "Add Payment",
    icon: <MdCurrencyRupee />,
  },
  {
    key: "create_return",
    label: "Create Return",
    icon: <RiFileAddLine />,
  },
  {
    key: "update_status",
    label: "Update Status",
    icon: <RiDraftLine />,
  },
  {
    key: "update_shipping",
    label: "Shipping Charge",
    icon: <MdMoney />,
    disabled: true,
  },
  {
    key: "6",
    type: "divider",
  },
  {
    key: "cancel",
    danger: true,
    label: "Cancel",
    icon: <MdCancel />,
  },
];

// return order actions
export const RETURN_ACTIONS = [
  {
    key: "edit",
    label: "Edit",
    icon: <MdEdit />,
  },
  {
    key: "sync",
    label: "Sync",
    icon: <MdOutlineSync />,
  },
  {
    key: "initiate_return",
    label: "Initiate Return",
    icon: <RiArrowGoBackLine />,
  },
  {
    key: "reject_return",
    label: "Reject Return",
    icon: <MdBlock />,
  },

  {
    key: "update_status",
    label: "Update Status",
    icon: <RiDraftLine />,
  },
  {
    key: "update_shipping",
    label: "Shipping Charge",
    icon: <MdMoney />,
  },
  {
    key: "6",
    type: "divider",
  },
  {
    key: "cancel",
    danger: true,
    label: "Cancel",
    icon: <MdCancel />,
  },
];

//
export const NEW_EDIT_STATUS = [
  {
    value: "confirmed",
    label: "Confirmed",
  },
  {
    value: "packed",
    label: "Packed",
  },
  {
    value: "in_transit",
    label: "Shipped",
  },
  {
    value: "out_for_delivery",
    label: "Out For Delivery",
  },
  {
    value: "undelivered",
    label: "Undelivered",
  },
  {
    value: "rto_initiated",
    label: "RTO Initiated",
  },
  {
    value: "rto_in_transit",
    label: "RTO In Transit",
  },
  {
    value: "rto_delivered",
    label: "RTO Delivered",
  },
  {
    value: "delivered",
    label: "Delivered",
  },
  {
    value: "lost",
    label: "Lost",
  },
];

export const RETURN_EDIT_STATUS = [
  {
    value: "out_for_pickup",
    label: "Out For Pickup",
  },
  {
    value: "in_transit",
    label: "Return In Transit",
  },
  {
    value: "returned",
    label: "Returned",
  },
  {
    value: "lost",
    label: "Lost",
  },
];
