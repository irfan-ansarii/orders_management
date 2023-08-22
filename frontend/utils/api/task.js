import axios from "axios";
import Cookies from "js-cookie";
import { getApiURL } from "..";

const token = Cookies.get("_TOKEN");
const API_URL = getApiURL();

/**
 * get all tasks
 * @param {*} endPoint
 * @returns
 */
export const getTasks = async (endPoint) => {
  return await axios.get(`${API_URL}${endPoint}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

/**
 * create task
 * @param {*} endPoint
 * @param {*} param1
 * @returns
 */
export const createTask = async (endPoint, { arg }) => {
  return await axios.post(`${API_URL}${endPoint}`, arg, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

/**
 * update task
 * @param {*} endPoint
 * @param {*} param1
 * @returns
 */
export const updateTask = async (endPoint, { arg }) => {
  return await axios.put(`${API_URL}${endPoint}/${arg.data.id}`, arg, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
