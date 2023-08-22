module.exports = {
  async beforeCreate(event) {
    const { data } = event.params;

    const response = await strapi
      .service("api::order-status.order-status")
      .createShopifyFulfillment(data);
    data.fulfillmentId = response;
  },

  async afterCreate(event) {
    const { result } = event;
    const context = strapi.requestContext.get();
    const { user } = context.state;

    const statusResponse = await strapi
      .service("api::order-status.order-status")
      .findOne(result.id, {
        populate: "*",
      });

    const { order, name } = statusResponse;

    await strapi.service("api::order.order").update(order.id, {
      data: { currentStatus: statusResponse.id },
    });

    // update timeline
    const timeline = {
      user: user,
      ref: "orders",
      refId: order.id.toString(),
      name: `${name[0].toUpperCase()}${name.slice(1)}`.replace(/_/g, " "),
    };

    await strapi.entityService.create("api::timeline.timeline", {
      data: timeline,
    });
    // update timeline

    // update event on shopify
    await strapi
      .service("api::order-status.order-status")
      .createShopifyFulfillmentEvent(statusResponse);

    const conditions = ["packed", "rto_delivered", "returned"];
    if (!conditions.includes(name)) {
      return;
    }

    // get order with line items and tracking
    const orderResponse = await strapi
      .service("api::order.order")
      .findOne(order.id, {
        populate: {
          lineItems: {
            populate: {
              product: true,
              variant: true,
            },
          },
          tracking: true,
        },
      });

    // loop through each line items
    for (const lineItem of orderResponse.lineItems) {
      const productId = lineItem.product?.id;
      const variantId = lineItem.variant?.id;
      const lineQty = Number(lineItem.quantity);
      const currentStockQty = Number(lineItem.variant?.stock);
      let newSoldQty = Number(lineItem.variant?.sold);
      let newStockQty = Number(lineItem.variant?.stock);

      if (name === "packed") {
        newSoldQty += lineQty;
        newStockQty -= lineQty;
      }
      if (name === "rto_delivered" || name === "returned") {
        newSoldQty -= lineQty;
        newStockQty += lineQty;
      }

      //   adjust stock and sold quantity
      if (variantId) {
        await strapi.service("api::variant.variant").update(variantId, {
          data: {
            stock: newStockQty,
            sold: newSoldQty,
          },
        });
      }

      //   create product timeline
      if (productId) {
        const timeline = {
          ref: "products",
          refId: productId.toString(),
          name: `Stock adjustment.`,
          description: `Order ID: ${orderResponse.name} (${lineItem?.variant?.name})`,
          quantity: currentStockQty > newStockQty ? -lineQty : lineQty,
        };
        await strapi.entityService.create("api::timeline.timeline", {
          data: timeline,
        });
      }
    }
  },
};
