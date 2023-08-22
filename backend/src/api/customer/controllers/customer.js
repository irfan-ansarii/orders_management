"use strict";

const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const csvWriter = createCsvWriter({
  path: "public/files/customers/customers.csv",
  header: [
    { id: "name", title: "NAME" },
    { id: "mobile", title: "MOBILE" },
  ],
});
/**
 * customer controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::customer.customer",
  ({ strapi }) => ({
    /**
     * POST method to handle shopify webhook events
     * @param {*} payload
     */
    async webhookEvent(ctx) {
      const topic = ctx.request.header["x-shopify-topic"];
      const payload = ctx.request.body;

      if (topic === "customers/create") {
        await strapi.service("api::customer.customer").createCustomer(payload);
        return ctx.send("ok");
      } else if (topic === "customers/update") {
        await strapi
          .service("api::customer.customer")
          .createCustomer(payload, "update");

        return ctx.send("ok");
      }

      return ctx.badRequest("Could not verify webhook.");
    },

    /**
     * POST method to sync the customers
     * @param {*} ctx
     * @returns
     */
    async sync(ctx) {
      await strapi.service("api::customer.customer").fetchCustomers();
      return ctx.send({ message: "Data syncing has been completed." });
    },

    /**
     * POST method to sync the customer
     * @param {*} ctx
     * @returns
     */
    async syncOne(ctx) {
      // get customerId
      const { customerId } = ctx.request.params;

      // get shopify instance
      const shopify = await strapi
        .service("api::platform.platform")
        .findPlatform();

      try {
        // find customer by customerId
        const customer = await shopify.customer.get(customerId);
        // return result
        return await strapi
          .service("api::customer.customer")
          .createCustomer(customer);
      } catch (err) {
        return ctx.badRequest("Unable to sync data from the channel.");
      }
    },

    /**
     * POST method to send messages to all customers
     * @param {*} ctx
     */
    async sendMessages(ctx) {
      console.log("send messages");
    },

    /**
     * POST method to send emails to all customers
     * @param {*} ctx
     */
    async sendEmails(ctx) {
      console.log("send emails");
    },

    /**
     * POST method for sending messag
     * @param {*} ctx
     */
    async sendMessage(ctx) {
      console.log("send message");
    },

    /**
     * POST method for send email
     * @param {*} ctx
     */
    async sendEmail(ctx) {
      console.log("send email");
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
          .service("api::customer.customer")
          .find(sanitizedQueryParams);

        results.forEach((result) =>
          records.push({
            name: result.name,
            mobile: result.phone,
          })
        );

        if (ctx.query.pagination.page < pagination.pageCount) {
          ctx.query.pagination.page += 1;
        } else {
          ctx.query.pagination.page = undefined;
        }
      } while (ctx.query.pagination.page !== undefined);

      csvWriter.writeRecords(records);

      return {
        fileUrl: "/files/customers/customers.csv",
      };
    },
  })
);
