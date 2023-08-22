"use strict";
const { default: axios } = require("axios");
/**
 * order-status service
 */

const findStatusWithFulfillment = async (orderId) => {
  return await strapi.db.query("api::order-status.order-status").findOne({
    where: {
      $and: [{ order: { id: orderId } }, { fulfillmentId: { $notNull: true } }],
    },
    populate: true,
  });
};
const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService(
  "api::order-status.order-status",
  ({ strapi }) => ({
    /**
     * create sstatus
     * @param {*} args
     * @returns
     */
    async createStatus(args) {
      const {
        tracking_company,
        shipment_status,
        tracking_number,
        updated_at,
        created_at,
        estimated_delivery_at,
        fulfillmentId,
        orderId,
      } = args;

      if (!orderId) return;
      // create default args object
      let currentStatus = {
        name: shipment_status,
        fulfillmentId,
        order: orderId,
        company: tracking_company,
        trackingNumber: tracking_number,
        edd: estimated_delivery_at,
        happenedAt: new Date(created_at),
      };

      switch (currentStatus.name) {
        case "label_printed":
        case "label_purchased":
        case "ready_for_pickup":
          currentStatus = { ...currentStatus, name: "packed" };
          break;

        case "in_transit":
          currentStatus = {
            ...currentStatus,
            happenedAt: new Date(updated_at),
          };
          break;

        case "attempted_delivery":
          currentStatus = {
            ...currentStatus,
            name: "undelivered",
            happenedAt: new Date(updated_at),
          };

          break;
        case "delivered":
          currentStatus = {
            ...currentStatus,
            happenedAt: new Date(updated_at),
          };
          break;
        case "failure":
          currentStatus = {
            ...currentStatus,
            name: "rto_initiated",
            happenedAt: new Date(updated_at),
          };
          break;
        default:
          break;
      }

      return await strapi
        .service("api::order-status.order-status")
        .create({ data: currentStatus });
    },

    /**
     * extend create service to check if status already exist
     * @param {*} params
     * @returns
     */
    async create(params) {
      const { name, order } = params.data;
      if (!name || !order) return;
      let entity = await strapi.db
        .query("api::order-status.order-status")
        .findOne({
          where: {
            $and: [{ name }, { order: { id: order } }],
          },
          populate: true,
        });

      if (!entity?.id) {
        return await super.create(params);
      }
      return await strapi
        .service("api::order.order")
        .update(order, { data: { currentStatus: entity.id } });
    },

    /**
     * track shipment aby awb number
     * @param {*} awb
     */
    async syncShipmentStatus({ awb, order }) {
      const result = await strapi
        .service("api::setting.setting")
        .callShiprocketApi(`/courier/track/awb/${awb}`);

      if (result.status !== 200) return;

      if (result.data.tracking_data.track_status == 0) return;

      const shipment = {
        ...result.data.tracking_data.shipment_track[0],
        date: result.data.tracking_data.shipment_track_activities[0].date,
      };
      await strapi
        .service("api::order-status.order-status")
        .createOrUpdateStatus({
          shipment,
          order,
        });

      return "ok";
    },

    /**
     * shiprocket tracking webhook event
     * @param {*} event
     * @returns
     */
    async syncShiprocketWebhookEvent(event) {
      const { awb, current_status, etd, courier_name, current_timestamp } =
        event;

      const shipment = {
        awb_code: awb,
        current_status,
        edd: etd,
        courier_name,
        date: current_timestamp,
      };

      const order = await strapi.db.query("api::order.order").findOne({
        where: { tracking: { trackingNumber: awb } },
        populate: true,
      });

      if (order && shipment) {
        await strapi
          .service("api::order-status.order-status")
          .createOrUpdateStatus({
            shipment,
            order,
          });
      }
      return "ok";
    },

    /**
     * create or update status
     * @param {*} params
     * @returns
     */
    async createOrUpdateStatus({ shipment, order }) {
      const { awb_code, current_status, edd, courier_name, date } = shipment;

      const dateString = date?.replace(" ", "T");
      const eddString = edd?.replace(" ", "T");

      if (current_status == "Canceled") {
        return await strapi.db.query("api::order-status.order-status").delete({
          where: { order: order.id },
        });
      }

      let statusToUpdate = "";

      switch (current_status?.toLowerCase()) {
        case "pickup booked":
        case "pickup generated":
          statusToUpdate =
            order.type === "return" ? "return_initiated" : "packed";
          break;
        case "out for pickup":
          statusToUpdate =
            order.type === "return" ? "out_for_pickup" : "packed";
          break;
        case "pickup rescheduled":
        case "pickup error":
        case "pickup exception":
          statusToUpdate =
            order.type === "return" ? "return_rescheduled" : "packed";
          break;
        case "in transit":
        case "picked up":
        case "shipped":
        case "reached at destication hub":
          statusToUpdate = "in_transit";
          break;
        case "out for delivery":
          statusToUpdate =
            order.type === "return" ? "in_transit" : "out_for_delivery";
          break;
        case "undelivered":
          statusToUpdate =
            order.type === "return" ? "in_transit" : "undelivered";
          break;
        case "delivered":
          statusToUpdate = "delivered";
          break;
        case "rto initiated":
          statusToUpdate = "rto_initiated";
          break;
        case "rto in intransit":
        case "rto_ofd":
          statusToUpdate = "rto_in_transit";
          break;
        // case "rto delivered":
        //   statusToUpdate = "rto_delivered";
        //   break;
        case "misrouted":
        case "rto_ndr":
        case "disposed off":
        case "damaged":
        case "destroyed":
          statusToUpdate = "dispute";
          break;
        case "lost":
          statusToUpdate = "lost";
          break;
      }
      const data = {
        order: order.id,
        name: statusToUpdate,
        trackingNumber: awb_code,
        happenedAt: new Date(dateString),
        edd: new Date(eddString),
        company: courier_name,
      };

      return await strapi
        .service("api::order-status.order-status")
        .create({ data });
    },

    /**
     * create shopify fulfillment
     * @param {*} status
     * @returns
     */
    async createShopifyFulfillment(params) {
      const { order, company, trackingNumber, name, fulfillmentId } = params;

      if (fulfillmentId) {
        return fulfillmentId;
      }

      if (!name || name == "confirmed" || !trackingNumber) {
        return;
      }

      const { orderId, fulfillmentOrders } = await strapi
        .service("api::order.order")
        .findOne(order);

      if (!orderId) return null;

      // find fulfillment from statuses
      const statusEntity = await findStatusWithFulfillment(order);

      if (statusEntity?.fulfillmentId) {
        return statusEntity?.fulfillmentId;
      }

      // create shopify instance
      const shopify = await strapi
        .service("api::platform.platform")
        .findPlatform();

      const fulfillmentDataArray = fulfillmentOrders.reduce((acc, f) => {
        if (f.supported_actions.includes("create_fulfillment")) {
          acc.push({ fulfillment_order_id: f.id });
        }
        return acc;
      }, []);

      try {
        const fulfillmentResponse = await shopify.fulfillment.createV2({
          line_items_by_fulfillment_order: fulfillmentDataArray,
          tracking_info: {
            company,
            number: trackingNumber,
          },
        });

        return fulfillmentResponse?.id;
      } catch (err) {
        console.log(
          "order status service line 318 - fulfillment create error",
          err
        );
      }

      return null;
    },

    /**
     * create shopify fulfillment event
     * @param {*} params
     * @returns
     */
    async createShopifyFulfillmentEvent(params) {
      const { fulfillmentId, name, edd, order } = params;

      const statusConditions = [
        "packed",
        "in_transit",
        "out_for_delivery",
        "delivered",
        "undelivered",
        "rto_initiated",
        "rto_in_transit",
        "rto_delivered",
      ];

      if (!statusConditions.includes(name) || !order.orderId) {
        return null;
      }

      // create shopify instance
      const shopify = await strapi
        .service("api::platform.platform")
        .findPlatform();

      let statusToUpdate = name;

      switch (name) {
        case "packed":
          statusToUpdate = "ready_for_pickup";
          break;
        case "undelivered":
          statusToUpdate = "attempted_delivery";
          break;
        case "rto_initiated":
        case "rto_in_transit":
        case "rto_delivered":
          statusToUpdate = "failure";
          break;
        default:
          break;
      }
      try {
        return await shopify.fulfillmentEvent.create(
          order.orderId,
          fulfillmentId,
          {
            status: statusToUpdate,
            estimated_delivery_at: edd,
          }
        );
      } catch (err) {
        console.log("order status line 373", err);
      }
      return;
    },
    /**
     * cancel order on shopify
     * @param {*} params
     * @returns
     */
    async cancelShopifyOrder(params) {
      // create shopify instance
      const shopify = await strapi
        .service("api::platform.platform")
        .findPlatform();

      try {
        return await shopify.order.cancel(params.orderId);
      } catch (err) {
        console.log("error cancelling order on shopify", err);
      }
    },
  })
);
