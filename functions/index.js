const functions = require('firebase-functions');
const server = require('./src/server/server');

exports.helloWorld = functions.https.onRequest((request, response) => {
    response.send('Hello from Firebase!');
});

exports.server = functions.https.onRequest(server.handler);
