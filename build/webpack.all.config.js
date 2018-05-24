const client = require('./webpack.client.config');
const server = require('./webpack.server.config');
const middleware = require('./webpack.middleware.config');

// Expose a webpack multi-config build so we can run all builds in a single
// webpack build
module.exports = [
    client,
    server,
    middleware,
];
