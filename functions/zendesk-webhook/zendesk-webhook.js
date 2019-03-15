'use strict'

const functions = require('firebase-functions');

exports.doSomeThing = (message) => {
    console.log(`Message: ${JSON.stringify(message)}`)
};

exports.update = functions.pubsub.topic('zenndesk-update').onPublish(({attributes}) => {
    this.doSomeThing(attributes);
    return null;
});