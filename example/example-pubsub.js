"use strict";

const { publishEvent, getSuccessTopic } = require("../utils");

/**
 * @name handler
 * @async
 * @description Method used to handle the example pubsub opperation
 * @param {Object} data
 * @param {Object} config
 */
exports.handler = async ({ data, config }) => {
  data.results = {
    answer: "Ola"
  };
  await publishEvent(
    {
      config,
      data
    },
    getSuccessTopic("example-pubsub")
  );
};
