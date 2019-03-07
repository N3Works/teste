const helloWorld = require('../').helloWorld;

describe('Simple test', () => {
    it('testing request', () => {
        response = { 
            send: jest.fn()
        };
        helloWorld(null, response);
        expect(response.send).toBeCalledWith('Hello from Firebase!');
    });
});