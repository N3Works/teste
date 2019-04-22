"use strict";

const _ = require("lodash");

const utils = require("../../utils");
const updateTicket = require("../../update-ticket/update-ticket");

const data = { id: "123", outputText: "bye bye" };
const config = { crm: { api: "api" } };
const update = {
  comment: {
    body: data.outputText
  },
  status: "solved"
};

jest.mock("../../utils");

describe("Zendesk Webhook", () => {
  describe("Given an update request is fired", () => {
    afterEach(() => {
      jest.resetAllMocks();
    });
    it("it should throw an erroe if no id is provided", async () => {
      const mockData = _.cloneDeep(data);
      delete mockData.id;
      const error = new Error("No ticket ID provided");
      await expect(
        updateTicket.handler({
          config,
          data: mockData,
          database: {}
        })
      ).rejects.toEqual(error);
    });
  });
  describe("And an output format operation is required", () => {
    it("should have not update data if the result action is unknown", () => {
      let mockData = _.cloneDeep(data);
      mockData = {
        ...mockData,
        result: {
          action: "input.unknown"
        }
      };
      expect(updateTicket.formatUpdate(mockData)).toBeUndefined();
    });
  });
});
