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
 * @name getTicketComments
 * @async
 * @description Method used to get all comments of a given ticket
 * @param {Object} config Zendesk configuration object with all its credentials
 * @param {string} ticketId
 * @returns {Array<Objetc>} List of all comments for the given ticket
 */
exports.getTicketComments = async (config, ticketId) => {
    const uri = `${config.api}/tickets/${ticketId}/comments.json`;
    const result = await runZendeskOperation(config, uri);
    return result.comments;
};

/**
 * @name formatOutput
 * @description Method used to format the output of the function
 * @param {Object} config Object that represents the project credentials and configurations
 * @param {Object} data Object given to the current function as input
 * @param {Array<Objects>} comments List of comments for the given ticket
 * @returns {Object} Output object composed by the config parameter and a data parameter
 */
exports.formatOutput = (config, data, comments) => {
    data.inputText = comments[0].plain_body;
    data.comments = comments;
    return {config, data};
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
    const comments = await this.getTicketComments(config.crm, data.id);
    await publishEvent(
        this.formatOutput(config, data, comments),
        getSuccessTopic('zendesk-get-ticket-comments')
    );
};