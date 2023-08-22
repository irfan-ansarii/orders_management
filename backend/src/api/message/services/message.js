"use strict";

/**
 * message service
 */

const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService("api::message.message", ({ strapi }) => ({
  async scheduleMesssage(args) {
    const {
      phone,
      templateName,
      bodyValues,
      buttonValues,
      ref,
      refId,
      name,
      sendAt,
    } = args;

    const firstSpaceIndex = phone.indexOf(" ");

    const countryCode = phone.substring(0, firstSpaceIndex);

    const phoneNumber = phone.substring(firstSpaceIndex + 1).replace(/\s/g, "");

    const MESSAGE_TEMPLATE = {
      countryCode,
      phoneNumber,
      type: "Template",
      template: {
        name: templateName,
        languageCode: "en",
        bodyValues: bodyValues,
        buttonValues: buttonValues.reduce((acc, btn, index) => {
          acc[index] = [btn];
          return acc;
        }, {}),
      },
    };

    const messageData = {
      ref,
      refId,
      name,
      status: "scheduled",
      sendAt,
      template: MESSAGE_TEMPLATE,
    };

    return await strapi.entityService.create("api::message.message", {
      data: messageData,
    });
  },

  /**
   * send scheduled messages
   */
  async sendMessages() {
    let page = 1;
    let pageCount;

    do {
      const { results, pagination } = await strapi
        .service("api::message.message")
        .find({
          filters: {
            $and: [
              {
                status: "scheduled",
              },
              {
                sendAt: { $lte: new Date() },
              },
            ],
          },
          pagination: { page, pageSize: 30 },
        });

      await strapi
        .service("api::message.message")
        .sendMessagesWithThrottle(results);
      pageCount = pagination.pageCount;
      page++;
    } while (page <= pageCount);
  },

  /**
   * send 30 messages per minute
   * @param {*} results
   */
  async sendMessagesWithThrottle(results) {
    const messagesPerMinute = 30;
    const interval = (60 * 1000) / messagesPerMinute;

    for (const result of results) {
      try {
        const res = await strapi
          .service("api::setting.setting")
          .interaktSend(result.template);

        await strapi.service("api::message.message").update(result.id, {
          data: { status: "sent", description: res?.data?.message },
        });
      } catch (err) {
        await strapi.service("api::message.message").update(result.id, {
          data: {
            status: "failed",
            description: err?.response?.data?.message,
            sendAt: null,
          },
        });
      }

      await new Promise((resolve) => setTimeout(resolve, interval));
    }
  },
}));
