'use strict'

const functions = require('firebase-functions');
const admin = require('firebase-admin');

if (!process.env.FIREBASE_CONFIG) {
    admin.initializeApp({
        databaseURL: 'https://platform-225512.firebaseio.com/',
        projectId: 'platform-225512'
    });
} else admin.initializeApp();

const zenndeskWebhook = require('./zendesk-webhook/zendesk-webhook');
exports.searchChanges = functions.pubsub.topic('zenndesk-search-changes').onPublish(async event => { 
    return await zenndeskWebhook.handler(event.attributes, admin.database());
});
