'use strict'

const { runZendeskOperation } = require('../utils');

/**
 * @name checkForID
 * @description Method used to check if an ticket id was provided
 * @throws No ticket ID provided
 * @param {Object} data Object provided on the request
 */
exports.checkForID = (data) => {
    if (!data.id) throw new Error('No ticket ID provided');
};

exports.getTicketComments = async (config, ticketId) => {
    const uri = `${config.api}/tickets/${ticketId}/comments.json`;
    const result = await runZendeskOperation(config, uri);
    return result.comments;
};

exports.formatOutput = (config, data, comments) => {
    data.inputText = comments[0].plain_body;
    data.comments = comments;
    return {config, data};
};

/**
 * @name handler
 * @async
 * @description Method used to handle the Zendesk Webhook opperation
 * @param {Object} inputData
 * @param {Object} database Firebase Realtime instance
 */
exports.handler = async (config, data, database) => {
    this.checkForID(data);
    // const comments = await this.getTicketComments(config.crm, data.id);
    // await publishEvent(
    //     this.formatOutput(config, data, comments),
    //     getSuccessTopic('zendesk-get-ticket-comments')
    // );
};