'use strict'

const _ = require('lodash');

const utils = require('../../utils');
const getTicketComments = require('../../get-ticket-comments/get-ticket-comments');

const data = { id: '123' };
const config = { crm: { api: 'api'} };
const result = { comments: [
    {plain_body: 'comment 1'},
    {plain_body: 'comment 2'}
]};

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
            await expect(getTicketComments.handler({
                config, data: mockData, database: {}
            })).rejects.toEqual(error);
        });
        it('should get the zendesk ticket comments', async () => {
            utils.runZendeskOperation.mockResolvedValue(result);
            utils.publishEvent.mockResolvedValue({});

            const spyFormatOutput = jest.spyOn(getTicketComments, 'formatOutput');

            await expect(getTicketComments.handler({config, data, database: {}}))
                .resolves.toBeUndefined();
            expect(utils.runZendeskOperation).toBeCalledWith(
                config.crm,
                `/tickets/${data.id}/comments.json`
            );
            expect(spyFormatOutput).toBeCalledWith(
                config, data, result.comments
            );
            expect(utils.publishEvent).toBeCalledWith({
                config, data
            }, utils.getSuccessTopic("zendesk-get-ticket-comment-success"));
        });
    });
});