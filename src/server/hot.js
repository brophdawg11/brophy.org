/* eslint-disable global-require,import/no-extraneous-dependencies */
const assert = require('assert');
const webpack = require('webpack');

const logger = require('../js/logger');
const isomorphicUtils = require('../js/isomorphic-utils.js');
const clientConfig = require('../../build/webpack.client.config');
const serverConfig = require('../../build/webpack.middleware.config');

const compiler = webpack([ clientConfig, serverConfig ]);
const clientCompiler = compiler.compilers.find(c => c.name === 'client');

module.exports = function setupHMR(app) {
    assert(isomorphicUtils.config.isLocal,
        'HMR should only be imported in local environments');

    logger.cyan.info('Registering HMR server and client middleware');

    app.use(require('webpack-dev-middleware')(compiler, {
        logLevel: 'warn',
        publicPath: clientConfig.output.publicPath,
        serverSideRender: true,
    }));

    app.use(require('webpack-hot-middleware')(clientCompiler, {
        log: logger.info,
        path: '/__webpack_hmr',
        heartbeat: 10 * 1000,
    }));

    app.use(require('webpack-hot-server-middleware')(compiler));
};
