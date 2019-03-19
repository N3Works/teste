'use strict'

const functions = require('firebase-functions');
const { PubSub } = require('@google-cloud/pubsub');
const pubsub = new PubSub();

/**
 * @name triggerToListnerName
 * @description Method used to transform a trigger into a camel case listener name
 * @param {string} trigger The trigger to be transformed (e.g.: 'zendesk-search-success')
 * @returns {string} The listener name (e.g.: 'listenerZendeskSearchSuccess')
 */
const triggerToListnerName = (trigger) => {
    let parts = trigger.split('-');
    return parts.reduce((start, p) => {
        return `${start}${p.charAt(0).toUpperCase()}${p.slice(1)}`
    }, 'listiner');
};

/**
 * @name registryListener
 * @description Method used to registry listeners functions for given triggers
 * @param {string} trigger
 */
const registryListener = (trigger) => {
    exports[triggerToListnerName(trigger)] = functions.pubsub.topic(trigger).onPublish(async event => {
        const config = event.json.config;
        const next = config.pipeline[trigger];
        if(next) await pubsub.topic(next).publishJSON(event.json);
        else Promise.resolve();
    });
};

/** setup */
const triggers = ['zendesk-search-success', 'df-process-text-success'];
triggers.forEach(trigger => registryListener(trigger));