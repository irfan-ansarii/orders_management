module.exports = {
  async afterCreate(event) {
    const { result } = event;

    const timeline = {
      ref: "checkouts",
      refId: result.id.toString(),
      name: "Checkout fetched.",
    };

    await strapi.entityService.create("api::timeline.timeline", {
      data: timeline,
    });

    if (result.isRecovered || result.recoveredAt) {
      return;
    }

    // check if all items are on sale
    const isAllSaleItem = result.lineItems.every(
      (item) => item.price > item.sale_price
    );

    const customerName = result.shippingAddress.first_name;
    const recoveryTemplate = {};

    if (isAllSaleItem) {
      recoveryTemplate.name = "abandoned_checkout_gift";
      recoveryTemplate.bodyValues = [customerName];
    } else {
      recoveryTemplate.name = "abandoned_checkout_coupon";
      if (result.discountTotal > 0) {
        recoveryTemplate.bodyValues = [customerName, "a 15% off", "GET15"];
      } else {
        recoveryTemplate.bodyValues = [customerName, "a 10% off", "OFFER10"];
      }
    }

    const currentDate = new Date();
    const recoverySendAt = new Date(currentDate.getTime() + 20 * 60000);
    const assistanceSendAt = new Date(currentDate.getTime() + 30 * 60000);

    const messages = [
      {
        ref: "checkouts",
        refId: result.id.toString(),
        name: "Recovery message.",
        templateName: recoveryTemplate.name,
        bodyValues: recoveryTemplate.bodyValues,
        buttonValues: [`${result.checkoutURL}&utm_source=whatsapp`],
        sendAt: recoverySendAt,
        phone: result?.billingAddress?.phone || result?.shippingAddress?.phone,
      },
      {
        ref: "checkouts",
        refId: result.id.toString(),
        name: "Assistance message.",
        templateName: "checkout_assistance",
        bodyValues: [result.shippingAddress.first_name, "Rukmini"],
        buttonValues: [],
        sendAt: assistanceSendAt,
        phone: result?.billingAddress?.phone || result?.shippingAddress?.phone,
      },
    ];

    for (const message of messages) {
      await strapi.service("api::message.message").scheduleMesssage(message);
    }
  },

  async afterUpdate(event) {
    const { result } = event;

    // if checkout is recovered and message is scheduled
    // cancel the message
    if (result.isRecovered || result.recoveredAt) {
      // find scheduled messages
      const { results } = await strapi.service("api::message.message").find({
        filters: {
          $and: [
            {
              ref: "checkouts",
            },
            { refId: result.id },
            { status: "scheduled" },
          ],
        },
      });

      for (const res of results) {
        await strapi.service("api::message.message").update(res.id, {
          data: {
            status: "cancelled",
            description: "Message cancelled as checkout has recovered.",
            sendAt: null,
          },
        });
      }
    }
  },
};
