"use strict";

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");

const { getTrigger, getFailTopic, publishEvent } = require("./utils");

const example = require("./example/example");

if (!process.env.FIREBASE_CONFIG) {
  admin.initializeApp({
    databaseURL: "https://oraculo-zendesk.firebaseio.com/",
    projectId: "oraculo-zendesk"
  });
} else admin.initializeApp();

const database = admin.firestore();

/** EXEMPLE OF A FUNCTION HTTP */

/**
 * @name slsFirebaseNodejs
 * @description Method used to create a function http on server
 * @param {Function} req request to server
 * @param {Function} res response to users
 */
exports.slsFirebaseNodejs = functions.https.onRequest(async (req, res) => {
  try {
    let data;
    switch (req.method) {
      case "GET":
        res
          .status(200)
          .send("GET")
          .end();
        break;
      case "POST":
        data = req.body;
        const response = example.handler({ data, database });
        res
          .status(200)
          .send(response)
          .json()
          .end();
        break;
      default:
        res.sendStatus(405).end();
        break;
    }
  } catch (error) {
    if (error.code) res.status(error.code);
    res.send(error.message).end();
  }
});

/** EXAMPLE OF A FUNCTION PUBSUB */
/**
 * @name registryFunction
 * @description Method used to registry a new function to the current module
 * @param {Object} setup Object with the informations to setup a new function
 * @param {Object} setup.opperator Object reference for the module that holds the function handler (must inplement one method named handler)
 * @param {string} setup.functionName String that represents the function name to be registry at Firebase
 * @param {string} setup.trigger String that holds the function trigger name
 */
const registryFunction = ({ opperator, functionName, trigger }) => {
  exports[functionName] = functions.pubsub
    .topic(getTrigger(trigger))
    .onPublish(async event => {
      try {
        return await opperator.handler({
          config: event.json.config,
          data: event.json.data,
          database: admin.database()
        });
      } catch (error) {
        console.error(error);
        event.json.error = error;
        await publishEvent(event.json, getFailTopic(trigger));
      }
    });
};

const examplePubsub = require("./example/example-pubsub");

registryFunction({
  opperator: examplePubsub,
  functionName: "examplePubsub",
  trigger: "example-pubsub"
});

/** EXEMPLE OF A API REST */

const app = express();

const corsOptions = {
  origin: true,
  allowedHeaders: [
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Origin",
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept"
  ],
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
  preflightContinue: false,
  credentials: true
};

// Automatically allow cross-origin requests
app.use(cors(corsOptions));

app.get("/", async (req, res) => {
  try {
    const data = req.body;
    const response = example.handler({ data, database });
    res
      .status(200)
      .send(response)
      .json()
      .end();
  } catch (error) {
    console.error(error);
    if (error.code) res.status(error.code);
    res.send(error.message).end();
  }
});

exports.slsFirebaseNodejs = functions.https.onRequest(app);
