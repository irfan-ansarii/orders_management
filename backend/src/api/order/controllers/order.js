"use strict";
const { sanitize } = require("@strapi/utils");
const { contentAPI } = sanitize;
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const csvWriter = createCsvWriter({
  path: "public/files/orders/orders.csv",
  header: [
    { id: "id", title: "ID" },
    { id: "platform", title: "PLATFORM" },
    { id: "orderId", title: "ORDER ID" },
    { id: "date", title: "ORDER DATE" },
    { id: "type", title: "ORDER TYPE" },
    { id: "address", title: "SHIPPING ADDRESS" },
    { id: "phone", title: "PHONE" },
    { id: "email", title: "EMAIL" },
    { id: "items", title: "ITEMS" },
    { id: "note", title: "NOTE" },
    { id: "subtotal", title: "SUBTOTAL" },
    { id: "discount", title: "DISCOUNT" },
    { id: "discountCodes", title: "DISCOUNT CODES" },
    { id: "tax", title: "TAX" },
    { id: "shipping", title: "SHIPPING" },
    { id: "courier", title: "COURIER CHARGE" },
    { id: "outstanding", title: "OUTSTANDING" },
    { id: "total", title: "TOTAL" },
    { id: "paymentMode", title: "PAYMENT MODE" },
    { id: "status", title: "STATUS" },
  ],
});
/**
 * order controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::order.order", ({ strapi }) => ({
  /**
   * create order
   * @param {*} ctx
   * @returns
   */
  async create(ctx) {
    const { lineItems } = ctx.request.body.data || [];
    const { customer } = ctx.request.body.data;

    if (!customer) {
      const { shippingAddress } = ctx.request.body.data;
      let customerEntity = await strapi.db
        .query("api::customer.customer")
        .findOne({
          where: {
            $or: [
              {
                email: shippingAddress.email,
              },
              {
                phone: { $contains: shippingAddress.phone },
              },
            ],
          },
        });

      if (customerEntity === null) {
        customerEntity = await strapi.service("api::customer.customer").create({
          data: {
            ...shippingAddress,
            defaultAddress: shippingAddress,
          },
        });
      }

      ctx.request.body.data.customer = customerEntity.id;
    }

    if (lineItems) delete ctx.request.body.data.lineItems;
    const { data, meta } = await super.create(ctx);

    data.attributes.lineItems = [];
    for (let i = 0; i < lineItems.length; i++) {
      const response = await strapi.service("api::line-item.line-item").create({
        data: { ...lineItems[i], order: data.id },
      });
      data.attributes.lineItems.push(response);
    }

    return { data, meta };
  },

  /**
   * update order
   * @param {*} ctx
   * @returns
   */
  async update(ctx) {
    const { lineItems, id } = ctx.request.body.data;

    const { cancelledAt } = await strapi
      .service("api::order.order")
      .findOne(id, {
        populate: "*",
      });

    if (cancelledAt) {
      return ctx.badRequest("Cancelled order cannot be updated.");
    }

    if (lineItems) delete ctx.request.body.data.lineItems;

    const { data, meta } = await super.update(ctx);

    const { results } = await strapi.service("api::line-item.line-item").find({
      filters: { order: { id: id } },
      populate: "*",
    });

    // return if line items are not present
    if (!lineItems || !Array.isArray(lineItems)) {
      return { data, meta };
    }

    for (const item of lineItems) {
      // update line item if exists

      const index = results.findIndex((result) => result.id === item.value);
      let response = null;

      if (index !== -1) {
        //update if already exists
        response = await strapi
          .service("api::line-item.line-item")
          .update(item.value, {
            data: { ...item, order: id },
          });
      } else {
        // create if not found

        response = await strapi.service("api::line-item.line-item").create({
          data: { ...item, order: id },
        });
      }

      // append line items to response
      data.attributes.lineItems = [
        ...(data.attributes.lineItems || []),
        response,
      ];
    }

    // delete line items which are not linked
    for (const result of results) {
      const index = lineItems.findIndex((item) => item.value === result.id);
      if (index === -1) {
        await strapi.service("api::line-item.line-item").delete(result.id);
      }
    }

    return { data, meta };
  },

  /**
   * post method to handle webhook events
   * @param {*} ctx // payload
   */
  async webhook(ctx) {
    const topic = ctx.request.header["x-shopify-topic"];
    const payload = ctx.request.body;

    if (topic == "orders/create") {
      await strapi.service("api::order.order").createOrder(payload);
      return ctx.send("ok");
    } else if (topic == "orders/updated") {
      await strapi.service("api::order.order").createOrder(payload, "update");
      return ctx.send("ok");
    }

    return ctx.badRequest("Could not verify webhook.");
  },

  /**
   * POST method to sync the orders
   * @param {*} ctx
   * @returns
   */
  async sync(ctx) {
    await strapi.service("api::order.order").fetchOrders();
    return ctx.send({ message: "Order syncing has been completed." });
  },

  /**
   * POST method to sync the single order
   * @param {*} ctx
   * @returns
   */
  async syncOne(ctx) {
    const { id } = ctx.params;

    const entity = await strapi.service("api::order.order").findOne(id, {
      populate: "*",
    });

    const { currentStatus, cancelledAt } = entity;

    if (cancelledAt) {
      return ctx.badRequest("Cancelled order cannot be synced.");
    }

    if (currentStatus?.trackingNumber)
      await strapi
        .service("api::order-status.order-status")
        .syncShipmentStatus({
          awb: currentStatus?.trackingNumber,
          order: entity,
        });

    return ctx.send({ message: "Order syncing has been completed." });
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
        .service("api::order.order")
        .find(sanitizedQueryParams);

      results.forEach((order) => {
        records.push({
          id: order.id,
          platform: order.platform.name,
          orderId: order.name,
          date: order.orderDate,
          type: order.type,
          address: `${order.shippingAddress.name} ${order.shippingAddress.address1} ${order.shippingAddress.address2} ${order.shippingAddress.city} ${order.shippingAddress.province} ${order.shippingAddress.country}`,
          phone:
            order.shippingAddress.phone ||
            order.billingAddress.phone ||
            order.customer.phone,
          email: order.customer.email,
          items: order.lineItems
            .map((item, i) => `${i + 1}) ${item.name}`)
            .join(", "),
          note: order.note,
          subtotal: order.subtotal,
          discount: order.discountTotal,
          discountCodes: order.discountCodes
            ?.map((code) => code.code)
            .join(", "),
          tax: order.taxTotal,
          shipping: order.shippingTotal,
          courier: order.shippingCharge,
          outstanding: order.outstandingTotal,
          total: order.total,
          paymentMode: order.paymentMode,
          status: order.tracking?.[0] || "Processing",
        });
      });

      if (ctx.query.pagination.page < pagination.pageCount) {
        ctx.query.pagination.page += 1;
      } else {
        ctx.query.pagination.page = undefined;
      }
    } while (ctx.query.pagination.page !== undefined);

    csvWriter.writeRecords(records);

    return ctx.send({ fileUrl: "/files/orders/orders.csv" });
  },

  /**
   * export single order as pdf
   * @param {*} ctx
   */
  async exportPDF(ctx) {
    return ctx.send({ fileUrl: "/files/order.pdf" });
  },

  /**
   * create invoice
   * @param {*} ctx
   * @returns
   */

  async invoice(ctx) {
    const { id } = ctx.params;
    return ctx.send({ fileUrl: `/files/${id}.csv` });
  },

  /**
   * track order for customers
   * @param {*} ctx
   * @returns
   */
  async track(ctx) {
    ctx.query.populate = [
      "lineItems.product.image",
      "currentStatus",
      "tracking",
    ];
    const { results, pagination } = await strapi
      .service("api::order.order")
      .find(ctx.query);

    return this.transformResponse(results, { pagination });
  },
}));
