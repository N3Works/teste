const functions = require('firebase-functions');

exports.doSomeThing = (text) => {
    return `Data: ${text}`;
};

exports.helloWorld = functions.pubsub.topic('test').onPublish((message) => {
    console.log(`Message: ${JSON.stringify(message)}`)
    this.doSomeThing(message.attributes);
    return null;
});