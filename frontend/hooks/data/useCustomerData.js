import useSWRMutation from "swr/mutation";
import useSWR from "swr";
import {
  getCustomer,
  getCustomers,
  createCustomer,
  editCustomer,
  exportCustomers,
  syncCustomers,
  syncCustomer,
} from "../../utils/api/customer";

/**
 * fetch customer
 * @param {*} id
 * @returns
 */
export const useCustomerData = (id) => {
  return useSWR(
    `/customers/${id}?populate[0]=orders.lineItems.product.image&populate[1]=orders.currentStatus`,
    getCustomer
  );
};

/**
 * fetch customers
 * @param {*} query
 * @returns
 */
export const useCustomersData = (query) => {
  const { search, spam, page } = query;
  let filters = "";
  filters += search
    ? `&filters[$or][0][name][$containsi]=${search}&filters[$or][1][phone][$containsi]=${search}&filters[$or][2][email][$containsi]=${search}&filters[$or][3][addresses][$containsi]=${search}&filters[$or][4][notes][$containsi]=${search}&filters[$or][5][id][$containsi]=${search}&filters[$or][6][defaultAddress][$containsi]=${search}`
    : ``;
  filters += spam ? `&filters[isSpam][$eq]=${spam}` : ``;
  filters += `&pagination[page]=${page || 1}`;
  filters += "&sort=createdAt:desc";
  filters += `&pagination[pageSize]=20`;

  return useSWR(`/customers?populate=*${filters}`, getCustomers);
};

/**
 * create customer
 * @returns
 */
export const useCreateCustomer = () => {
  return useSWRMutation(`/customers`, createCustomer);
};

/**
 * edit customer
 * @returns
 */
export const useEditCustomer = () => {
  return useSWRMutation(`/customers`, editCustomer);
};

/**
 * sync customers
 * @returns
 */
export const useSyncCustomers = () => {
  return useSWRMutation(`/customers/sync`, syncCustomers);
};

/**
 * sync customer
 * @returns
 */
export const useSyncCustomer = () => {
  return useSWRMutation(`/customers/sync`, syncCustomer);
};

/**
 * export customers csv
 * @returns
 */
export const useExportCustomers = () => {
  return useSWRMutation(`/customers/export`, exportCustomers);
};
