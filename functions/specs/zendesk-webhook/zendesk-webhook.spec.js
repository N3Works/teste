'use strict'

const { searchChanges } = require('../../');
const zendeskWebhook = require('../../zendesk-webhook/zendesk-webhook');

describe('Zendesk Webhook', () => {
    describe('Given an update request is fired', () => {
        it('should get the zendesk credentials', async () => {
            const spyGetCredentials = jest.spyOn(zendeskWebhook, 'getCredentials');
            const spySearch = jest.spyOn(zendeskWebhook, 'search');
            await searchChanges({data:{ attributes: "testing pubsub ..."}});
            expect(spyGetCredentials).toBeCalled();
            expect(spySearch).toBeCalled();
        });
    });
});