import useSWRMutation from "swr/mutation";
import useSWR from "swr";
import moment from "moment";
import {
  getCheckouts,
  getCheckout,
  exportCheckouts,
  syncCheckouts,
} from "../../utils/api/checkouts";

/**
 * get checkouts data
 * @param {*} id
 * @returns
 */
export const useCheckoutsData = (query) => {
  const { recovered, search, page, pageSize, range } = query;
  let filters = `&sort=createdAt:desc&pagination[pageSize]=${
    pageSize || 20
  }&pagination[page]=${page || 1}`;
  filters += search
    ? `&filters[$or][0][subTotal][$containsi]=${search}&filters[$or][1][total][$containsi]=${search}&filters[$or][2][billingAddress][$containsi]=${search}&filters[$or][3][shippingAddress][$containsi]=${search}&filters[$or][4][lineItems][$containsi]=${search}&filters[$or][5][customer][name][$containsi]=${search}&filters[$or][6][customer][phone][$containsi]=${search}&filters[$or][7][customer][email][$containsi]=${search}&filters[$or][8][customer][defaultAddress][$containsi]=${search}`
    : "";

  filters += recovered ? `&filters[isRecovered][$eq]=${recovered}` : "";

  if (range) {
    const start = range.split(",")[0];
    const end = moment(range.split(",")[1]).add(1, "day").format("YYYY-MM-DD");
    filters += `&filters[createdAt][$between]=${start}&filters[createdAt][$between]=${end}`;
  }

  return useSWR(`/checkouts?populate=*${filters}`, getCheckouts);
};

/**
 * get single checkout data
 * @param {*} id
 * @returns
 */
export const useCheckoutData = (id) => {
  return useSWR(`/checkouts/${id}?populate=*`, getCheckout);
};

/**
 * export checkouts
 * @returns
 */
export const useExportCheckouts = () => {
  return useSWRMutation(`/checkouts/export`, exportCheckouts);
};

/**
 * sync checkouts
 * @returns
 */
export const useSyncCheckouts = () => {
  return useSWRMutation(`/checkouts/sync`, syncCheckouts);
};
