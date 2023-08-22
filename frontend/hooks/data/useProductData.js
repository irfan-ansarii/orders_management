import useSWRMutation from "swr/mutation";
import useSWR from "swr";

import {
  getProduct,
  getProducts,
  createProduct,
  editProduct,
  getVarient,
  getVarients,
  syncProducts,
  syncProduct,
  exportProducts,
  exportProduct,
} from "../../utils/api/products";

/**
 * get product
 * @param {*} id
 * @returns
 */
export const useProductData = ({ id, ...options }) => {
  return useSWR(!id ? null : `/products/${id}?populate=*`, getProduct, {
    ...options,
  });
};

/**
 * get products
 * @param {*} query
 * @returns
 */
export const useProductsData = (query) => {
  const { search, stock, page } = query;
  let filters = "";
  filters += search
    ? `&filters[$or][0][name][$contains]=${search}&filters[$or][1][description][$contains]=${search}&filters[$or][2][variants][sku][$contains]=${search}&filters[$or][3][variants][barcode][$contains]=${search}&filters[$or][4][id][$contains]=${search}`
    : ``;
  if (stock === "out of stock") {
    filters += `&filters[$or][0][variants][stock][$lte]=0&filters[$or][1][variants][stock][$null]=true`;
  } else if (stock === "in stock") {
    filters += `&filters[variants][stock][$gte]=1`;
  }

  filters += "&sort=createdAt:desc";
  filters += `&pagination[pageSize]=20`;
  filters += `&pagination[page]=${page || 1}`;

  return useSWR(`/products?populate=*${filters}`, getProducts);
};

/**
 * create product
 * @returns
 */
export const useCreateProduct = () => {
  return useSWRMutation(`/products`, createProduct);
};

/**
 * edit product
 * @returns
 */
export const useEditProduct = () => {
  return useSWRMutation(`/products`, editProduct);
};

/**
 * get variant
 * @param {*} id
 * @returns
 */
export const useVarientData = (id) => {
  return useSWR(
    !id ? null : `/variants/${id}?&populate[0]=*populate[1]=product.image`,
    getVarient
  );
};

/**
 * get variants
 * @param {*} query
 * @returns
 */
export const useVarientsData = (query) => {
  const { search } = query;
  let filters = "";
  filters += search
    ? `&filters[$or][0][name][$contains]=${search}&filters[$or][1][product][name][$contains]=${search}&filters[$or][2][product][description][$contains]=${search}&filters[$or][3][sku][$contains]=${search}&filters[$or][4][barcode][$contains]=${search}&filters[$or][5][id][$contains]=${search}&filters[$or][6][price][$contains]=${search}&filters[$or][7][salePrice][$contains]=${search}&filters[$or][8][option][$contains]=${search}`
    : ``;

  filters += "&status=active";
  filters += "&sort=createdAt:desc";
  filters += `&pagination[pageSize]=100`;

  return useSWR(
    `/variants?populate[0]=*&populate[1]=product.image${filters}`,
    getVarients
  );
};

/**
 * sync products
 * @returns
 */
export const useSyncProducts = () => {
  return useSWRMutation(`/products/sync`, syncProducts);
};

/**
 * sync product
 * @returns
 */
export const useSyncProduct = () => {
  return useSWRMutation(`/products/sync`, syncProduct);
};

/**
 * export products
 * @returns
 */
export const useExportProducts = () => {
  return useSWRMutation(`/products/export`, exportProducts);
};

/**
 * export product
 * @returns
 */
export const useExportProduct = () => {
  return useSWRMutation(`/products/export`, exportProduct);
};
