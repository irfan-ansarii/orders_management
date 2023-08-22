"use strict";

/**
 * variant service
 */

const { createCoreService } = require("@strapi/strapi").factories;
/**
 * find variant
 * @param {*} id
 * @returns
 */
const findVariant = async (id) => {
  const response = await strapi.db.query("api::variant.variant").findOne({
    where: {
      variantId: id,
    },
  });
  return response;
};

module.exports = createCoreService("api::variant.variant", ({ strapi }) => ({
  /**
   * create product variant
   * @param {*} args
   * @returns
   */
  async createVariant(args) {
    const {
      barcode,
      sku,
      price,
      compare_at_price,
      id,
      title,
      option1,
      option2,
      option3,
      productId,
    } = args;

    const option = [option1, option2, option3].filter((op) => op !== null);

    const variant = {
      barcode,
      sku,
      price: compare_at_price || 0,
      salePrice: price,
      variantId: id.toString(),
      name: title,
      product: productId,
      option,
    };

    const entity = await findVariant(args.id);
    // if variant exists, update variant and return
    if (entity) {
      return await strapi.service("api::variant.variant").update(entity.id, {
        data: variant,
      });
    }

    // create a new variant
    return await strapi.service("api::variant.variant").create({
      data: variant,
    });
  },
}));
