/* eslint-disable import/no-extraneous-dependencies */
const webpack = require('webpack');
const merge = require('webpack-merge');
/* eslint-enable import/no-extraneous-dependencies */

const VueSSRClientPlugin = require('vue-server-renderer/client-plugin');

const ContentMetadataPlugin = require('./content-metadata-plugin');
const isomorphicUtils = require('../src/js/isomorphic-utils');
const base = require('./webpack.base.config');

const clientConfig = merge(base, {
    // Note: This name must begin with 'client' in order to be picked up by the
    // webpack-hot-server-middleware plugin
    name: 'client',
    entry: [
        './src/js/entry-client.js',
    ],
    plugins: [
        new webpack.DefinePlugin({ 'process.env.VUE_ENV': '"client"' }),
        new VueSSRClientPlugin(),
        new ContentMetadataPlugin({
            contentDir: './content',
            outputFile: 'contents.json',
            stringifyOptions: {
                spaces: 4,
            },
        }),
    ],
});

if (isomorphicUtils.config.isLocal) {
    // Wire up HMR on the client
    clientConfig.entry = [
        'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000',
        ...clientConfig.entry,
    ];
    clientConfig.plugins = [
        new webpack.HotModuleReplacementPlugin(),
        ...clientConfig.plugins,
    ];
}

module.exports = clientConfig;
