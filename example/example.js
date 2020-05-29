"use strict";

/**
 * @name handler
 * @async
 * @description This method used to handle the example function operation
 * @param {Object} data
 * @param {Object} database
 */
exports.handler = async ({ data, database }) => {
  data.id = 123;
  return data.id;
};
