module.exports = {
  async beforeUpdate(event) {
    const { data } = event.params;
    const { where } = event.params;
    const entity = await strapi.service("api::order.order").findOne(where.id);
    if (!entity.cancelledAt && data?.cancelledAt && entity.orderId) {
      await strapi
        .service("api::order-status.order-status")
        .cancelShopifyOrder({ orderId: entity.orderId, ...data, ...where });
    }
  },
  async afterCreate(event) {
    const { result } = event;
    const context = strapi.requestContext.get();
    const { route, user } = context.state;

    const timeline = {
      user: user,
      ref: "orders",
      refId: result.id.toString(),
      name: "Order Created",
    };
    const fetchRoutes = ["/orders/webhook", "/orders/sync", "/platforms"];
    if (fetchRoutes.includes(route.path)) {
      timeline.user = null;
      timeline.name = "Order fetched";
    }

    await strapi.entityService.create("api::timeline.timeline", {
      data: timeline,
    });
  },

  async afterUpdate(event) {
    const { result } = event;
    const context = strapi.requestContext.get();
    const { route, user } = context.state;

    const timeline = {
      user: user,
      ref: "orders",
      refId: result.id.toString(),
      name: result.cancelledAt ? "Cancelled" : "Order updated.",
    };

    const skipConditions = [
      "/order-statuses",
      "/orders/webhook",
      "/shipment/webhook",
    ];

    if (skipConditions.includes(route.path)) {
      return;
    }

    if (route.path === "/orders/sync/:orderId") {
      timeline.name = "Order synced.";
    }

    await strapi.entityService.create("api::timeline.timeline", {
      data: timeline,
    });
  },
};
