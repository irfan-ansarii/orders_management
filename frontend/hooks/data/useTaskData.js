import useSWRMutation from "swr/mutation";
import useSWR from "swr";
import { getTasks, createTask, updateTask } from "../../utils/api/task";

/**
 * fetch customers
 * @param {*} query
 * @returns
 */
export const useTaskData = (query) => {
  let filters = `&filters[$or][0][user][id][$eq]=${query}&filters[$or][1][assignedTo][id][$eq]=${query}`;
  filters += `&pagination[page]=1`;
  filters += "&sort[0]=status:desc&sort[1]=createdAt:desc";
  filters += `&pagination[pageSize]=20`;

  return useSWR(`/todos?populate=*${filters}`, getTasks);
};

/**
 * create task
 * @returns
 */
export const useCreateTask = () => {
  return useSWRMutation(`/todos`, createTask);
};
/**
 * update task
 * @returns
 */
export const useUpdateTask = () => {
  return useSWRMutation(`/todos`, updateTask);
};
