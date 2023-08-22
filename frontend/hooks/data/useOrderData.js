import useSWRMutation from "swr/mutation";
import useSWR from "swr";
import moment from "moment";
import {
  getOrder,
  getOrders,
  createOrder,
  editOrder,
  syncOrders,
  syncOrder,
  exportOrders,
  exportOrder,
  exportInvoice,
  trackOrders,
  createStatus,
} from "../../utils/api/orders";

export const useOrderData = ({ id, ...options }) => {
  return useSWR(
    !id
      ? null
      : `/orders/${id}?populate[0]=customer&populate[1]=lineItems.product.image&populate[2]=platform&populate[3]=tracking&populate[4]=currentStatus.rider&populate[5]=lineItems.variant`,
    getOrder,
    { ...options }
  );
};

/**
 * get orders
 * @param {*} query
 * @returns
 */

export const useOrdersData = (query) => {
  const { search, status, page, range, pageSize } = query;

  let filters = "";
  filters += search
    ? `&filters[$or][0][name][$containsi]=${search}&filters[$or][1][orderId][$containsi]=${search}&filters[$or][2][type][$containsi]=${search}&filters[$or][3][billingAddress][$containsi]=${search}&filters[$or][4][shippingAddress][$containsi]=${search}&filters[$or][5][paymentMode][$containsi]=${search}&filters[$or][6][platform][name][$containsi]=${search}&filters[$or][7][lineItems][name][$containsi]=${search}&filters[$or][8][customer][name][$containsi]=${search}&filters[$or][9][customer][phone][$containsi]=${search}&filters[$or][10][customer][email][$containsi]=${search}&filters[$or][11][lineItems][name][$containsi]=${search}`
    : ``;

  if (status && status === "processing") {
    filters += `&filters[$or][0][currentStatus][name][$containsi]=confirmed&filters[$or][1][currentStatus][createdAt][$null]=true&filters[cancelledAt][$null]=true`;
  } else if (status === "cancelled") {
    filters += `&filters[cancelledAt][$notNull]=true`;
  } else if (status === "exchange") {
    filters += `&filters[type][$eqi]=${status}`;
  } else if (status === "return") {
    filters += `&filters[$or][0][type]=return&filters[$or][1][currentStatus][name][$containsi]=rto`;
  } else if (status === "shipped") {
    filters += `&filters[$or][0][currentStatus][name][$containsi]=in_transit&filters[$or][1][currentStatus][name][$containsi]=out_for_delivery&filters[type][$ne]=return`;
  } else if (status) {
    filters += `&filters[currentStatus][name][$containsi]=${status}`;
  }

  if (range) {
    const start = range.split(",")[0];
    const end = moment(range.split(",")[1]).add(1, "day").format("YYYY-MM-DD");
    filters += `&filters[orderDate][$between]=${start}&filters[orderDate][$between]=${end}`;
  }

  filters += "&sort=orderDate:desc";
  filters += `&pagination[pageSize]=${pageSize || 20}`;
  filters += `&pagination[page]=${page || 1}`;

  return useSWR(
    `/orders?populate[0]=customer&populate[1]=lineItems.product.image&populate[2]=currentStatus&populate[3]=tracking${filters}`,
    getOrders
  );
};

/**
 * create order
 * @returns
 */
export const useCreateOrder = () => {
  return useSWRMutation(`/orders`, createOrder);
};

/**
 * get local delivery data
 * @param {*} query
 * @returns
 */
export const useLocalDeliveryData = (query) => {
  const { search, status, page, range, pageSize, userId } = query;
  let filters = "";

  if (range) {
    const start = range.split(",")[0];
    const end = moment(range.split(",")[1]).add(1, "day").format("YYYY-MM-DD");
    filters += `&filters[tracking][happenedAt][$between]=${start}&filters[tracking][happenedAt][$between]=${end}`;
  }

  filters += userId
    ? `&filters[tracking][rider][id][$eq]=${userId}`
    : `&filters[tracking][rider][id][$notNull]=true`;

  filters += search
    ? `&filters[$or][0][name][$containsi]=${search}&filters[$or][1][orderId][$containsi]=${search}&filters[$or][2][type][$containsi]=${search}&filters[$or][3][billingAddress][$containsi]=${search}&filters[$or][4][shippingAddress][$containsi]=${search}&filters[$or][5][paymentMode][$containsi]=${search}&filters[$or][6][platform][name][$containsi]=${search}&filters[$or][7][lineItems][name][$containsi]=${search}&filters[$or][8][customer][name][$containsi]=${search}&filters[$or][9][customer][phone][$containsi]=${search}&filters[$or][10][customer][email][$containsi]=${search}&filters[$or][11][lineItems][name][$containsi]=${search}`
    : ``;

  // status active
  filters +=
    status === "active"
      ? `&filters[$or][0][currentStatus][name][$eqi]=out_for_delivery&filters[$or][1][currentStatus][name][$eqi]=out_for_pickup&filters[$or][2][currentStatus][name][$eqi]=in_transit&filters[$or][3][currentStatus][name][$eqi]=rto_initiated`
      : ``;

  // status rescheduled
  filters +=
    status === "rescheduled"
      ? `&filters[$or][0][currentStatus][name][$eqi]=undelivered&filters[$or][1][currentStatus][name][$eqi]=return_rescheduled`
      : ``;

  // status completed
  filters +=
    status == "completed"
      ? `&filters[$or][0][currentStatus][name][$eqi]=delivered&filters[$or][1][currentStatus][name][$eqi]=returned&filters[$or][2][currentStatus][name][$eqi]=rto_delivered&filters[$or][3][currentStatus][name][$eqi]=return_cancelled`
      : ``;

  // sort and pagination
  filters += "&sort=currentStatus.createdAt:desc";
  filters += `&pagination[pageSize]=${pageSize || 20}`;
  filters += `&pagination[page]=${page || 1}`;

  return useSWR(
    !query
      ? null
      : `/orders?populate[0]=customer&populate[1]=lineItems.product.image&populate[2]=currentStatus.rider${filters}`,
    getOrders
  );
};

/**
 * edit order
 * @returns
 */
export const useEditOrder = () => {
  return useSWRMutation(`/orders`, editOrder);
};

/**
 * sync orders
 * @returns
 */
export const useSyncOrders = () => {
  return useSWRMutation(`/orders/sync`, syncOrders);
};

/**
 * sync order
 * @returns
 */
export const useSyncOrder = () => {
  return useSWRMutation(`/orders/sync`, syncOrder);
};

/**
 * export orders csv
 * @returns
 */
export const useExportOrders = () => {
  return useSWRMutation(`/orders/export`, exportOrders);
};

/**
 * export orders PDF
 * @returns
 */
export const useExportOrder = () => {
  return useSWRMutation(`/orders/export`, exportOrder);
};

/**
 * export invoice
 * @returns
 */
export const useExportInvoice = () => {
  return useSWRMutation(`/orders/invoice`, exportInvoice);
};

/**
 * get orders by name or awb
 * @returns
 */
export const useTrackOrders = () => {
  return useSWRMutation(`/orders/track`, trackOrders);
};

/**
 * create order status
 * @returns
 */
export const useCreateStatus = () => {
  return useSWRMutation(`/order-statuses`, createStatus);
};

/**
 * get packed orders
 * @param {object} query
 * @returns
 */
export const usePackedOrdersData = (query = {}) => {
  const { page, pageSize, range, search } = query;

  let filters = `&filters[$or][0][currentStatus][name][$eq]=packed&filters[$or][1][currentStatus][name][$eq]=return_initiated`;

  filters += search
    ? `$filters[$or][0][name][$containsi]=${search}$filters[$or][0][shippingAddresss][$containsi]=${search}`
    : ``;

  if (range) {
    const start = range.split(",")[0];
    const end = moment(range.split(",")[1]).add(1, "day").format("YYYY-MM-DD");
    filters += `&filters[currentStatus][happenedAt][$between]=${start}&filters[currentStatus][happenedAt][$between]=${end}`;
  }
  filters += `&sort=currentStatus.createdAt:desc`;
  filters += `&pagination[pageSize]=${pageSize || 12}`;
  filters += `&pagination[page]=${page || 1}`;
  return useSWR(`/orders?populate*${filters}`, getOrders);
};

/**
 * get active orders
 * @param {object} query
 * @returns
 */
export const useActiveOrdersData = (query = {}) => {
  const { userId, page, pageSize, range, search } = query;

  let filters = `&filters[$or][0][currentStatus][name][$eq]=out_for_delivery`;
  filters += `&filters[$or][1][currentStatus][name][$eq]=undelivered`;
  filters += `&filters[$or][2][currentStatus][name][$eq]=rto_initiated`;
  filters += `&filters[$or][3][currentStatus][name][$eq]=out_for_pickup`;
  filters += `&filters[$or][4][currentStatus][name][$eq]=return_rescheduled`;
  filters += `&filters[$or][5][currentStatus][name][$eq]=in_transit`;
  filters += `&filters[currentStatus][rider][id][$eq]=${userId}`;
  filters += search
    ? `$filters[$or][0][name][$containsi]=${search}$filters[$or][0][shippingAddresss][$containsi]=${search}`
    : ``;
  if (range) {
    const start = range.split(",")[0];
    const end = moment(range.split(",")[1]).add(1, "day").format("YYYY-MM-DD");
    filters += `&filters[currentStatus][happenedAt][$between]=${start}&filters[currentStatus][happenedAt][$between]=${end}`;
  }
  filters += `&sort=currentStatus.createdAt:desc`;
  filters += `&pagination[pageSize]=${pageSize || 12}`;
  filters += `&pagination[page]=${page || 1}`;

  return useSWR(!userId ? null : `/orders?populate=*${filters}`, getOrders);
};

/**
 * get completed orderss
 * @param {object} query
 * @returns
 */
export const useCompletedOrdersData = (query = {}) => {
  const { userId, page, pageSize, range, search } = query;
  let filters = `&filters[$or][0][currentStatus][name][$eq]=delivered`;
  filters += `&filters[$or][1][currentStatus][name][$eq]=returned`;
  filters += `&filters[$or][2][currentStatus][name][$eq]=rto_delivered`;
  filters += `&filters[$or][3][currentStatus][name][$eq]=return_cancelled`;
  filters += `&filters[currentStatus][rider][id][$eq]=${userId}`;

  filters += search
    ? `$filters[$or][0][name][$containsi]=${search}$filters[$or][0][shippingAddresss][$containsi]=${search}`
    : ``;
  if (range) {
    const start = range.split(",")[0];
    const end = moment(range.split(",")[1]).add(1, "day").format("YYYY-MM-DD");
    filters += `&filters[currentStatus][happenedAt][$between]=${start}&filters[currentStatus][happenedAt][$between]=${end}`;
  }
  filters += `&sort=currentStatus.happenedAt:desc`;
  filters += `&pagination[pageSize]=${pageSize || 12}`;
  filters += `&pagination[page]=${page || 1}`;
  return useSWR(!userId ? null : `/orders?populate=*${filters}`, getOrders);
};
