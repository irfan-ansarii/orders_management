module.exports = {
  async afterCreate(event) {
    const { result } = event;
    const context = strapi.requestContext.get();
    const { user, route } = context.state;
    const timeline = {
      user: user,
      ref: "products",
      refId: result.id.toString(),
      name: "Product Created.",
    };

    if (route.path === "/products/sync" || route.path === "/platforms") {
      timeline.user = null;
      timeline.name = "Product fetched.";
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
      ref: "products",
      refId: result.id.toString(),
      name: "Product updated.",
      color: "green",
    };

    if (route.path === "/products/sync/:productId") {
      timeline.name = "Product synced.";
    }
    if (route.path === "/products/sync/webhook") {
      timeline.user = null;
      timeline.name = "Product auto updated.";
    }

    await strapi.service("api::timeline.timeline").create({
      data: timeline,
    });
  },
};
