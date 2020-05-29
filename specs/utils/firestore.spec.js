"use strict";

const { FirestoreApi } = require("../../utils/firestore");

jest.mock("../../utils/firestore");

describe("Firestore", () => {
  describe("Given an action should do these operations", () => {
    afterEach(() => {
      jest.resetAllMocks();
      jest.restoreAllMocks();
    });
    beforeEach(() => {
      FirestoreApi.mockClear();
    });

    it("should be defined", () => {
      expect(FirestoreApi).toBeDefined();
    });

    it("should get project specific of firestore", async () => {
      const firestore = new FirestoreApi({ name: "banana" });
      firestore.getProjects("projectId", "==", "123");
      expect(firestore.getProjects).toBeCalledWith("projectId", "==", "123");
    });
  });
});
