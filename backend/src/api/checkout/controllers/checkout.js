"use strict";

const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const csvWriter = createCsvWriter({
  path: "public/files/checkouts/checkouts.csv",
  header: [
    { id: "id", title: "ID" },
    { id: "createdAt", title: "CREATED AT" },
    { id: "checkoutId", title: "CHECKOUT ID" },
    { id: "items", title: "ITEMS" },
    { id: "customerId", title: "CUSTOMER ID" },
    { id: "name", title: "NAME" },
    { id: "phone", title: "PHONE" },
    { id: "email", title: "EMAIL" },
    { id: "city", title: "CITY" },
    { id: "country", title: "COUNTRY" },
    { id: "subtotal", title: "SUBTOTAL" },
    { id: "discount", title: "DISCOUNT" },
    { id: "tax", title: "TAX" },
    { id: "shipping", title: "SHIPPING" },
    { id: "total", title: "TOTAL" },
    { id: "status", title: "STATUS" },
  ],
});

/**
 * checkout controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::checkout.checkout",
  ({ strapi }) => ({
    /**
     * post method to handle shopify webhook events
     * @param {*} payload
     */
    async webhook(ctx) {
      const topic = ctx.request.header["x-shopify-topic"];
      const payload = ctx.request.body;

      if (topic === "checkouts/create") {
        await await strapi
          .service("api::checkout.checkout")
          .createCheckout(payload);
        return ctx.send("ok");
      } else if (topic === "checkouts/update") {
        await await strapi
          .service("api::checkout.checkout")
          .createCheckout(payload, "update");
        return ctx.send("ok");
      }

      return ctx.badRequest("Could not verify webhook.");
    },

    /**
     * POST method to sync the checkouts
     * @param {*} ctx
     * @returns
     */
    async sync(ctx) {
      await strapi.service("api::checkout.checkout").fetchCheckouts();
      return ctx.send({ message: "Checkout syncing has been completed." });
    },

    /**
     * POST method to sync the checkout
     * @param {*} ctx
     * @returns
     */
    async syncOne(ctx) {
      // get token
      const { token } = ctx.params;

      // get shopify instance
      const shopify = await strapi
        .service("api::platform.platform")
        .findPlatform();

      try {
        // find checkout by token
        const checkout = await shopify.checkout.get(token);

        // return result
        return await strapi
          .service("api::checkout.checkout")
          .createCheckout(checkout);
      } catch (err) {
        return ctx.badRequest("Unable to sync data from the channel.");
      }
    },

    /**
     * POST method for exporting data in CSV format
     * @param {*} ctx
     */
    async exportCSV(ctx) {
      let query = {
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
        const { results, pagination } = await strapi
          .service("api::checkout.checkout")
          .find(query);

        results.forEach((checkout) => {
          records.push({
            id: checkout.id,
            createdAt: checkout.createdAt,
            checkoutId: checkout.checkoutId,
            items: checkout.lineItems
              .map(
                (item, i) => `${i + 1} - ${item.title} - ${item.variant_title}`
              )
              .join(", "),
            customerId: checkout.customer.id,
            name: checkout.customer.name,
            phone: checkout.customer.phone,
            email: checkout.customer.email,
            city:
              checkout.shipping?.city ||
              checkout.billing?.city ||
              checkout.customer.defaultAddress?.city,

            country:
              checkout.shipping?.country ||
              checkout.billing?.country ||
              checkout.customer.defaultAddress?.country,
            subtotal: checkout.subTotal,

            discount: checkout.discountTotal,
            tax: checkout.taxTotal,

            shipping: checkout.shippingTotal,
            total: checkout.total,
            status: checkout.isRecovered ? "Recovered" : "Not recovered",
          });
        });

        if (query.pagination.page < pagination.pageCount) {
          query = {
            ...query,
            pagination: {
              page: query.pagination.page + 1,
            },
          };
        } else {
          query = { ...query, pagination: { page: undefined } };
        }
      } while (query.pagination.page !== undefined);

      csvWriter.writeRecords(records);

      return ctx.send({ fileUrl: "/files/checkouts/checkouts.csv" });
    },

    /**
     * export single checkout as pdf
     * @param {*} ctx
     */
    async exportPDF(ctx) {
      console.log(ctx);
    },
  })
);
