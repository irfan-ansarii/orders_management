"use strict";

/**
 * line-item service
 */

const { createCoreService } = require("@strapi/strapi").factories;

/**
 * find line item
 * @param {*} id
 * @returns
 */

const findItem = async (id) => {
  return await strapi.db.query("api::line-item.line-item").findOne({
    where: {
      itemId: id,
    },
  });
};

module.exports = createCoreService(
  "api::line-item.line-item",
  ({ strapi }) => ({
    /**
     * create line items
     * @param {*} args
     * @returns
     */
    async createLineItem(args) {
      // find variant by id
      const entity = await findItem(args.id);

      const {
        title,
        variant_title,
        price,
        quantity,
        sku,
        variant_id,
        id,
        orderId,
        discount_allocations,
        tax_lines,
      } = args;

      const shopify = await strapi
        .service("api::platform.platform")
        .findPlatform();

      let productVariant = {};

      try {
        productVariant = await shopify.productVariant.get(variant_id);
      } catch (err) {
        console.log(
          "line item service line 57 line item varinat not found:",
          err
        );
      }

      const varinatEntity = await strapi.db
        .query("api::variant.variant")
        .findOne({
          where: { variantId: variant_id },
          populate: {
            product: true,
          },
        });

      const discount = discount_allocations?.reduce(
        (sum, line) => sum + parseFloat(line.amount),
        0
      );

      const tax = tax_lines.reduce(
        (sum, line) => sum + parseFloat(line.price),
        0
      );
      const item = {
        product: varinatEntity?.product?.id,
        variant: varinatEntity?.id,
        itemId: id.toString(),
        name: title,
        variantName:
          variant_title?.toLowerCase() === "default title"
            ? null
            : variant_title,
        tax,
        price: productVariant?.compare_at_price || 0,
        salePrice: price,
        discount: discount,
        quantity: quantity,
        sku,
        order: orderId,
      };

      if (entity) {
        return await strapi
          .service("api::line-item.line-item")
          .update(entity.id, {
            data: item,
          });
      }
      return await strapi.service("api::line-item.line-item").create({
        data: item,
      });
    },
  })
);
