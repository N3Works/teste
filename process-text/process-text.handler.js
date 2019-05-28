"use strict";

const uuid = require("uuid");
const MLProcessor = require("@kiina/ml-processor");

const utils = require("../utils");
const messages = utils.getErrorMessages();

/**
 * @description Method used to check if the agentId is present as a message attribute
 * @throws throw a error if no agentId is found
 * @param {Object} nlp NLP configuration object
 * @returns {Object} It returns the given nlp object
 */
const checkAgentId = nlp => {
  if (nlp.agentId) return nlp;
  else utils.throwError(messages.agent_missing);
};

/**
 * @description Method used to check if the sessionId is present as a message attribute
 * @param {string} sessionId
 * @returns {string} it returns the given sessionId or creates a new one
 */
exports.checkSessionId = sessionId => {
  if (sessionId) return sessionId;
  else return uuid.v4();
};

/**
 * @description Method used to request the DialogFlow for the message intent
 * @async
 * @throws Intent detection error
 * @param {Object} nlp NLP configuration object
 * @param {string} inputText Text to be process
 * @param {string} sessionId
 * @returns The objects that contains the corresponding intent and its fulfillment attributes
 */
const detectIntent = async (nlp, inputText, sessionId, origin) => {
  const token = origin ? nlp[origin].accessToken : nlp.accessToken;
  const processor = new MLProcessor(token);
  return await processor.processText(inputText.slice(0, 255), sessionId);
};

/**
 * @name parseText
 * @description Method used to replace line break and curly braces markup by its correspondent string
 * @param {string} text Dialogflow result text
 * @returns {string} text parsed
 */
const parseText = text => {
  return text
    .replace(/\\n/g, "/n")
    .replace(/\{/g, "{")
    .replace(/\}/g, "}");
};

/**
 * @description Method used to process text using the DialogFlow
 * @async
 * @param {Object} event
 * @param {Object} event.data Given data for the current opperation
 * @param {Object} event.config Project configuration and credentials object
 */
exports.handler = async ({ data, config }) => {
  checkAgentId(config.nlp);
  data.sessionId = this.checkSessionId(data.sessionId);
  data.result = await detectIntent(config.nlp, data.inputText, data.sessionId, data.origin);
  data.outputText = parseText(data.result.fulfillment.speech);
  await utils.publishEvent(
    { data, config },
    utils.getSuccessTopic("df-process-text")
  );
};
