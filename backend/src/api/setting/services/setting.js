"use strict";

const { default: axios } = require("axios");
const utils = require("@strapi/utils");
const { ApplicationError } = utils.errors;
/**
 * setting service
 */

const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService("api::setting.setting", ({ strapi }) => ({
  /**
   * call shiprocket api
   * @param {*} endpoint
   * @param {*} data
   * @returns
   */
  async callShiprocketApi(endpoint, data, method = "get") {
    try {
      const { shiprocketToken, shiprocketApiBaseURL } = await strapi
        .service("api::setting.setting")
        .find({});

      if (!shiprocketApiBaseURL) {
        throw new ApplicationError(
          "Base API URL is required. Check integration settings."
        );
      }

      const API_URL = `${shiprocketApiBaseURL}${endpoint}`;

      let AUTH = { Authorization: `Bearer ${shiprocketToken}` };

      if (endpoint === "/auth/login") {
        AUTH = {};
      }

      // Set up Axios request options
      const options = {
        method,
        url: API_URL,
        data,
        headers: {
          "Content-Type": "application/json",
          ...AUTH,
        },
      };

      return await axios(options);
    } catch (error) {
      if (error?.response?.status === 401) {
        return await strapi
          .service("api::setting.setting")
          .generateShiprocketToken();
      }
      console.log(error);
      throw new ApplicationError("Error making Shiprocket API call.", {
        ...error?.response,
      });
    }
  },

  /**
   * function to generate and save shiprocket token
   * @param {*} params
   */
  async generateShiprocketToken() {
    try {
      const { shiprocketApiEmail, shiprocketApiPassword } = await strapi
        .service("api::setting.setting")
        .find({});

      const formData = {
        email: shiprocketApiEmail,
        password: shiprocketApiPassword,
      };

      const response = await strapi
        .service("api::setting.setting")
        .callShiprocketApi("/auth/login", formData, "post");

      const { token } = response.data;

      return await strapi.service("api::setting.setting").createOrUpdate({
        data: {
          shiprocketToken: token,
        },
      });
    } catch (error) {
      throw new ApplicationError("Error generating Shiprocket API token.", {
        ...error?.response,
      });
    }
  },

  /**
   * send messsage through interakt
   * @param {*} data
   * @returns
   */
  async interaktSend(data) {
    const { interaktApiBaseURL, interaktApiToken } = await strapi
      .service("api::setting.setting")
      .find({});

    if (!interaktApiBaseURL) {
      throw new ApplicationError(
        "Base API URL is required. Check integration settings."
      );
    }
    if (!interaktApiToken) {
      throw new ApplicationError(
        "Interakt API token is required. Check integration settings."
      );
    }

    const messageData = JSON.stringify(data);

    return await axios.post(interaktApiBaseURL, messageData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${interaktApiToken}`,
      },
    });
  },
}));
