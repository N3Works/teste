'use strict'

const _ = require('lodash');

const { zendeskGetTicketComments } = require('../../');
const getTicketComments = require('../../get-ticket-comments/get-ticket-comments');

const data = { id: '123' };
const config = { api: 'api'};

describe('Zendesk Webhook', () => {
    describe('Given an update request is fired', () => {
        it('it should throw an erroe if no id is provided', async () => {
            const mockData = _.cloneDeep(data);
            delete mockData.id;
            const error = new Error('No ticket ID provided');
            await expect(getTicketComments.handler(config, mockData, {})).rejects.toEqual(error);
        });
        // it('should get the zendesk credentials', async () => {
        //     // const spyGetCredentials = jest.spyOn(handler, 'getCredentials');
        //     // const spySearch = jest.spyOn(handler, 'search');
        //     await zendeskGetTicketComments({data:{ json: {message: "testing pubsub ..."}}});
        //     // expect(spyGetCredentials).toBeCalled();
        //     // expect(spySearch).toBeCalled();
        //     expect(0).toBe(1);
        // });
    });
});