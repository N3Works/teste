"use strict";

const _ = require("lodash");
const example = require("../../example/example");

const data = {
  name: "banana",
  message: "oi tudo bao?"
};

const database = {
  nlp: {
    token: "123s"
  }
};

describe("example", () => {
  describe("Given an action should do these operations", () => {
    afterEach(() => {
      jest.resetAllMocks();
      jest.restoreAllMocks();
    });

    it("should send id for the user", async () => {
      const mockData = _.cloneDeep(data);
      await expect(
        example.handler({ data: mockData, database })
      ).resolves.toEqual(123);
    });
  });
});
