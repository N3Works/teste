'use strict'

const axios = require('axios');
const ZendeskAPI = require('@kiina/zendesk-api');

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
    const url = `${config.api}/search.json?query=${config.query}`;
    const response = await axios.request({
        url,
        method: 'GET',
        auth: {
            username: config.username,
            password: config.password
        },
        headers: {
            'Content-type': 'application/json',
            'Authorization': `Bearer ${config.accessToken}`
        }
    });
    return response.data.results;
};

/**
 * @name handler
 * @async
 * @description Method used to handle the Zendesk Webhook opperation
 * @param {Object} data
 * @param {Object} database Firebase Realtime instance
 */
exports.handler = async (data, database) => {
    const config = await this.getCredentials(database);
    const result = await this.search(config.crm);
    return null;
};