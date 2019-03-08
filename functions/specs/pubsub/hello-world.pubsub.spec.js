const { helloWorldPS } = require('../../');

describe('Simple test', () => {
    it('testing pubsub', async () => {
        const spy = jest.spyOn(helloWorldPS, 'doSomeThing');
        await helloWorldPS.helloWorld({data:{ attributes: "testing pubsub ..."}});
        expect(spy).toBeCalledWith("testing pubsub ...");
    });
});