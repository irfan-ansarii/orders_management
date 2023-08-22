import {
  MdLocalShipping,
  MdHomeFilled,
  MdDone,
  MdDoneAll,
  MdStorefront,
  MdCancel,
  MdOutlineTransferWithinAStation,
  MdOutlineUTurnRight,
  MdCurrencyRupee,
} from "react-icons/md";
import { BsBoxFill } from "react-icons/bs";

/**
 * new order timeline
 */
export const NEW = [
  {
    title: "placed",
    status: "finish",
    icon: <MdDone className="text-lg" />,
  },
  {
    title: "confirmed",
    status: "wait",
    icon: <MdDoneAll className="text-lg" />,
  },
  {
    title: "packed",
    status: "wait",
    icon: <BsBoxFill className="text-md" />,
  },
  {
    title: "in_transit",
    status: "wait",
    icon: <MdLocalShipping className="text-lg" />,
  },
  {
    title: "out_for_delivery",
    status: "wait",
    icon: <MdOutlineTransferWithinAStation className="text-lg" />,
  },
  {
    title: "delivered",
    status: "wait",
    icon: <MdHomeFilled className="text-lg" />,
  },
  {
    title: "remittance",
    status: "wait",
    icon: <MdCurrencyRupee className="text-lg" />,
  },
];

/**
 * rto order timeline
 */
export const RTO = [
  {
    title: "placed",
    status: "finish",
    icon: <MdDone className="text-lg" />,
  },
  {
    title: "confirmed",
    status: "wait",
    icon: <MdDoneAll className="text-lg" />,
  },
  {
    title: "packed",
    status: "wait",
    icon: <BsBoxFill className="text-md" />,
  },
  {
    title: "in_transit",
    status: "wait",
    icon: <MdLocalShipping className="text-md" />,
  },
  {
    title: "rto_initiated",
    status: "wait",
    icon: <MdOutlineUTurnRight className="text-lg" />,
  },
  {
    title: "rto_in_transit",
    status: "wait",
    icon: <MdLocalShipping className="text-lg" />,
  },
  {
    title: "rto_delivered",
    status: "wait",
    icon: <MdStorefront className="text-lg" />,
  },
];

/** new return order status */
export const RETURN = [
  {
    title: "requested",
    status: "finish",
    icon: <MdDone className="text-lg" />,
  },
  {
    title: "return_initiated",
    status: "wait",
    icon: <MdDoneAll className="text-lg" />,
  },
  {
    title: "out_for_pickup",
    status: "wait",
    icon: <MdOutlineTransferWithinAStation className="text-lg" />,
  },
  {
    title: "in_transit",
    status: "wait",
    icon: <MdLocalShipping className="text-lg" />,
  },
  {
    title: "returned",
    status: "wait",
    icon: <MdStorefront className="text-lg" />,
  },
];

export const CANCELLED = [
  {
    title: "placed",
    status: "finish",
    icon: <MdDone className="text-lg" />,
  },
  {
    title: "cancelled",
    status: "finish",
    icon: <MdCancel className="text-lg" />,
  },
];

export const RETURN_REJECTED = [
  {
    title: "requested",
    status: "finish",
    icon: <MdDone className="text-lg" />,
  },
  {
    title: "return rejected",
    status: "finish",
    icon: <MdCancel className="text-lg" />,
  },
];

// customers timeline
export const CUSTOMER_NEW = [
  {
    title: "confirmed",
    status: "finish",
    icon: <MdDoneAll className="text-lg" />,
  },
  {
    title: "packed",
    status: "wait",
    icon: <BsBoxFill className="text-md" />,
  },
  {
    title: "in_transit",
    status: "wait",
    icon: <MdLocalShipping className="text-lg" />,
  },
  {
    title: "out_for_delivery",
    status: "wait",
    icon: <MdOutlineTransferWithinAStation className="text-lg" />,
  },
  {
    title: "delivered",
    status: "wait",
    icon: <MdHomeFilled className="text-lg" />,
  },
];

/**
 * rto order timeline
 */
export const CUSTOMER_RTO = [
  {
    title: "confirmed",
    status: "finish",
    icon: <MdDoneAll className="text-lg" />,
  },
  {
    title: "packed",
    status: "wait",
    icon: <BsBoxFill className="text-md" />,
  },
  {
    title: "in_transit",
    status: "wait",
    icon: <MdLocalShipping className="text-md" />,
  },
  {
    title: "rto_initiated",
    status: "wait",
    icon: <MdOutlineUTurnRight className="text-lg" />,
  },
  {
    title: "rto_delivered",
    status: "wait",
    icon: <MdStorefront className="text-lg" />,
  },
];
