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

const zenndeskWebhook = require('./search/search');
exports.search = functions.pubsub.topic(getTrigger('zendesk-search')).onPublish(async event => {
    try {
        return await zenndeskWebhook.handler(event.json, admin.database());
    } catch (error) {
        console.error(error);
        publishEvent(error, getFailTopic('zendesk-search'));
    }
});
