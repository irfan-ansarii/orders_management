import axios from "axios";
import Cookies from "js-cookie";
import { getApiURL } from "..";

const token = Cookies.get("_TOKEN");
const API_URL = getApiURL();

/**
 * get single order
 * @param {*} endPoint
 * @returns
 */
export const getOrder = async (endPoint) => {
  return await axios.get(`${API_URL}${endPoint}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

/**
 * get all orders
 * @param {*} endPoint
 * @returns
 */
export const getOrders = async (endPoint) => {
  return await axios.get(`${API_URL}${endPoint}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

/**
 * create order
 * @param {*} endPoint
 * @param {*} param1
 * @returns
 */
export const createOrder = async (endPoint, { arg }) => {
  return await axios.post(`${API_URL}${endPoint}`, arg, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

/**
 *  edit update
 * @param {*} endPoint
 * @param {*} param1
 * @returns
 */
export const editOrder = async (endPoint, { arg }) => {
  const {
    data: { id },
  } = arg;
  return await axios.put(`${API_URL}${endPoint}/${id}`, arg, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

/**
 * sync all orders
 * @returns
 */
export const syncOrders = async (endPoint, { arg }) => {
  return await axios.post(`${API_URL}${endPoint}`, arg, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

/**
 * single single order
 * @returns
 */
export const syncOrder = async (endPoint, { arg }) => {
  return await axios.post(`${API_URL}${endPoint}/${arg.id}`, arg, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

/**
 * export all order
 */
export const exportOrders = async(endPoint, { arg }) => {

const { search, status, page, range, pageSize } = arg;
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


return await axios.post(
    `${API_URL}${endPoint}${filters}`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

};

/**
 * export single order
 * @returns
 */
export const exportOrder = async (endPoint, { arg }) => {
  return await axios.post(`${API_URL}${endPoint}/${arg.orderId}`, arg, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

/**
 * export invoice
 * @param {*} endPoint
 * @param {*} param1
 * @returns
 */
export const exportInvoice = async (endPoint, { arg }) => {
  return await axios.post(`${API_URL}${endPoint}/${arg.id}`, arg, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

/**
 * track orders public router
 * @param {*} endPoint
 * @returns
 */
export const trackOrders = async (endPoint, { arg }) => {
  const { query } = arg;

  if (!query) {
    return;
  }

  const filter = `/?filters[$or][0][name][$eqi]=${query}&filters[$or][1][tracking][trackingNumber][$eqi]=${query}&sort=createdAt%3Adesc`;

  return await axios.get(`${API_URL}${endPoint}${filter}`);
};

/**
 * create status
 * @param {*} endPoint
 * @returns
 */
export const createStatus = async (endPoint, { arg }) => {
  return await axios.post(`${API_URL}${endPoint}`, arg, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
