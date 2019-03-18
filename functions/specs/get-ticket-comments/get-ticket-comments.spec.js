'use strict'

const { zendeskGetTicketComments } = require('../../');
const handler = require('../../get-ticket-comments/get-ticket-comments');

describe('Zendesk Webhook', () => {
    describe('Given an update request is fired', () => {
        it('should get the zendesk credentials', async () => {
            // const spyGetCredentials = jest.spyOn(handler, 'getCredentials');
            // const spySearch = jest.spyOn(handler, 'search');
            await zendeskGetTicketComments({data:{ json: {message: "testing pubsub ..."}}});
            // expect(spyGetCredentials).toBeCalled();
            // expect(spySearch).toBeCalled();
            expect(0).toBe(1);
        });
    });
});