import { ACTIONS, RETURN_ACTIONS } from "../_ORDER_ACTIONS";
import {
  CANCELLED,
  RETURN_REJECTED,
  CUSTOMER_RTO,
  RETURN,
  CUSTOMER_NEW,
  RTO,
  NEW,
} from "../_ORDER_STATUS";
import moment from "moment";

/**
 * helper function for dissabling actions **getActionsByStatus**
 * @param {*} actions
 * @param {*} keys
 * @returns
 */
const disableAction = (actions = [], keys = []) => {
  return actions.filter((action) => !keys.includes(action.key));
};

/**
 * get the order actions on single order page
 * @param {attributes }
 * @returns
 */
export const getActionsByStatus = (attributes) => {
  if (!attributes) return [];
  const { type, cancelledAt, remittance } = attributes;

  let actions = type === "return" ? [...RETURN_ACTIONS] : [...ACTIONS];

  if (cancelledAt !== null) {
    // actions = actions.map((action) => {
    //   if (action.key !== "duplicate" && action.key !== "export") {
    //     return { ...action, disabled: true };
    //   }
    //   return action;
    // });
    // return actions;

    if (cancelledAt !== null) {
      return actions.filter(
        (action) => action.key === "duplicate" || action.key === "export"
      );
    }

    return actions;
  }

  const currentStatus = attributes?.currentStatus?.data?.attributes?.name;

  // if payment already entered disable add payment option
  if (remittance || type !== "new") {
    actions = disableAction(actions, ["add_payment"]);
  }

  switch (currentStatus) {
    case undefined:
      actions = disableAction(
        actions,
        type === "return"
          ? ["create_return", "update_status"]
          : ["create_return"]
      );
      break;
    case "packed":
      actions = disableAction(actions, ["create_return", "edit"]);
    case "confirmed":
      actions = disableAction(actions, ["create_return"]);
      break;
    case "in_transit":
    case "out_for_delivery":
      actions = disableAction(actions, [
        "edit",
        "cancel",
        "create_return",
        "initiate_return",
        "reject_return",
      ]);
      break;
    case "rto_initiated":
    case "rto_in_transit":
    case "return_initiated":
    case "out_for_pickup":
      actions = disableAction(actions, [
        "edit",
        "cancel",
        "create_return",
        "initiate_return",
        "reject_return",
        "add_payment",
      ]);
      break;
    case "delivered":
      actions = disableAction(actions, ["edit", "cancel", "update_status"]);
      break;
    case "rto_delivered":
      actions = disableAction(actions, [
        "edit",

        "cancel",
        "create_return",
        "update_status",
        "add_payment",
      ]);
      break;
    case "lost":
      actions = disableAction(actions, [
        "edit",

        "cancel",
        "create_return",
        "update_status",
      ]);
      break;
    case "returned":
      actions = disableAction(actions, [
        "edit",

        "cancel",
        "update_status",
        "create_return",
        "initiate_return",
        "reject_return",
        "add_payment",
      ]);
      break;
  }

  return actions;
};

//

/**
 * return status tag object based of current status
 * @param {*} data
 * @returns
 */
export const getStatusTag = (data) => {
  const { attributes } = data || {};
  const isCancelled = attributes?.cancelledAt != null;

  if (isCancelled) {
    return {
      color: "error",
      name: "Cancelled",
      date: attributes?.cancelledAt,
    };
  }

  const orderType = attributes?.type;
  const currentStatus = attributes?.currentStatus?.data?.attributes?.name;
  const statusUpdatedAt =
    attributes?.currentStatus?.data?.attributes?.happenedAt;

  let tag = {
    date: statusUpdatedAt || attributes?.orderDate,
    color: "processing",
    name: currentStatus,
  };

  switch (currentStatus) {
    case "packed":
    case "confirmed":
      tag = {
        ...tag,
        name: currentStatus,
        color: "cyan",
      };
      break;
    case "in_transit":
      tag = {
        ...tag,
        name: orderType === "return" ? "return in transit" : currentStatus,
        color: orderType === "return" ? "volcano" : "magenta",
      };
      break;
    case "out_for_delivery":
      tag = {
        ...tag,
        color: "magenta",
      };
      break;

    case "delivered":
      tag = {
        ...tag,

        color: "success",
      };
      break;

    case "lost":
    case "dispute":
      tag = {
        ...tag,

        name:
          orderType === "return" ? `return ${currentStatus}` : currentStatus,
        color: "error",
      };
      break;

    case "rto_initiated":
      tag = { ...tag, color: "error" };
      break;

    case "rto_in_transit":
      tag = { ...tag, color: "error" };
      break;

    case "rto_delivered":
      tag = { ...tag, color: "error" };
      break;

    case "return_initiated":
      tag = { ...tag, color: "volcano" };
      break;

    case "return_rejected":
      tag = { ...tag, color: "volcano" };
      break;

    case "out_for_pickup":
      tag = {
        ...tag,
        color: "volcano",
      };
      break;

    case "returned":
      tag = { ...tag, color: "volcano" };
      break;

    default:
      tag = {
        ...tag,
        color: orderType === "return" ? "volcano" : tag.color,
        name: orderType === "return" ? "requested" : "processing",
      };
      break;
  }

  return { ...tag, name: tag?.name?.replace(/_/g, " ") };
};

// order status timeline
export const isCancelled = (cancelledAt, orderType, createdAt) => {
  if (cancelledAt !== null) {
    const isReturn = orderType === "return";
    return [
      {
        ...CANCELLED[0],
        title: isReturn ? "requested" : "placed",
        description: moment(createdAt).format("DD MMM, YYYY"),
      },
      {
        ...CANCELLED[1],
        description: moment(cancelledAt).format("DD MMM, YYYY"),
      },
    ];
  }
  return null;
};

export const isRejected = (currentStatus, createdAt) => {
  const isReturned =
    currentStatus?.data?.attributes?.name === "return_rejected";

  if (isReturned) {
    const rejectedAt =
      currentStatus?.data?.attributes?.happenedAt ||
      currentStatus?.data?.attributes?.createdAt;
    return [
      {
        ...RETURN_REJECTED[0],
        description: moment(createdAt).format("DD MMM, YYYY"),
      },
      {
        ...RETURN_REJECTED[1],
        description: moment(rejectedAt).format("DD MMM, YYYY"),
      },
    ];
  }
  return null;
};

export const determineStatusTypes = (orderType, currentStatus, client) => {
  const status = currentStatus?.data?.attributes?.name;
  const rtoCriteria = ["rto_initiated", "rto_in_transit", "rto_delivered"];

  if (orderType === "return") {
    return RETURN;
  }
  if (rtoCriteria.includes(status)) {
    return client === "admin" ? RTO : CUSTOMER_RTO;
  }
  return client === "admin" ? NEW : CUSTOMER_NEW;
};

export const mapToUpdatedTimeline = (statusTypes, tracking) => {
  return statusTypes.map((step) => {
    const index = tracking?.data?.findIndex(
      (item) =>
        item?.attributes?.name?.toLowerCase() === step?.title?.toLowerCase()
    );
    if (index !== -1) {
      return {
        ...step,
        status: "finish",
        title: step.title.replace(/_/g, " "),
        description: moment(
          tracking?.data[index].attributes.happenedAt ||
            tracking?.data[index].attributes.createdAt
        ).format("DD MMM, YYYY"),
      };
    }
    return { ...step, title: step.title.replace(/_/g, " ") };
  });
};
