module.exports = {
  routes: [
    {
      method: "POST",
      path: "/customers/webhook",
      handler: "customer.webhookEvent",
      config: {
        auth: false,
      },
    },
    {
      method: "POST",
      path: "/customers/sync",
      handler: "customer.sync",
    },
    {
      method: "POST",
      path: "/customers/sync/:customerId",
      handler: "customer.syncOne",
    },
    {
      method: "POST",
      path: "/customers/message",
      handler: "customer.sendMessages",
    },
    {
      method: "POST",
      path: "/customers/email",
      handler: "customer.sendEmails",
    },
    {
      method: "POST",
      path: "/customers/message/:id",
      handler: "customer.sendMessage",
    },
    {
      method: "POST",
      path: "/customers/email/:id",
      handler: "customer.sendEmail",
    },
    {
      method: "POST",
      path: "/customers/export",
      handler: "customer.exportCSV",
    },
  ],
};
