/* eslint-disable import/no-extraneous-dependencies */

const path = require('path');

const cssnano = require('cssnano');
const webpack = require('webpack');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const VisualizerPlugin = require('webpack-visualizer-plugin');

const isomorphicUtils = require('../src/js/isomorphic-utils');

const { isProd } = isomorphicUtils.config;
const environment = isProd ? 'production' : 'development';

/* eslint-disable no-console */
console.log('process.env.NODE_ENV', process.env.NODE_ENV);
console.log(`Webpack building for environment: ${environment}`);
/* eslint-enable no-console */

function serverExternals(context, request, callback) {
    // Tell webpack to ignore all node_modules dependencies except
    // lodash-es so we get proper tree shaking
    const nonRelativeExp = /^\w.*$/i;
    const lodashEsExp = /^lodash-es/;
    if (nonRelativeExp.test(request) && !lodashEsExp.test(request)) {
        return callback(null, `commonjs ${request}`);
    }
    return callback();
}

const cssLoaders = [{
    loader: 'css-loader',
    options: {
        importLoaders: 1,
    },
}, {
    loader: 'postcss-loader',
    options: {
        config: {
            ctx: {
                isProd,
                cssnano,
            },
        },
    },
}];

module.exports = function getBaseConfig(type) {
    return {
        mode: environment,
        output: {
            publicPath: '/dist/',
            filename: isProd ? '[name].[chunkhash].js' : '[name].js',
            chunkFilename: isProd ? 'async/[name].[chunkhash].js' : 'async/[name].js',
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
            },
            extensions: [ '*', '.js', '.vue', '.json' ],
        },
        externals: type === 'client' ? '' : serverExternals,
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
                    ...cssLoaders,
                ],
            }, {
                test: /\.scss$/,
                use: [
                    'vue-style-loader',
                    ...cssLoaders,
                    'sass-loader',
                ],
            }, {
                test: /\.md$/,
                use: './build/markdown-loader',
            }, {
                test: /\.(ttf|woff2?|eot|svg|jpg|gif|png)$/,
                oneOf: [{
                    resourceQuery: /logo\.png$/,
                    use: 'base64-inline-loader?limit=1000&name=[name].[ext]',
                }, {
                    use: {
                        loader: 'url-loader',
                        options: {
                            limit: 8192,
                        },
                    },
                }],
            }],
        },
        plugins: [
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
            }),
            new VueLoaderPlugin(),
            new VisualizerPlugin(),
        ],
    };
};
