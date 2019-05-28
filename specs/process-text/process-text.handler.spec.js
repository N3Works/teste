'use strict'

const _ = require('lodash');
const MLProcessor = require('@kiina/ml-processor');

const utils = require('../../utils');
const processTextHandler = require('../../process-text/process-text.handler');

var messages = utils.getErrorMessages();

const config = {
    nlp: {
        name: 'dialogflow',
        accessTocken: '42b93fd9c91941d9be86fbf2439090c1',
        agentId: 'agentId'
    }
};
const data = {
    sessionId: Math.random(),
    inputText: 'Bom dia'
};

const response = {
    fulfillment: {
        speech: 'hi'
    }
};

jest.mock('@kiina/ml-processor');

describe('Given that a message must be interpreted', () => {
    describe('And a set of credantials were defined', () => {
        beforeEach(() => {
            utils.publishEvent = jest.fn(() => Promise.resolve({}));
        });
        afterEach(() => {
            jest.resetAllMocks();
        });
        it('should throw an error if the agent id is missing', async () => {
            var configClone = _.cloneDeep(config);
            _.unset(configClone, 'nlp.agentId');
            let err = new Error(messages.agent_missing.message);
            err.code = messages.agent_missing.code;
            await expect(processTextHandler.handler({
                data, config: configClone
            })).rejects.toEqual(err);
        });
        it('should create a session id if no one is provided', async () => {
            var dataClone = _.cloneDeep(data);
            _.unset(dataClone, 'sessionId');
            const spyCheckSessionId = jest.spyOn(processTextHandler, 'checkSessionId');
            MLProcessor.prototype.processText.mockResolvedValueOnce(response);
            await expect(processTextHandler.handler({
                config, data: dataClone
            })).resolves.toBeUndefined();
            expect(spyCheckSessionId).toBeCalledWith(undefined);
            expect(spyCheckSessionId).not.toBeUndefined();
        });
        it('should throw an error if the dialog flow fails', async () => {
            let err = new Error();
            MLProcessor.prototype.processText.mockRejectedValueOnce(err);
            await expect(processTextHandler.handler({data, config})).rejects.toEqual(err);
        });
    });
});