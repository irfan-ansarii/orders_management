"use strict";
const fetch = require("node-fetch");
const FormData = require("form-data");

const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const csvWriter = createCsvWriter({
  path: "public/files/products.csv",
  header: [
    { id: "id", title: "ID" },
    { id: "title", title: "TITLE" },
    { id: "varinatId", title: "VARIANT ID" },
    { id: "varinatName", title: "VARIANT NAME" },
    { id: "sku", title: "SKU" },
    { id: "price", title: "PRICE" },
    { id: "salePrice", title: "SALE PRICE" },
    { id: "sold", title: "SOLD" },
    { id: "stock", title: "STOCK" },
    { id: "image", title: "IMAGE" },
    { id: "status", title: "STATUS" },
  ],
});

/**
 * product controller
 */

const { createCoreController } = require("@strapi/strapi").factories;
/**
 * check if given object is JSON
 * @param {*} obj
 * @returns
 */
function toJSON(obj) {
  try {
    const json = JSON.parse(obj);
    return json;
  } catch (error) {
    return obj;
  }
}

module.exports = createCoreController("api::product.product", ({ strapi }) => ({
  /**
   * override default create controller
   * @param {*} ctx
   * @returns
   */

  async create(ctx) {
    const { data, meta } = await super.create(ctx);

    const bodyData = toJSON(ctx.request.body.data);

    const { variations, ...rest } = bodyData || {};

    if (variations) {
      data.attributes.variants = [];
      for (const variant of variations) {
        const response = await strapi.service("api::variant.variant").create({
          data: { ...variant, product: data.id },
        });
        data.attributes.variants.push(response);
      }
    }

    return { data, meta };
  },

  /**
   * override default create controller
   * @param {*} ctx
   * @returns
   */

  async update(ctx) {
    const entity = await super.update(ctx);
    console.log(entity);
    const bodyData = ctx.request.body.data;

    const { variations, ...rest } = bodyData || {};

    // return if line items are not present
    if (!variations || !Array.isArray(variations)) {
      return entity;
    }

    const { results } = await strapi.service("api::variant.variant").find({
      filters: { product: { id: entity.data.id } },
      populate: "*",
    });

    for (const variant of variations) {
      // update line item if exists

      const index = results.findIndex((result) => result.id === variant.id);
      let response = null;

      if (index !== -1) {
        //update if already exists
        response = await strapi
          .service("api::variant.variant")
          .update(variant.id, {
            data: { ...variant },
          });
      } else {
        // create if not found
        response = await strapi.service("api::variant.variant").create({
          data: { ...variant, product: entity.data.id },
        });
      }

      // append line items to response
      entity.data.attributes.variants = [
        ...(entity.data.attributes.variants || []),
        response,
      ];
    }

    // delete line items which are not linked
    for (const result of results) {
      const index = variations.findIndex((item) => item.id === result.id);
      if (index === -1) {
        await strapi.service("api::variant.variant").delete(result.id);
      }
    }

    return entity;
  },

  /**
   * post method to handle shopify webhook events
   * @param {*} payload
   */
  async webhookEvent(ctx) {
    const topic = ctx.request.header["x-shopify-topic"];

    const payload = ctx.request.body;
    if (topic == "products/create") {
      await strapi.service("api::product.product").createProduct(payload);
      return ctx.send("ok");
    } else if (topic == "products/update") {
      await strapi
        .service("api::product.product")
        .createProduct(payload, "update");
      return ctx.send("ok");
    }
    return ctx.badRequest("Could not verify webhook.");
  },

  /**
   * POST method to sync the products
   * @param {*} ctx
   * @returns
   */
  async sync(ctx) {
    await strapi.service("api::product.product").fetchProducts();
    return ctx.send({ message: "Product syncing has been completed." });
  },

  /**
   * POST method to sync the product
   * @param {*} ctx
   * @returns
   */
  async syncOne(ctx) {
    // get productId
    const { productId } = ctx.params;
    // get shopify instance
    const shopify = await strapi
      .service("api::platform.platform")
      .findPlatform();

    try {
      // find product by productId
      const product = await shopify.product.get(productId);

      // return result
      return await strapi
        .service("api::product.product")
        .createProduct(product);
    } catch (err) {
      return ctx.badRequest("Unable to sync data from the channel.");
    }
  },

  /**
   * POST method for exporting data in CSV format
   * @param {*} ctx
   */
  async exportCSV(ctx) {
    ctx.query = {
      ...ctx.query,
      pagination: { page: 1 },
      sort: { id: "desc" },
      populate: "*",
    };
    const records = [];

    /**
     * loop through all the records in the collection
     */
    do {
      const sanitizedQueryParams = await this.sanitizeQuery(ctx);
      const { results, pagination } = await strapi
        .service("api::product.product")
        .find(sanitizedQueryParams);

      results.forEach((product) => {
        product.variants.forEach((variant) =>
          records.push({
            id: product.id,
            title: product.name,
            status: product.status,
            image: product.image,
            variantId: variant.id,
            varinatName: variant.name,
            sku: variant.sku,
            price: variant.price,
            salePrice: variant.salePrice,
            sold: variant.sold,
            stock: variant.available,
          })
        );
      });

      if (ctx.query.pagination.page < pagination.pageCount) {
        ctx.query.pagination.page += 1;
      } else {
        ctx.query.pagination.page = undefined;
      }
    } while (ctx.query.pagination.page !== undefined);

    csvWriter.writeRecords(records);

    return ctx.send({ fileUrl: "/files/products.csv" });
  },

  /**
   * export single product as pdf
   * @param {*} ctx
   */
  async exportPDF(ctx) {
    const { id } = ctx.params;
    console.log(id);
  },
}));
