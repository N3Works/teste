const { helloWorldHttp } = require('../../');

describe('Simple test', () => {
    it('testing request', () => {
        response = { 
            send: jest.fn()
        };
        helloWorldHttp.helloWorld(null, response);
        expect(response.send).toBeCalledWith('Hello from Firebase!');
    });
});