const { resolve } = require('path');

const ContentMetadataPlugin = require('./build/content-metadata-plugin');

const pkg = require('./package');

module.exports = {
    mode: 'universal',

    /*
     ** Headers of the page
     */
    head: {
        title: pkg.name,
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
            { rel: 'manifest', href: '/static/manifest.json' },
            { rel: 'icon', type: 'image/x-icon', href: '/favicon/favicon.ico' },
            { rel: 'shortcut icon', type: 'image/x-icon', href: '/favicon/favicon.ico' },
            { rel: 'apple-touch-icon', type: 'image/x-icon', sizes: '57x57', href: '/static/favicon/apple-touch-icon-57x57.png' },
            { rel: 'apple-touch-icon', type: 'image/x-icon', sizes: '60x60', href: '/static/favicon/apple-touch-icon-60x60.png' },
            { rel: 'apple-touch-icon', type: 'image/x-icon', sizes: '72x72', href: '/static/favicon/apple-touch-icon-72x72.png' },
            { rel: 'apple-touch-icon', type: 'image/x-icon', sizes: '76x76', href: '/static/favicon/apple-touch-icon-76x76.png' },
            { rel: 'apple-touch-icon', type: 'image/x-icon', sizes: '114x114', href: '/static/favicon/apple-touch-icon-114x114.png' },
            { rel: 'apple-touch-icon', type: 'image/x-icon', sizes: '120x120', href: '/static/favicon/apple-touch-icon-120x120.png' },
            { rel: 'apple-touch-icon', type: 'image/x-icon', sizes: '144x144', href: '/static/favicon/apple-touch-icon-144x144.png' },
            { rel: 'apple-touch-icon', type: 'image/x-icon', sizes: '152x152', href: '/static/favicon/apple-touch-icon-152x152.png' },
            { rel: 'apple-touch-icon', type: 'image/x-icon', sizes: '180x180', href: '/static/favicon/apple-touch-icon-180x180.png' },
            { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/static/favicon/favicon-32x32.png' },
            { rel: 'icon', type: 'image/png', sizes: '192x192', href: '/static/favicon/android-chrome-192x192.png' },
            { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/static/favicon/favicon-16x16.png' },
        ],

        // TODO
        // {{{ gaScripts }}}
    },

    /*
     ** Customize the progress-bar color
     */
    loading: { color: '#fff' },

    /*
     ** Global CSS
     */
    css: [
        '~/static/fontello/css/icon-font.css',
        // Layout inspired by http://demo.onedesigns.com/graceunderpressure/journal/
        '~/assets/scss/index.scss',
    ],

    /*
     ** Plugins to load before mounting the App
     */
    plugins: [
    ],

    /*
     ** Nuxt.js modules
     */
    modules: [
    // Doc: https://axios.nuxtjs.org/usage
        '@nuxtjs/axios',
        '@nuxtjs/pwa',
    ],
    /*
     ** Axios module configuration
     */
    axios: {
    // See https://github.com/nuxt-community/axios-module#options
    },

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

            if (ctx.isClient) {
                config.plugins.push(new ContentMetadataPlugin({
                    contentDir: './content',
                    outputFile: 'contents.json',
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
