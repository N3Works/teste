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
 * @name sendUpdate
 * @async
 * @description Method used to send an update for the given ticket to the Zendesk platform
 * @param {Object} crm Zendesk configuration object with all its credentials
 * @param {string} ticketId
 */
exports.sendUpdate = async (crm, ticketId, update) => {
    const uri = `/tickets/${ticketId}.json`;
    await runZendeskOperation(crm, uri, update, 'PUT');
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
    const update = this.formatUpdate(data);
    await this.sendUpdate(config.crm, data.id, update);
    await publishEvent({
        config, data
    }, getSuccessTopic("zendesk-update-ticket"));
};