'use strict'

const functions = require('firebase-functions');

const { getTrigger, getFailTopic, publishEvent } = require('./utils');

const processText = require('./process-text/process-text.handler');
exports.dfProcessText = functions.pubsub.topic(getTrigger('df-process-text')).onPublish(async event => {
    try {
        return await processText.handler({config: event.json.config, data: event.json.data});
    } catch (error) {
        console.error(error);
        event.json.error = error;
        await publishEvent(event.json, getFailTopic('df-process-text'));
    }
});
