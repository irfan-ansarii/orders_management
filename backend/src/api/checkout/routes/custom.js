module.exports = {
  routes: [
    {
      method: "POST",
      path: "/checkouts/webhook",
      handler: "checkout.webhook",
      config: {
        auth: false,
      },
    },
    {
      method: "POST",
      path: "/checkouts/sync",
      handler: "checkout.sync",
    },
    {
      method: "POST",
      path: "/checkouts/sync/:token",
      handler: "checkout.syncOne",
    },
    {
      method: "POST",
      path: "/checkouts/export",
      handler: "checkout.exportCSV",
    },
    {
      method: "POST",
      path: "/checkouts/export/:id",
      handler: "checkout.exportPDF",
    },
  ],
};
