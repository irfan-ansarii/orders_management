import axios from "axios";
import Cookies from "js-cookie";
import { getApiURL } from "../";

const token = Cookies.get("_TOKEN");
const API_URL = getApiURL();

export const getPlatforms = async (endPoint) => {
  return await axios.get(`${API_URL}${endPoint}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const createPlatform = async (endPoint, { arg }) => {
  return await axios.post(`${API_URL}${endPoint}`, arg, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
export const editPlatform = async (endPoint, { arg }) => {
  const formData = arg.get("data");
  const jsonData = JSON.parse(formData);
  const { id } = jsonData;
  return await axios.put(`${API_URL}${endPoint}${id}`, arg, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
/**
 * get settings
 * @param {*} endPoint
 * @returns
 */
export const getSettings = async (endPoint) => {
  return await axios.get(`${API_URL}${endPoint}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

/**
 * get settings
 * @param {*} endPoint
 * @returns
 */
export const getPublic = async (endPoint) => {
  return await axios.get(`${API_URL}${endPoint}`);
};

/**
 * edit settings
 * @param {*} endPoint
 * @param {*} param1
 * @returns
 */
export const editSettings = async (endPoint, { arg }) => {
  return await axios.put(`${API_URL}${endPoint}`, arg, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

/**
 * delete file
 * @param {*} endPoint
 * @param {*} param1
 * @returns
 */
export const deleteFile = async (endPoint, { arg }) => {
  return await axios.delete(`${API_URL}${endPoint}${arg.id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
