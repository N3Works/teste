'use strict'

const { searchChanges } = require('../../');
const zendeskWebhook = require('../../zendesk-webhook/zendesk-webhook');

describe('Zendesk Webhook', () => {
    describe('Given an update request is fired', () => {
        it('should get the zendesk credentials', async () => {
            const spy = jest.spyOn(zendeskWebhook, 'getCredentials');
            await searchChanges({data:{ attributes: "testing pubsub ..."}});
            expect(spy).toBeCalled();
        });
    });
});