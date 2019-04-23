"use strict";

const _ = require("lodash");

const utils = require("../../utils");
const updateTicket = require("../../update-ticket/update-ticket");
const ZendeskApi = require("@kiina/zendesk-api");

const data = { id: "123", outputText: "bye bye" };
const config = {
  crm: {
    api: "api",
    username: "user",
    password: "1234",
    subdomain: "teste"
  }
};
const update = {
  ticket: {
    comment: {
      body: data.outputText
    }
  }
};

jest.mock("../../utils");
jest.mock("@kiina/zendesk-api");

describe("Zendesk Webhook", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });
  describe("Given an update request is fired", () => {
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

    it("should update ticket", async () => {
      ZendeskApi.prototype.tickets = {
        updateTicket: jest.fn().mockResolvedValue()
      };

      await expect(
        updateTicket.updateTicket(config.crm, data.id, update)
      ).resolves.toBeUndefined();
    });
  });
  describe("Given an output format operation is required", () => {
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

    it("should return the updated ticket format", () => {
      let mockData = _.cloneDeep(data);
      mockData = {
        ...mockData,
        result: {}
      };
      expect(updateTicket.formatUpdate(mockData)).toEqual(update);
    });

    it("should have not update tags if the result action is unknown", () => {
      let mockData = _.cloneDeep(data);
      mockData = {
        ...mockData,
        result: {
          action: "input.unknown"
        }
      };
      expect(updateTicket.formatTagsUpdate(mockData)).toEqual({
        tags: ["AI_sem_sucesso"]
      });
    });
    it("should return the format of the tags updated", () => {
      let mockData = _.cloneDeep(data);
      mockData = {
        ...mockData,
        result: {}
      };
      expect(updateTicket.formatTagsUpdate(mockData)).toEqual({
        tags: ["AI_sucesso"]
      });
    });
  });
});
