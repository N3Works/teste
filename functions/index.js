'use strict'

const functions = require('firebase-functions');
const admin = require('firebase-admin');

const { getTrigger, getFailTopic, publishEvent } = require('./utils');

if (!process.env.FIREBASE_CONFIG) {
    admin.initializeApp({
        databaseURL: 'https://platform-225512.firebaseio.com/',
        projectId: 'platform-225512'
    });
} else admin.initializeApp();

/**
 * @name registryFunction
 * @description Method used to registry a new function to the current module
 * @param {Object} setup Object with the informations to setup a new function
 * @param {Object} setup.opperator Object reference for the module that holds the function handler (must inplement one method named handler)
 * @param {string} setup.functionName String that represents the function name to be registry at Firebase
 * @param {string} setup.trigger String that holds the function trigger name
 */
const registryFunction = ({opperator, functionName, trigger}) => {
    exports[functionName] = functions.pubsub.topic(getTrigger(trigger)).onPublish(async event => {
        try {
            return await opperator.handler({
                config: event.json.config,
                data: event.json.data,
                database: admin.database()
            });
        } catch (error) {
            console.error(error);
            event.json.error = error;
            await publishEvent(event.json, getFailTopic(trigger));
        }
    });
};

registryFunction({
    opperator: require('./search/search'),
    functionName: 'zendeskSearch',
    trigger: 'zendesk-search'
});
registryFunction({
    opperator: require('./get-ticket-comments/get-ticket-comments'),
    functionName: 'zendeskGetTicketComments',
    trigger: 'zendesk-get-ticket-comments'
});
registryFunction({
    opperator: require('./update-ticket/update-ticket'),
    functionName: 'zendeskUpdateTicket',
    trigger: 'zendesk-update-ticket'
});