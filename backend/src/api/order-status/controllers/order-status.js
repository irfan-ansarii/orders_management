"use strict";

/**
 * order-status controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::order-status.order-status",
  ({ strapi }) => ({
    
    /**
     * sync shiprocket status
     * @param {*} ctx
     * @returns
     */
    async shiprocketWebhook(ctx) {
      const key = ctx.request.header["x-api-key"];
      const payload = ctx.request.body;

      if (key) {
        await strapi
          .service("api::order-status.order-status")
          .syncShiprocketWebhookEvent(payload);
        return ctx.send("ok");
      }

      return ctx.badRequest("Could not verify webhook.");
    },
  })
);
