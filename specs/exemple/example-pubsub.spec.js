"use strict";

const _ = require("lodash");
const utils = require("../../utils");
const exemplePubsub = require("../../example/example-pubsub");

jest.mock("../../utils/events");

const data = {
  id: "1235",
  name: "banana",
  message: "oi tudo bao?"
};

const config = {
  nlp: {
    token: "123s"
  }
};

describe("Exemple PubSub", () => {
  describe("Given an action should do these operations", () => {
    afterEach(() => {
      jest.resetAllMocks();
      jest.restoreAllMocks();
    });

    it("should get message of bot", async () => {
      utils.publishEvent.mockResolvedValue({});

      const mockData = _.cloneDeep(data);
      await expect(
        exemplePubsub.handler({ data: mockData, config })
      ).resolves.toBeUndefined();
      expect(utils.publishEvent).toBeCalledWith(
        {
          config,
          data: mockData
        },
        utils.getSuccessTopic("exemple-pubsub")
      );
    });
  });
});
