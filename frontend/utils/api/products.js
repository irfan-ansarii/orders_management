import axios from "axios";
import Cookies from "js-cookie";
import { getApiURL } from "../";

const token = Cookies.get("_TOKEN");
const API_URL = getApiURL();

export const getProduct = async (endPoint) => {
  return await axios.get(`${API_URL}${endPoint}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
export const getProducts = async (endPoint) => {
  return await axios.get(`${API_URL}${endPoint}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const createProduct = async (endPoint, { arg }) => {
  return await axios.post(`${API_URL}${endPoint}`, arg, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const editProduct = async (endPoint, { arg }) => {
  const {
    data: { id },
  } = arg;

  return await axios.put(`${API_URL}${endPoint}/${id}`, arg, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// varients
export const getVarient = async (endPoint) => {
  return await axios.get(`${API_URL}${endPoint}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
export const getVarients = async (endPoint) => {
  return await axios.get(`${API_URL}${endPoint}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

/**
 * sync products
 * @param {*} endPoint
 * @returns
 */
export const syncProducts = async (endPoint, { arg }) => {
  return await axios.post(
    `${API_URL}${endPoint}`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

/**
 * sync product
 * @param {*} endPoint
 * @returns
 */
export const syncProduct = async (endPoint, { arg }) => {
  return await axios.post(
    `${API_URL}${endPoint}/${arg.productId}`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

/**
 * export products
 * @param {*} endPoint
 * @returns
 */
export const exportProducts = async (endPoint, { arg }) => {
  const { search, stock } = arg;

  let filters = "";
  filters += search
    ? `&filters[$or][0][name][$contains]=${search}&filters[$or][1][description][$contains]=${search}&filters[$or][2][variants][sku][$contains]=${search}&filters[$or][3][variants][barcode][$contains]=${search}&filters[$or][4][id][$contains]=${search}`
    : ``;
  if (stock === "out of stock") {
    filters += `&filters[$or][0][variants][stock][$lte]=0&filters[$or][1][variants][stock][$null]=true`;
  } else if (stock === "in stock") {
    filters += `&filters[variants][stock][$gte]=1`;
  }

  return await axios.post(
    `${API_URL}${endPoint}${filters}`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

/**
 * expprt product
 * @param {*} endPoint
 * @returns
 */
export const exportProduct = async (endPoint, { arg }) => {
  return await axios.post(
    `${API_URL}${endPoint}/${arg.id}`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};
