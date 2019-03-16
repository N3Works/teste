'use strict'

const { zendeskSearch } = require('../../');
const handler = require('../../search/search');

describe('Zendesk Webhook', () => {
    describe('Given an update request is fired', () => {
        it('should get the zendesk credentials', async () => {
            const spyGetCredentials = jest.spyOn(handler, 'getCredentials');
            const spySearch = jest.spyOn(handler, 'search');
            await zendeskSearch({data:{ json: {message: "testing pubsub ..."}}});
            expect(spyGetCredentials).toBeCalled();
            expect(spySearch).toBeCalled();
        });
    });
});