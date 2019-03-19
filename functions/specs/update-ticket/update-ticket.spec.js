'use strict'

const _ = require('lodash');

const utils = require('../../utils');
const { handler } = require('../../update-ticket/update-ticket');

const data = { id: '123', outputText: 'bye bye' };
const config = { crm: { api: 'api'} };

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
            await expect(handler({
                config, data: mockData, database: {}
            })).rejects.toEqual(error);
        });
    });
});