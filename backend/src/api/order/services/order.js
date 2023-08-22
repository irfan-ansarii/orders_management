"use strict";

/**
 * order service
 */

const { createCoreService } = require("@strapi/strapi").factories;

/**
 * find order
 * @param {*} id
 * @returns
 */
const findOrder = async (orderId) => {
  const response = await strapi.db.query("api::order.order").findOne({
    where: { orderId },
    populate: true,
  });
  return response;
};

module.exports = createCoreService("api::order.order", ({ strapi }) => ({
  /**
   * sync orders
   * @param {*} shopify
   */
  async fetchOrders(shopify) {
    // if shopify is not defined get
    if (!shopify) {
      // get shopify instance or null
      shopify = await strapi.service("api::platform.platform").findPlatform();
    }

    let params = { limit: 50, order: "created_at ASC" };

    do {
      const orders = await shopify.order.list(params);

      if (!orders || orders.length == undefined) {
        throw new ApplicationError("Unable to sync orders from the channel.");
      }

      for (const order of orders) {
        // create new order

        await strapi
          .service("api::order.order")
          .createOrder({ ...order }, "create");
      }

      params = orders.nextPageParameters;
      // params = undefined;
    } while (params !== undefined);
  },

  async createOrder(args, action) {
    // find order by id
    const entity = await findOrder(args.id);

    // if order is already exists and action is create return order entity
    if (entity && action === "create") {
      return entity;
    }

    if (!entity && action === "update") {
      return;
    }

    const {
      name,
      id,
      created_at,
      cancelled_at,
      cancel_reason,
      total_line_items_price,
      total_discounts,
      total_tax,
      shipping_lines,
      total_price,
      total_outstanding,
      billing_address,
      shipping_address,
      discount_codes,
      customer,
      tax_lines,
      note,
      line_items,
      fulfillment_status,
      fulfillments,
    } = args;

    const shopify = await strapi
      .service("api::platform.platform")
      .findPlatform();

    let fulfillmentOrders = null;

    try {
      fulfillmentOrders = await shopify.order.fulfillmentOrders(id);
    } catch (err) {
      console.log("order service line 101 fulfillmentOrders not found:", err);
    }

    // calculate shipping total
    const shippingTotal = shipping_lines.reduce(
      (sum, line) => parseFloat(sum) + parseFloat(line.price),
      0
    );

    // get platform
    const platformEntity = await strapi.db
      .query("api::platform.platform")
      .findOne({
        where: { name: "website" },
      });

    // create or get customer
    let customerEntity = await strapi
      .service("api::customer.customer")
      .createCustomer(customer, "create");

    if (!customerEntity) {
      customerEntity = await strapi
        .service("api::customer.customer")
        .createCustomerFromAddress(args);
    }

    if (billing_address?.name) {
      billing_address.phone = strapi
        .service("api::customer.customer")
        .formatPhoneNumber(
          billing_address?.phone ||
            shipping_address?.phone ||
            customerEntity?.phone,
          billing_address.country_code
        );
    }

    if (shipping_address?.name) {
      shipping_address.phone = strapi
        .service("api::customer.customer")
        .formatPhoneNumber(
          shipping_address?.phone ||
            billing_address?.phone ||
            customerEntity?.phone,
          shipping_address.country_code
        );
    }

    const order = {
      name,
      fulfillmentOrders,
      orderId: id.toString(),
      cancelledAt: cancelled_at,
      cancelReason: cancel_reason,
      orderDate: created_at,
      type: "new",
      subtotal: total_line_items_price,
      discountTotal: total_discounts,
      taxTotal: total_tax,
      shippingTotal,
      total:
        parseFloat(total_outstanding) > 0 ? total_outstanding : total_price,
      outstandingTotal: total_outstanding,
      paymentMode: parseFloat(total_outstanding) > 0 ? "cod" : "prepaid",
      remittance: null,
      platform: platformEntity.id || null,
      customer: customerEntity.id,
      billingAddress: billing_address,
      shippingAddress: shipping_address,
      discountCodes: discount_codes,
      taxLines: tax_lines,
      note,
    };

    let orderEntity = {};

    // if order already exists, update and return
    if (entity) {
      orderEntity = await strapi
        .service("api::order.order")
        .update(entity.id, { data: order });
    } else {
      orderEntity = await strapi
        .service("api::order.order")
        .create({ data: order });
    }

    orderEntity.lineItems = [];

    if (line_items && line_items.length > 0) {
      // create line items

      for (const line_item of line_items) {
        const item = { ...line_item, orderId: orderEntity.id };
        const lineItem = await strapi
          .service("api::line-item.line-item")
          .createLineItem(item);

        orderEntity.lineItems.push(lineItem);
      }
    }

    // create order status
    if (fulfillment_status !== null) {
      const tracking = [];
      for (const fulfillment of fulfillments) {
        const {
          tracking_company,
          shipment_status,
          tracking_number,
          updated_at,
          created_at,
          id,
        } = fulfillment;
        const statusData = {
          tracking_company,
          shipment_status,
          tracking_number,
          updated_at,
          created_at,
          orderId: orderEntity.id,
          fulfillmentId: id.toString(),
        };

        const statusResponse = await strapi
          .service("api::order-status.order-status")
          .createStatus(statusData);

        tracking.push(statusResponse);
      }
    }

    return orderEntity;
  },
}));
