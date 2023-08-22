"use strict";
const fs = require("fs");
const path = require("path");
const mime = require("mime-types");
const fetch = require("node-fetch");

/**
 * product service
 */

const { createCoreService } = require("@strapi/strapi").factories;

/**
 * find product
 * @param {*} id
 * @returns
 */
const findProduct = async (id) => {
  const response = await strapi.db.query("api::product.product").findOne({
    where: { productId: id },
    populate: true,
  });
  return response;
};

const escapeSpecialCharacters = (inputString)=> {
  return inputString.replace(/[^\x00-\x7F]/g, (char) => {
    return '\\u' + char.charCodeAt(0).toString(16).padStart(4, '0');
  });
}

module.exports = createCoreService("api::product.product", ({ strapi }) => ({
  /**
   * fetch products
   * @param {*} shopify
   */
  async fetchProducts(shopify) {
    // if shopify is not defined
    if (!shopify) {
      // get shopify instance or null
      shopify = await strapi.service("api::platform.platform").findPlatform();
    }

    let params = { limit: 50 };

    do {
      const products = await shopify.product.list(params);

      for (const product of products) {
        // create new product
        const productEntity = await strapi
          .service("api::product.product")
          .createProduct(product, "create");

        // create image data
        const imageArgs = {
          ref: "api::product.product",
          refId: productEntity.id,
          src: product.image.src,
          field: "image",
        };

        // create image if not exists
        if (!productEntity.image) {
          await strapi
            .service("api::product.product")
            .createProductImage(imageArgs);
        }

        // create images if not exists
        if (!productEntity.images) {
          // sort image by position
          const images = product.images.sort((a, b) => a.position - b.position);

          for (const image of images) {
            imageArgs.field = "images";
            imageArgs.src = image.src;
            // create image
            await strapi
              .service("api::product.product")
              .createProductImage(imageArgs);
          }
        }
      }

      params = products.nextPageParameters;
    } while (params !== undefined);
  },

  /**
   * create product
   * @param {*} args
   * @returns
   */
  async createProduct(args, action) {
    // find product by id
    const entity = await findProduct(args.id);

    // if product is already exists return immediately
    if (entity && action === "create") {
      return entity;
    }
    if (!entity && action === "update") {
      return;
    }

    const { title, id, body_html, status, options, variants } = args;

    const product = {
      name: title,
      productId: id.toString(),
      description: escapeSpecialCharacters(body_html),
      status: status === "draft" ? "archived" : status,
      options,
    };

    let productEntity = {};
    if (entity) {
      productEntity = await strapi
        .service("api::product.product")
        .update(entity.id, { data: product });
    } else {
      productEntity = await strapi.service("api::product.product").create({
        data: product,
      });
    }

    const sortedVariants = variants.sort((a, b) => a.position - b.position);
    productEntity.variants = [];
    for (const sortedVariant of sortedVariants) {
      // append productId to link with variant
      const variant = {
        ...sortedVariant,
        productId: productEntity.id,
      };

      // update or update variant
      const variantEntity = await strapi
        .service("api::variant.variant")
        .createVariant(variant);

      // push varinat entity to product entity
      productEntity.variants.push(variantEntity);
    }

    return productEntity;
  },

  /**
   * create product image
   * @param {*} args
   * @returns
   */
  async createProductImage(args) {
    args.src = args.src.includes("?")
      ? args.src.slice(0, args.src.lastIndexOf("?"))
      : args.src;

    const { src, ref, refId, field } = args;

    const response = await fetch(src);
    const buffer = await response.buffer();

    const fileInfo = {
      name: path.basename(src),
      mime: mime.lookup(src),
      path: `public/temp/${path.basename(src)}`,
    };

    fs.writeFileSync(fileInfo.path, buffer);

    const fileStats = fs.statSync(fileInfo.path);

    const fileSize = fileStats.size;

    const attachment = await strapi.plugins.upload.services.upload.upload({
      data: {
        refId,
        ref,
        field,
      },
      files: {
        path: fileInfo.path,
        name: fileInfo.name,
        type: fileInfo.mime,
        size: fileSize,
      },
    });
    fs.unlinkSync(fileInfo.path);

    if (attachment.length > 0) {
      return attachment[0];
    } else {
      return attachment;
    }
  },
}));
