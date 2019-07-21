const { resolve } = require('path');

const { ContentMetadataPlugin, readContents } = require('./build/content-metadata-plugin');

const pkg = require('./package');

module.exports = {
    mode: 'universal',

    generate: {
        async routes() {
            const contents = await readContents(resolve(__dirname, './content'));
            const uniq = arr => [ ...new Set(arr) ];
            const tags = uniq(contents.reduce((acc, c) => [
                ...acc,
                ...c.tags.split(',').map(t => t.trim()),
            ], []));
            return [
                ...contents.map(c => `/post/${c.slug}`),
                ...tags.map(t => `/tag/${t}`),
            ];
        },
    },

    /*
     ** Headers of the page
     */
    head: {
        title: pkg.description,
        meta: [
            { charset: 'utf-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            { hid: 'description', name: 'description', content: pkg.description },
            { 'http-equiv': 'x-ua-compatible', content: 'ie=edge' },
            { name: 'apple-mobile-web-app-capable', content: 'yes' },
            { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
            { name: 'apple-mobile-web-app-title', content: 'brophy.org' },
        ],
        link: [
            {
                rel: 'manifest',
                href: '/manifest.json',
            },
            {
                rel: 'icon',
                type: 'image/x-icon',
                href: '/favicon/favicon.ico',
            },
            {
                rel: 'shortcut icon',
                type: 'image/x-icon',
                href: '/favicon/favicon.ico',
            },
            {
                rel: 'icon',
                type: 'image/png',
                sizes: '32x32',
                href: '/favicon/favicon-32x32.png',
            },
            {
                rel: 'icon',
                type: 'image/png',
                sizes: '16x16',
                href: '/favicon/favicon-16x16.png',
            },
            ...([
                '57x57',
                '60x60',
                '72x72',
                '76x76',
                '114x114',
                '120x120',
                '144x144',
                '152x152',
                '167x167',
                '180x180',
            ].map(size => ({
                rel: 'apple-touch-icon',
                type: 'image/x-icon',
                sizes: size,
                href: `/favicon/apple-touch-icon-${size}.png`,
            }))),
            {
                rel: 'icon',
                type: 'image/png',
                sizes: '192x192',
                href: '/favicon/android-chrome-192x192.png',
            },
        ],

        // TODO
        // {{{ gaScripts }}}
    },

    /*
     ** Global CSS
     */
    css: [
        '~/static/fontello/css/icon-font.css',
        // Layout inspired by http://demo.onedesigns.com/graceunderpressure/journal/
        '~/assets/scss/index.scss',
    ],

    /*
     ** Nuxt.js modules
     */
    modules: [
        '@nuxtjs/pwa',
        [ '@nuxtjs/google-analytics', {
            id: 'UA-17810974-2',
            dev: false,
        }],
    ],

    /*
     ** Build configuration
     */
    build: {
        babel: {
            plugins: [
                // Allow proper tree shaking of lodash ES6 named imports
                'lodash',
            ],
        },

        transpile: [
            'lodash-es',
        ],

        /*
         ** You can extend webpack config here
         */
        extend(config, ctx) {
            Object.assign(config.resolve.alias, {
                scss: resolve(__dirname, './assets/scss'),
                static: resolve(__dirname, './static'),
            });

            config.module.rules.push({
                test: /\.md$/,
                use: './build/markdown-loader',
            });

            const hash = ctx.isDev ? 'hash' : 'chunkhash';
            Object.assign(config.output, {
                filename: `[name].[${hash}].js`,
                chunkFilename: `async/[name].[${hash}].js`,
            });

            if (ctx.isClient) {
                config.plugins.push(new ContentMetadataPlugin({
                    pretty: ctx.isDev,
                    debug: true,
                }));

                if (ctx.isDev) {
                    // Run ESLint on save
                    config.module.rules.push({
                        enforce: 'pre',
                        test: /\.(js|vue)$/,
                        loader: 'eslint-loader',
                        exclude: /(node_modules)/,
                    });
                }
            }
        },
    },
};
