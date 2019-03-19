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

const search = require('./search/search');
exports.zendeskSearch = functions.pubsub.topic(getTrigger('zendesk-search')).onPublish(async event => {
    try {
        return await search.handler({
            data: event.json,
            database: admin.database()
        });
    } catch (error) {
        console.error(error);
        event.json.error = error;
        await publishEvent(event.json, getFailTopic('zendesk-search'));
    }
});

const getTicketComments = require('./get-ticket-comments/get-ticket-comments');
exports.zendeskGetTicketComments = functions.pubsub.topic(getTrigger('zendesk-get-ticket-comments')).onPublish(async event => {
    try {
        return await getTicketComments.handler({
            config: event.json.config,
            data: event.json.data,
            databese: admin.database()
        });
    } catch (error) {
        console.error(error);
        event.json.error = error;
        await publishEvent(event.json, getFailTopic('zendesk-get-ticket-comments'));
    }
});