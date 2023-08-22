module.exports = {
  routes: [
    {
      method: "POST",
      path: "/products/webhook",
      handler: "product.webhookEvent",
      config: {
        auth: false,
      },
    },
    {
      method: "POST",
      path: "/products/sync",
      handler: "product.sync",
    },
    {
      method: "POST",
      path: "/products/sync/:productId",
      handler: "product.syncOne",
    },
    {
      method: "POST",
      path: "/products/export",
      handler: "product.exportCSV",
    },
    {
      method: "POST",
      path: "/products/export/:id",
      handler: "product.exportPDF",
    },
  ],
};
