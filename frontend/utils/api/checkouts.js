import axios from "axios";
import Cookies from "js-cookie";
import { getApiURL } from "..";

const token = Cookies.get("_TOKEN");
const API_URL = getApiURL();

/**
 * get checkouts
 * @param {*} endPoint
 * @returns
 */
export const getCheckouts = async (endPoint) => {
  return await axios.get(`${API_URL}${endPoint}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

/**
 * get checkout
 * @param {*} endPoint
 * @returns
 */
export const getCheckout = async (endPoint) => {
  return await axios.get(`${API_URL}${endPoint}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
/**
 * export checkouts
 * @param {*} endPoint
 * @returns
 */
export const exportCheckouts = async (endPoint, { arg }) => {
  const { recovered, search } = arg;
  let filters = "";
  filters += search
    ? `&filters[$or][0][subTotal][$containsi]=${search}&filters[$or][1][total][$containsi]=${search}&filters[$or][2][billingAddress][$containsi]=${search}&filters[$or][3][shippingAddress][$containsi]=${search}&filters[$or][4][lineItems][$containsi]=${search}&filters[$or][5][customer][name][$containsi]=${search}&filters[$or][6][customer][phone][$containsi]=${search}&filters[$or][7][customer][email][$containsi]=${search}&filters[$or][8][customer][defaultAddress][$containsi]=${search}`
    : "";

  filters += recovered ? `&filters[isRecovered][$eq]=${recovered}` : "";

  return await axios.post(
    `${API_URL}${endPoint}${filters}`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

/**
 * sync checkouts
 * @param {*} endPoint
 * @returns
 */
export const syncCheckouts = async (endPoint) => {
  return await axios.post(
    `${API_URL}${endPoint}`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};
