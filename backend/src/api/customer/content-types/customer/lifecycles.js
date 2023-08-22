module.exports = {
  async afterCreate(event) {
    const { result } = event;
    const context = strapi.requestContext.get();
    const { user, route } = context.state;
    const timeline = {
      user: user,
      ref: "customers",
      refId: result.id.toString(),
      name: "Customer Created.",
      color: "green",
    };

    if (route.path === "/customers/sync" || route.path === "/platforms") {
      timeline.user = null;
      timeline.name = "Customer fetched from channel.";
    }

    await strapi.service("api::timeline.timeline").create({
      data: timeline,
    });
  },
  async afterUpdate(event) {
    const { result } = event;
    const context = strapi.requestContext.get();
    const { route, user } = context.state;

    const timeline = {
      user: user,
      ref: "customers",
      refId: result.id.toString(),
      name: "Customer details edited.",
      color: "green",
    };

    if (route.path === "/customers/sync/:customerId") {
      timeline.user = null;
      timeline.name = "Customer synced from channel.";
    }
    if (route.path === "/customers/sync/webhook") {
      timeline.user = null;
      timeline.name = "Customer auto updated from channel.";
    }

    await strapi.service("api::timeline.timeline").create({
      data: timeline,
    });
  },
};
