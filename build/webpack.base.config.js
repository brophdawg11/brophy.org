const path = require('path');

/* eslint-disable import/no-extraneous-dependencies */
const webpack = require('webpack');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
/* eslint-enable import/no-extraneous-dependencies */

const isomorphicUtils = require('../src/js/isomorphic-utils');

const { isProd } = isomorphicUtils.config;
const environment = isProd ? 'production' : 'development';

/* eslint-disable no-console */
console.log('process.env.NODE_ENV', process.env.NODE_ENV);
console.log(`Webpack building for environment: ${environment}`);
/* eslint-enable no-console */

module.exports = {
    mode: environment,
    output: {
        publicPath: '/dist/',
        filename: '[name].h.[hash].js',
        chunkFilename: 'chunk-[name].h.[chunkhash].js',
    },
    resolve: {
        alias: {
            '@content': path.resolve(__dirname, '../content'),
            '@components': path.resolve(__dirname, '../src/components'),
            '@dist': path.resolve(__dirname, '../dist'),
            '@js': path.resolve(__dirname, '../src/js'),
            '@scss': path.resolve(__dirname, '../src/scss'),
            '@server': path.resolve(__dirname, '../src/server'),
            '@src': path.resolve(__dirname, '../src'),
            '@static': path.resolve(__dirname, '../static'),
            '@store': path.resolve(__dirname, '../src/store'),
        },
        extensions: [ '*', '.js', '.vue', '.json' ],
    },
    module: {
        rules: [{
            test: /\.vue$/,
            loader: 'vue-loader',
        }, {
            test: /\.js$/,
            loader: 'babel-loader',
            exclude: /node_modules/,
        }, {
            test: /\.css$/,
            use: [
                'vue-style-loader',
                { loader: 'css-loader', options: { minimize: isProd } },
            ],
        }, {
            test: /\.scss$/,
            use: [
                'vue-style-loader',
                { loader: 'css-loader', options: { minimize: isProd } },
                'sass-loader',
            ],
        }, {
            test: /\.md$/,
            use: 'markdown-with-front-matter-loader',
        }, {
            test: /logo\.png$/,
            use: 'base64-inline-loader?limit=1000&name=[name].[ext]',
        }, {
            test: /\.(ttf|woff2?|eot|svg)$/,
            use: {
                loader: 'url-loader',
                options: {
                    limit: 8192,
                },
            },
        }],
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
        }),
        new VueLoaderPlugin(),
    ],
};
