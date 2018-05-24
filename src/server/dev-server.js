const express = require('express');
const path = require('path');

const createServer = require('./create-server');
const { isLocal } = require('../js/isomorphic-utils').config;
const logger = require('../js/logger');

const enhancedApp = createServer(app => {
    // Static asset routes
    app.use('/dist', express.static(path.resolve(__dirname, '../../dist')));
    app.use('/static', express.static(path.resolve(__dirname, '../../static')));

    // Setup HMR in local development environment
    if (isLocal) {
        // Allow inline require here so we don't bundle the HMR module in prod
        // environments
        /* eslint-disable global-require */
        require('./hot')(app);
        /* eslint-enable global-require */
    }
});

const server = enhancedApp.listen(process.env.PORT || 8080, () => {
    logger.green.info(`Server listening at http://localhost:${server.address().port}/`);
});
