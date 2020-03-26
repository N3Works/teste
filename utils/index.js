'use strict'

const FirestoreApi = require('./firestore');

module.exports = {
    FirestoreApi,
    ...require('./events')
};