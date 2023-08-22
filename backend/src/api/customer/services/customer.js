"use strict";
const parsePhoneNumber = require("libphonenumber-js");
const utils = require("@strapi/utils");
const { ApplicationError } = utils.errors;
/**
 * customer service
 */

const { createCoreService } = require("@strapi/strapi").factories;

/**
 * format data
 * @param {*} data
 * @returns
 */
const getFormattedData = (data) => {
  // parse phone number
  data.phone = strapi
    .service("api::customer.customer")
    .formatPhoneNumber(data.phone, data.defaultAddress?.country_code);

  // parse default address phone number
  if (data.defaultAddress) {
    data.defaultAddress.phone = strapi
      .service("api::customer.customer")
      .formatPhoneNumber(
        data.defaultAddress.phone,
        data.defaultAddress?.country_code
      );
  }

  // parse addresses phone number
  if (data.addresses && data.addresses.length) {
    for (let i = 0; i < data.addresses.length; i++) {
      data.addresses[i].phone = strapi
        .service("api::customer.customer")
        .formatPhoneNumber(
          data.addresses[i].phone,
          data.addresses[i].country_code || data.defaultAddress?.country_code
        );
    }
  }

  return data;
};

/**
 * check if customer exists
 * @param {*} param
 * @returns
 */
const findCustomer = async ({ id, email, phone }) => {
  const response = await strapi.db.query("api::customer.customer").findOne({
    where: {
      $or: [
        {
          customerId: id,
        },
        {
          email,
        },
        {
          phone: { $contains: phone },
        },
      ],
    },
  });
  return response;
};

/**
 *  create strapi core service
 */

module.exports = createCoreService("api::customer.customer", ({ strapi }) => ({
  /**
   * fetch customers
   * @param {*} shopify
   */
  async fetchCustomers(shopify) {
    // if shopify is not defined return immediately
    if (!shopify) {
      // get shopify instance or null
      shopify = await strapi.service("api::platform.platform").findPlatform();
    }

    let params = { limit: 50 };

    // loop through params
    do {
      const customers = await shopify.customer.list(params);

      if (!customers || customers.length == undefined) {
        throw new ApplicationError("Unable to sync data from the channel.");
      }

      // loop through customers respone
      for (let i = 0; i < customers.length; i++) {
        // create customer
        await strapi
          .service("api::customer.customer")
          .createCustomer(customers[i], "create");
      }

      // set page params to next page parameters
      params = customers.nextPageParameters;
    } while (params !== undefined);
  },

  /**
   * create customer
   * @param {*} args
   * @returns
   */
  async createCustomer(args, action) {
    const entity = await findCustomer(args);
    if (entity && action === "create") {
      return entity;
    }
    if (!entity && action === "update") {
      return entity;
    }
    const {
      first_name,
      last_name,
      phone,
      email,
      addresses,
      default_address,
      verified_email,
      accepts_marketing,
      id,
    } = args;

    // get phone number
    let customerPhone = phone || default_address?.phone;
    if (!customerPhone && addresses && addresses.length) {
      for (const address of addresses) {
        if (address.phone) {
          customerPhone = address.phone;
        }
        break;
      }
    }

    let customerName = `${first_name} ${last_name}`;
    if (!first_name || !last_name) {
      customerName = default_address?.name;
    }

    // organize data
    const customer = {
      name: customerName,
      phone: customerPhone,
      email: email,
      addresses,
      acceptsMarketing: accepts_marketing,
      verifiedEmail: verified_email,
      defaultAddress: default_address,
      customerId: id?.toString(),
    };
    if (!customer.name || !customer.email) return;

    // if customer already exit update and return
    if (entity) {
      return await strapi.service("api::customer.customer").update(entity.id, {
        data: customer,
      });
    }

    // create customer and return
    return await strapi.service("api::customer.customer").create({
      data: customer,
    });
  },

  /**
   * create customer from address
   * @param {*} args
   */
  async createCustomerFromAddress(args) {
    const { shipping_address, billing_address } = args;

    let customerArgs = null;

    // check if shipping address and shipping phone number exist
    if (shipping_address && shipping_address.phone) {
      customerArgs = shipping_address;
    } else if (billing_address && billing_address.phone) {
      customerArgs = billing_address;
    }

    if (!customerArgs) {
      return null;
    }
    const { name, phone } = customerArgs;

    // organize customer data
    const customer = {
      name,
      phone,
      defaultAddress: customerArgs,
      acceptsMarketing: true,
      addresses: [customerArgs],
    };

    const entity = await strapi.db.query("api::customer.customer").findOne({
      where: { phone: { $containsi: phone } },
    });

    if (entity) {
      return entity;
    }
    // create customer
    return await strapi.service("api::customer.customer").create({
      data: customer,
    });
  },

  /**
   * format number to international format
   * @param {*} phoneNumber
   * @param {*} countryCode
   * @returns
   */
  formatPhoneNumber(phoneNumber, countryCode) {
    // if phone number or country code is not defined, return immediately
    if (!phoneNumber || !countryCode) {
      return phoneNumber;
    }

    // parse phone number
    const parsedNumber = parsePhoneNumber(phoneNumber, countryCode);

    // if phone number is valid, return number in international format
    if (parsedNumber && parsedNumber.isValid()) {
      return parsedNumber.formatInternational();
    }

    // return original number
    return phoneNumber;
  },

  /**
   * override default create
   * @param {*} params
   * @returns
   */
  async create(params) {
    const { data } = params;

    params.data = getFormattedData(data);

    const result = await super.create(params);

    return result;
  },

  /**
   * override default update
   * @param {*} params
   * @returns
   */
  async update(entityId, params) {
    const { data } = params;

    params.data = getFormattedData(data);

    const result = await super.update(entityId, params);

    return result;
  },
}));
