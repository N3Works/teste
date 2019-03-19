'use strict'

const { runZendeskOperation, publishEvent, getSuccessTopic } = require('../utils');

/**
 * @name checkForID
 * @description Method used to check if an ticket id was provided
 * @throws No ticket ID provided
 * @param {Object} data Object provided on the request
 */
exports.checkForID = (data) => {
    if (!data.id) throw new Error('No ticket ID provided');
};

/**
 * @name formatUpdate
 * @description Method used to build the ticket update object to be sent to Zendesk
 * @param {Object} data Object data given as entry parameter of the function
 */
exports.formatUpdate = (data) => {
    return {
        comment: {
            body: data.outputText
        },
        status: data.status ? data.status : 'solved'
    };
};

/**
 * @name handler
 * @async
 * @description Method used to handle the Zendesk Webhook opperation
 * @param {Object} event
 * @param {Object} event.data
 * @param {Object} event.config
 * @param {Object} event.database Firebase Realtime instance
 */
exports.handler = async ({ config, data, database }) => {
    this.checkForID(data);
    this.formatUpdate(data);
};