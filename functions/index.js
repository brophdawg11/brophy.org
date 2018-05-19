const functions = require('firebase-functions');
const server = require('./src/server/server');

exports.server = functions.https.onRequest(server.handler);
