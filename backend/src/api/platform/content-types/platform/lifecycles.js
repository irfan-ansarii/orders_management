const Shopify = require("shopify-api-node");
const utils = require("@strapi/utils");
const { ApplicationError } = utils.errors;

module.exports = {
  async beforeCreate(ctx) {
    const { data } = ctx.params;

    if (data.name.toLowerCase() === "website") {
      const shopify = new Shopify({
        shopName: data.url,
        accessToken: data.apiKey,
      });

      try {
        await shopify.shop.get();
      } catch (err) {
        throw new ApplicationError("Invalid store URL or access token.");
      }
    }
  },
  async afterCreate(ctx) {
    const { name, apiKey, url } = ctx.result;
    const URL = process.env.URL;
    const webhooks = [
      {
        address: `${URL}/api/orders/webhook`,
        topic: "orders/create",
      },
      {
        address: `${URL}/api/orders/webhook`,
        topic: "orders/updated",
      },
      {
        address: `${URL}/api/products/webhook`,
        topic: "products/create",
      },
      {
        address: `${URL}/api/products/webhook`,
        topic: "products/update",
      },
      {
        address: `${URL}/api/checkouts/webhook`,
        topic: "checkouts/create",
      },
      {
        address: `${URL}/api/checkouts/webhook`,
        topic: "checkouts/update",
      },
      {
        address: `${URL}/api/customers/webhook`,
        topic: "customers/create",
      },
      {
        address: `${URL}/api/customers/webhook`,
        topic: "customers/update",
      },
    ];

    const shopify = new Shopify({
      shopName: url,
      accessToken: apiKey,
    });

    if (name.toLowerCase() === "website") {
      for (const webhook of webhooks) {
        await shopify.webhook
          .create(webhook)
          .then((country) => console.log(country))
          .catch((err) => console.error(err));
      }

      syncResources(shopify);
    }
  },
};

const syncResources = async (shopify) => {
  await strapi.service("api::product.product").fetchProducts(shopify);
  await strapi.service("api::customer.customer").fetchCustomers(shopify);
  await strapi.service("api::checkout.checkout").fetchCheckouts(shopify);
  await strapi.service("api::order.order").fetchOrders(shopify);
};
