'use strict'

const fs = require('fs');
const path = require('path');
const { PubSub } = require('@google-cloud/pubsub');
const pubsub = new PubSub();

/**
 * @description Method used to get the map of events
 * @returns {Object}
 */
const getEvents = () => {
    return JSON.parse(
        fs.readFileSync(
            path.join(__dirname, 'events.json'),
            'utf8'
        )
    );
};

/**
 * @name getTrigger
 * @description Method use to get the topic label that will trigger the given function
 * @param {string} functionName
 * @returns {string}
 */
exports.getTrigger = (functionName) => {
    return getEvents()[functionName].trigger;
};

/**
 * @name getSuccessTopic
 * @description Method use to get the topic label that will trigger if the given function success
 * @param {string} functionName
 * @returns {string}
 */
exports.getSuccessTopic = (functionName) => {
    return getEvents()[functionName].success;
};

/**
 * @name getFailTopic
 * @description Method use to get the topic label that will trigger if the given function fails
 * @param {string} functionName
 * @returns {string}
 */
exports.getFailTopic = (functionName) => {
    return getEvents()[functionName].fail;
};

/**
 * @name publishEvent
 * @async
 * @description Method used to publish a JSON object to a PubSub topic
 * @param {Object} data JSON object to be published
 * @param {string} topic Topic label
 */
exports.publishEvent = async (data, topic) => {
    await pubsub.topic(topic).publishJSON(data);
};

/**
 * @typedef DFError
 * @description Object that maps the error message and the error code 
 * @param {number} code
 * @param {string} message
 */

/**
  * @description Method used to throw ŧhe error
  * @param {IncomingError} err
  * @throws Error that contains the message and its code
  */
 exports.throwError = (err) => {
    const e = new Error(err.message);
    e.code = err.code;
    throw e;
};

/**
 * @description Method used to get the map of errors and its respectives messages and codes
 * @returns {Object}
 */
exports.getErrorMessages = () => {
    return JSON.parse(
        fs.readFileSync(
            path.join(__dirname, 'messages.json'),
            'utf8'
        )
    );
};
