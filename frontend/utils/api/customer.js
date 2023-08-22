import axios from "axios";
import Cookies from "js-cookie";
import { getApiURL } from "../";

const token = Cookies.get("_TOKEN");
const API_URL = getApiURL();

/**
 * get customer
 * @param {*} endPoint
 * @returns
 */
export const getCustomer = async (endPoint) => {
  return await axios.get(`${API_URL}${endPoint}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

/** get customers
 *
 * @param {*} endPoint
 * @returns
 */
export const getCustomers = async (endPoint) => {
  return await axios.get(`${API_URL}${endPoint}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

/**
 * create customer
 * @param {*} endPoint
 * @param {*} param1
 * @returns
 */
export const createCustomer = async (endPoint, { arg }) => {
  return await axios.post(`${API_URL}${endPoint}`, arg, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

/**
 * end customer
 * @param {*} endPoint
 * @param {*} {arg}
 * @returns
 */
export const editCustomer = async (endPoint, { arg }) => {
  const {
    data: { id },
  } = arg;
  return await axios.put(`${API_URL}${endPoint}/${id}`, arg, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

/**
 * sync customers
 * @param {*} endPoint
 * @param {*} {arg}
 * @returns
 */
export const syncCustomers = async (endPoint, { arg }) => {
  return await axios.post(`${API_URL}${endPoint}`, arg, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

/**
 * sync customers
 * @param {*} endPoint
 * @param {*} {arg }
 * @returns
 */
export const syncCustomer = async (endPoint, { arg }) => {
  return await axios.post(`${API_URL}${endPoint}/${arg.customerId}`, arg, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

/**
 * export customers
 * @param {*} endPoint
 * @param {*} { arg }
 * @returns
 */
export const exportCustomers = async (endPoint, { arg }) => {
  const { search, spam, page } = arg;
  let filters = "?populate=*";
  filters += search
    ? `&filters[$or][0][name][$containsi]=${search}&filters[$or][1][phone][$containsi]=${search}&filters[$or][2][email][$containsi]=${search}&filters[$or][3][addresses][$containsi]=${search}&filters[$or][4][notes][$containsi]=${search}&filters[$or][5][id][$containsi]=${search}&filters[$or][6][defaultAddress][$containsi]=${search}`
    : ``;
  filters += spam ? `&filters[isSpam][$eq]=${spam}` : ``;
  filters += `&pagination[page]=${page || 1}`;
  filters += "&sort=createdAt:desc";
  filters += `&pagination[pageSize]=20`;

  return await axios.post(
    `${API_URL}${endPoint}${filters}`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};
