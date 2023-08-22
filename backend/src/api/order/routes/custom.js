module.exports = {
  routes: [
    // shopify webhook
    {
      method: "POST",
      path: "/orders/webhook",
      handler: "order.webhook",
      config: {
        auth: false,
      },
    },
    // sync all orders
    {
      method: "POST",
      path: "/orders/sync",
      handler: "order.sync",
    },
    // sync single order
    {
      method: "POST",
      path: "/orders/sync/:id",
      handler: "order.syncOne",
    },
    // order csv
    {
      method: "POST",
      path: "/orders/export",
      handler: "order.exportCSV",
    },
    // export pdf
    {
      method: "POST",
      path: "/orders/export/:id",
      handler: "order.exportPDF",
    },
    // export invoice
    {
      method: "POST",
      path: "/orders/invoice/:id",
      handler: "order.invoice",
    },
    // search order by name or awb
    {
      method: "GET",
      path: "/orders/track",
      handler: "order.track",
      config: {
        auth: false,
      },
    },
  ],
};
