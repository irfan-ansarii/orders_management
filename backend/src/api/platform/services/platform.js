"use strict";
const Shopify = require("shopify-api-node");
const utils = require("@strapi/utils");
const { ApplicationError } = utils.errors;
/**
 * platform service
 */

const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService("api::platform.platform", ({ strapi }) => ({
  async findPlatform(param = "website") {
    const { url, apiKey } = await strapi.db
      .query("api::platform.platform")
      .findOne({
        where: {
          $or: [
            {
              id: { $eqi: param },
            },
            {
              name: { $eqi: param },
            },
          ],
        },
      });

    const shopify = new Shopify({
      shopName: url,
      accessToken: apiKey,
    });

    try {
      await shopify.shop.get();
      return shopify;
    } catch (err) {
      throw new ApplicationError("Invalid store URL or access token.");
    }
  },
}));
