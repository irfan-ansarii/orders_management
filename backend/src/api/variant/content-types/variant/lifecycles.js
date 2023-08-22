module.exports = {
  async beforeUpdate(event) {
    const { data, where } = event.params;
    const context = strapi.requestContext.get();
    const variant = await strapi
      .service("api::variant.variant")
      .findOne(where.id);

    console.log("context:", context.state);
  },
};
