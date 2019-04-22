"use strict";

const { zendeskSearch } = require("../../");
const { handler } = require("../../search/search");
const search = require("../../search/search");

describe("Zendesk Webhook", () => {
  describe("Given an update request is fired", () => {
    it("should get the zendesk credentials", async () => {
      const spyGetCredentials = jest.spyOn(search, "getCredentials");
      const spySearch = jest.spyOn(search, "search");
      await zendeskSearch({
        data: { json: { message: "testing pubsub ..." } }
      });
      expect(spyGetCredentials).toBeCalled();
      expect(spySearch).toBeCalled();
    }, 10000);
    it("should return the search", async () => {});
  });
});
