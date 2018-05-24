const compression = require('compression');
const express = require('express');

// Turn off no-unresolved since this is a build dependency that won't always
// exist at dev and linting time
/* eslint-disable import/no-unresolved */
const vueMiddleware = require('../../dist/vue-middleware');
/* eslint-enable import/no-unresolved */

module.exports = function createServer(enhanceApp) {
    const app = express();

    // Define plugins
    app.use(compression());

    if (typeof enhanceApp === 'function') {
        enhanceApp(app);
    }

    // Send the rest of the routes into the Vue Middleware for SSR
    app.use('/', vueMiddleware.default());
    return app;
};
