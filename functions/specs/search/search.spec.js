"use strict";

const { handler } = require("../../search/search");
const ZendeskApi = require("@kiina/zendesk-api");
const utils = require("../../utils");

let database = {
  ref: jest.fn().mockReturnThis(),
  once: jest.fn().mockResolvedValue({
    val: jest.fn().mockReturnValue({
      crm: {
        api: "api",
        username: "user",
        password: "1234",
        subdomain: "teste",
        query: "banana"
      }
    })
  })
};

jest.mock("@kiina/zendesk-api");
jest.mock("../../utils");

describe("Zendesk Webhook", () => {
  describe("Given an update request is fired", () => {
    afterEach(() => {
      jest.resetAllMocks();
      jest.restoreAllMocks();
    });
    it("should get the zendesk all ticket based on the given query", async () => {
      ZendeskApi.prototype.search = {
        run: jest.fn().mockResolvedValue([{}])
      };
      utils.publishEvent.mockResolvedValue({});

      await handler({
        data: { message: "testing pubsub ..." },
        database
      });
      expect(database.once).toBeCalledWith("value");
      expect(ZendeskApi.prototype.search.run).toBeCalledWith({
        query: "banana"
      });
    });
  });
});
