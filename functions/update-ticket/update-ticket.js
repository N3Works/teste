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

exports.formatTagsUpdate = (data) => {
    let tags = [];
    if (data.result.action && data.result.action === 'input.unknown')
        tags.push('AI_sem_sucesso');
    else tags.push('AI_sucesso');
    return { tags };
};

/**
 * @name formatUpdate
 * @description Method used to build the ticket update object to be sent to Zendesk
 * @param {Object} data Object data given as entry parameter of the function
 */
exports.formatUpdate = (data) => {;
    if (data.result.action && data.result.action === 'input.unknown') {
        return {
            ticket: {
                "status": 'pending'
            }
        };
    } else {
        return {
            ticket: {
                comment: {
                    body: data.outputText
                }
            }
        };
    }
};

/**
 * @name sendUpdate
 * @async
 * @description Method used to send an update for the given ticket to the Zendesk platform
 * @param {Object} crm Zendesk configuration object with all its credentials
 * @param {string} ticketId
 */
exports.updateTicket = async (crm, ticketId, update) => {
    const uri = `/tickets/${ticketId}.json`;
    await runZendeskOperation(crm, uri, update, 'PUT');
};

/**
 * @name sendUpdate
 * @async
 * @description Method used to send an update for the given ticket to the Zendesk platform
 * @param {Object} crm Zendesk configuration object with all its credentials
 * @param {string} ticketId
 */
exports.addTags = async (crm, ticketId, update) => {
    const uri = `/tickets/${ticketId}/tags.json`;
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
    
    let update = this.formatTagsUpdate(data);
    await this.addTags(config.crm, data.id, update);
    if (data.tags) data.tags.concat(update.tags);
    else data.tags = update.tags;

    update = this.formatUpdate(data);
    await this.updateTicket(config.crm, data.id, update);
    
    await publishEvent({
        config, data
    }, getSuccessTopic('zendesk-update-ticket'));
};