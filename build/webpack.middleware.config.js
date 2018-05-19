/* eslint-disable import/no-extraneous-dependencies */
const webpack = require('webpack');
/* eslint-enable import/no-extraneous-dependencies */

const isomorphicUtils = require('../src/js/isomorphic-utils');

const environment = process.env.NODE_ENV === 'production' ?
    'production' :
    'development';

/* eslint-disable no-console */
console.log(`Webpack building for environment: ${environment}`);
/* eslint-enable no-console */

const middlewareConfig = {
    // Note: This name must begin with 'server' in order to be picked up by the
    // webpack-hot-server-middleware plugin
    name: 'server-middleware',
    mode: environment,
    entry: './src/server/vue-middleware.js',
    target: 'node',
    node: {
        __dirname: true,
        __filename: true,
    },
    output: {
        publicPath: '/dist/',
        filename: 'vue-middleware.js',
        libraryTarget: 'umd',
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
        }),
    ],
    externals(context, request, callback) {
        // Tell webpack to ignore all node_modules dependencies except
        // lodash-es so we get proper tree shaking
        const nonRelativeExp = /^\w.*$/i;
        const lodashEsExp = /^lodash-es/;
        if (nonRelativeExp.test(request) && !lodashEsExp.test(request)) {
            return callback(null, `commonjs ${request}`);
        }
        return callback();
    },
};

if (isomorphicUtils.config.isLocal) {
    // Wire up HMR on the server
    middlewareConfig.plugins = [
        new webpack.HotModuleReplacementPlugin(),
        ...middlewareConfig.plugins,
    ];
}

module.exports = middlewareConfig;
