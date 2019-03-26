'use strict'

const { getSuccessTopic, publishEvent, runZendeskOperation } = require('../utils');

/**
 * @name getCredentials
 * @async
 * @description Method used to retrieve the zendesk credentials from the database
 * @param {Object} database Firebase Realtime instance
 * @returns {Object} The Zendesk credentials
 */
exports.getCredentials = async (database) => {
    const snapshot = await database
        .ref('projects/serasa-mpme').once('value');
    return snapshot.val();
};

/**
 * @name search
 * @async
 * @description Method used to run a given query into Zendesk database and return its results
 * @param {Object} config Zendesk credentials and query
 * @returns {Array<Objects>} It returns the list of objects found into the Zendesk database
 * @todo It should use the zendesk-api for Kiina projects @see `@kiina/zendesk-api`
 */
exports.search = async (config) => {
    const uri = `/search.json?query=${config.query}`;
    const response = await runZendeskOperation(config, uri);
    return response.results;
};

/**
 * @name handler
 * @async
 * @description Method used to handle the Zendesk Webhook opperation
 * @param {Object} event
 * @param {Object} event.data
 * @param {Object} event.config
 * @param {Object} event.database Firebase Realtime instance
 */
exports.handler = async ({ data, database }) => {
    const config = await this.getCredentials(database);
    const result = await this.search(config.crm);
    result.forEach(async res => {
        const outputData = {
            config: config,
            data: Object.assign(data, res)
        };
        await publishEvent(outputData, getSuccessTopic('zendesk-search'));
    });
};