'use strict'

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
 * @name handler
 * @async
 * @description Method used to handle the Zendesk Webhook opperation
 * @param {Object} data
 * @param {Object} database Firebase Realtime instance
 */
exports.handler = async (data, database) => {
    const config = await this.getCredentials(database);
    return null;
};