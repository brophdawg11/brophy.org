const path = require('path');

/* eslint-disable import/no-extraneous-dependencies */
const webpack = require('webpack');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
/* eslint-enable import/no-extraneous-dependencies */


const environment = process.env.NODE_ENV === 'production' ?
    'production' :
    'development';

/* eslint-disable no-console */
console.log('process.env.NODE_ENV', process.env.NODE_ENV);
console.log(`Webpack building for environment: ${environment}`);
/* eslint-enable no-console */

module.exports = {
    mode: environment,
    output: {
        publicPath: '/dist/',
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
                'css-loader',
            ],
        }, {
            test: /\.scss$/,
            use: [
                'vue-style-loader',
                'css-loader',
                'sass-loader',
            ],
        }, {
            test: /\.md$/,
            use: 'markdown-with-front-matter-loader',
        }],
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
        }),
        new VueLoaderPlugin(),
    ],
};
