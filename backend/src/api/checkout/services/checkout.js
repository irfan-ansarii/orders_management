"use strict";
const utils = require("@strapi/utils");
const { ApplicationError } = utils.errors;
/**
 * checkout service
 */

const { createCoreService } = require("@strapi/strapi").factories;

/**
 * find checkout by id or email
 * @param {*} id
 * @returns
 */
const findCheckout = async (id) => {
  return await strapi.db.query("api::checkout.checkout").findOne({
    where: { checkoutId: id },
  });
};

module.exports = createCoreService("api::checkout.checkout", ({ strapi }) => ({
  /**
   * sync checkouts
   * @param {*} shopify
   */
  async fetchCheckouts(shopify) {
    // if shopify is not defined return immediately
    if (!shopify) {
      // get shopify instance or null
      shopify = await strapi.service("api::platform.platform").findPlatform();
    }

    let params = { limit: 50 };
    do {
      const checkouts = await shopify.checkout.list(params);

      if (!checkouts || checkouts.length == undefined) {
        throw new ApplicationError("Unable to sync data from the channel.");
      }

      for (const checkout of checkouts) {
        // create new checkout
        await strapi
          .service("api::checkout.checkout")
          .createCheckout(checkout, "create");
      }
      params = checkouts.nextPageParameters;
    } while (params !== undefined);
  },

  /**
   * create checkout
   * @param {*} args
   * @returns
   */
  async createCheckout(args, action) {
    let checkoutEntry = await findCheckout(args.id);

    if (checkoutEntry && action === "create") {
      return checkoutEntry;
    }
    if (!checkoutEntry && action === "update") {
      checkoutEntry = await findCheckout(args.id);
    }

    let {
      id,
      token,
      billing_address,
      shipping_address,
      total_line_items_price,
      line_items,
      total_discounts,
      total_tax,
      total_price,
      shipping_lines,
      note,
      discount_codes,
      tax_lines,
      abandoned_checkout_url,
      completed_at,
      customer,
    } = args;

    let customerEntity = null;

    if (customer) {
      customerEntity = await strapi
        .service("api::customer.customer")
        .createCustomer(customer, "create");
    }

    if (shipping_address?.phone) {
      shipping_address.phone = strapi
        .service("api::customer.customer")
        .formatPhoneNumber(
          shipping_address?.phone,
          shipping_address.country_code
        );
    } else if (customerEntity && !shipping_address?.phone) {
      shipping_address = customerEntity.defaultAddress;
    }

    if (billing_address?.phone) {
      billing_address.phone = strapi
        .service("api::customer.customer")
        .formatPhoneNumber(
          billing_address?.phone,
          billing_address.country_code
        );
    } else if (customerEntity && !billing_address?.phone) {
      billing_address = customerEntity.defaultAddress;
    }

    if (!shipping_address?.phone) {
      return;
    }
    // calculate shipping charges
    const shippingTotal = shipping_lines.reduce(
      (sum, line) => sum + parseFloat(line.price),
      0
    );

    // organize checkout data
    const checkout = {
      checkoutId: id.toString(),
      token,
      billingAddress: billing_address,
      shippingAddress: shipping_address,
      subtotal: total_line_items_price,
      discountTotal: total_discounts,
      taxTotal: total_tax,
      shippingTotal,
      total: total_price,
      note,
      discountCodes: discount_codes,
      taxLines: tax_lines,
      checkoutURL: abandoned_checkout_url,
      recoveredAt: completed_at,
      isRecovered: completed_at ? true : false,
      customer: customerEntity?.id,
    };

    const lineItems = [];
    for (const line_item of line_items) {
      lineItems.push({
        ...line_item,
        price: line_item.compare_at_price || line_item.price,
        sale_price: line_item.price,
      });
    }
    checkout.lineItems = lineItems;

    // if checkout exists, update and return
    if (checkoutEntry !== null) {
      return await strapi
        .service("api::checkout.checkout")
        .update(checkoutEntry.id, {
          data: checkout,
        });
    }

    if (checkoutEntry && completed_at) {
      const timeline = {
        ref: "checkouts",
        refId: checkoutEntry.id.toString(),
        name: "Recovered.",
      };
      await strapi.entityService.create("api::timeline.timeline", {
        data: timeline,
      });
    }

    // create checkout
    return await strapi.service("api::checkout.checkout").create({
      data: checkout,
    });
  },

  /**
   * recover checkout
   * @param {*} token
   * @returns
   */
  async recoverCheckout(args) {
    const { token, created_at } = args;
    const entity = strapi.db.query("api::checkout.checkout").findOne({
      where: { token: token },
      populate: true,
    });

    const checkout = { isRecovered: true, recoveredAt: new Date(created_at) };

    if (entity) {
      return await strapi
        .service("api::checkout.checkout")
        .update(entity.id, { data: checkout });
    }
  },
}));
