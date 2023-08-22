const axios = require("axios");

module.exports = {
  /**
   * update shiprocket token
   * runs every 6 hours
   */
  updateShiprocketToken: {
    task: async ({ strapi }) => {
      try {
        await strapi
          .service("api::setting.setting")
          .callShiprocketApi("/orders");
      } catch (error) {
        console.log("error:");
      }
    },
    options: {
      rule: "* * */6 * * *",
    },
  },

  /**
   * send scheduled messaged
   * runs every 10 minutes
   */
  sendScheduledMessages: {
    task: async ({ strapi }) => {
      await strapi.service("api::message.message").sendMessages();
    },
    options: {
      rule: "* */10 * * * *",
    },
  },
};
