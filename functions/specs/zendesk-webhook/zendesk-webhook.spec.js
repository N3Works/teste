'use strict'

const { zendeskWebhook } = require('../../');

describe('Zendesk Webhook', () => {
    describe('Given an update request is fired', () => {
        it('should do something', () => {
            const spy = jest.spyOn(zendeskWebhook, 'doSomeThing');
            zendeskWebhook.update({data:{ attributes: "testing pubsub ..."}});
            expect(spy).toBeCalledWith("testing pubsub ...");
        });
    });
});