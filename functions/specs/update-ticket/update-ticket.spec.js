'use strict'

const _ = require('lodash');

const utils = require('../../utils');
const updateTicket = require('../../update-ticket/update-ticket');

const data = { id: '123', outputText: 'bye bye' };
const config = { crm: { api: 'api'} };
const update = {
    comment: {
        body: data.outputText
    },
    status: 'solved'
};

jest.mock('../../utils');

describe('Zendesk Webhook', () => {
    describe('Given an update request is fired', () => {
        afterEach(() => {
            jest.resetAllMocks();
        });
        it('it should throw an erroe if no id is provided', async () => {
            const mockData = _.cloneDeep(data);
            delete mockData.id;
            const error = new Error('No ticket ID provided');
            await expect(updateTicket.handler({
                config, data: mockData, database: {}
            })).rejects.toEqual(error);
        });
        it('should get the zendesk ticket comments', async () => {
            utils.runZendeskOperation.mockResolvedValue({});
            utils.publishEvent.mockResolvedValue({});

            const spyFormatUpdate = jest.spyOn(updateTicket, 'formatUpdate');

            await expect(updateTicket.handler({config, data, database: {}}))
                .resolves.toBeUndefined();
            expect(spyFormatUpdate).toBeCalledWith(data);
            expect(utils.runZendeskOperation).toBeCalledWith(
                config.crm,
                `/tickets/${data.id}.json`,
                update,
                'PUT'
            );
            expect(utils.publishEvent).toBeCalledWith({
                config, data
            }, utils.getSuccessTopic("zendesk-update-ticket-success"));
        });
    });
});