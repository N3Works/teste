'use strict'

const functions = require('firebase-functions');
const admin = require('firebase-admin');

const { getTrigger } = require('./utils');

if (!process.env.FIREBASE_CONFIG) {
    admin.initializeApp({
        databaseURL: 'https://platform-225512.firebaseio.com/',
        projectId: 'platform-225512'
    });
} else admin.initializeApp();

const zenndeskWebhook = require('./search-changes/search-changes');
exports.searchChanges = functions.pubsub.topic(getTrigger('zendesk-search-changes')).onPublish(async event => {
    return await zenndeskWebhook.handler(event.json, admin.database());
});
