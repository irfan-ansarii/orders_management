module.exports = {
  routes: [
    {
      method: "POST",
      path: "/shipment/webhook",
      handler: "order-status.shiprocketWebhook",
      config: {
        auth: false,
      },
    },
  ],
};
