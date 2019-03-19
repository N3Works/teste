'use strict'

const fs = require('fs');
const path = require('path');
const axios = require('axios');
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
 * @name runZendeskOperation
 * @async
 * @description Method used to run Zendesk operations through its API
 * @param {Object} config Zendesk credentials
 * @param {string} uri Zendesk resource address 
 * @param {string} method HTTP method (default: GET)
 * @returns {Object} HTTP response data object
 */
exports.runZendeskOperation = async (config, uri, data, method = 'GET') => {
    const url = `${config.api}${uri}`;
    const response = await axios.request({
        url,
        method,
        data,
        auth: {
            username: config.username,
            password: config.password
        },
        headers: {
            'Content-type': 'application/json',
            'Authorization': `Bearer ${config.accessToken}`
        }
    });
    return response.data
};