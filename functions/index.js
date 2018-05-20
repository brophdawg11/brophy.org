const functions = require('firebase-functions');

/* eslint-disable import/no-unresolved */
const server = require('./src/server/server');
/* eslint-enable import/no-unresolved */

exports.server = functions.https.onRequest(server.handler);
