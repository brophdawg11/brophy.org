const path = require('path');

const cheerio = require('cheerio');
const marked = require('marked');
const readingTime = require('reading-time');

const pkg = require('./package');
const { getPostsContentChain } = require('./assets/js/utils');

module.exports = {
    mode: 'universal',

    server: {
        host: '0.0.0.0',
        port: 8000,
    },

    features: {
        router: true,
        store: false,
        layouts: true,
        meta: true,
        middleware: false,
        transitions: true,
        deprecations: true,
        validate: false,
        asyncData: true,
        fetch: false,
        clientOnline: true,
        clientPrefetch: true,
        clientUseUrl: false,
        componentAliases: false,
        componentClientOnly: false,
    },

    generate: {
        async routes() {
            // eslint-disable-next-line global-require
            const { $content } = require('@nuxt/content');
            const files = await getPostsContentChain($content).fetch();

            // Generate full list of tags for all posts
            const uniq = arr => [...new Set(arr)];
            const tags = files.reduce((acc, f) => [
                ...acc,
                ...f.tags.split(',').map(t => t.trim()),
            ], []);

            return [
                ...files.map(f => f.permalink),
                ...uniq(tags).map(t => `/tag/${t}`),
            ];
        },
    },

    /*
     ** Headers of the page
     */
    head: {
        htmlAttrs: {
            lang: 'en',
        },
        title: 'Matt Brophy | Web Developer',
        meta: [
            { charset: 'utf-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            { hid: 'description', name: 'description', content: pkg.description },
            { 'http-equiv': 'x-ua-compatible', content: 'ie=edge' },
            { name: 'apple-mobile-web-app-capable', content: 'yes' },
            { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
            { name: 'apple-mobile-web-app-title', content: 'brophy.org' },
        ],
        link: [{
            rel: 'preconnect',
            href: 'https://www.google-analytics.com',
            crossorigin: '',
        }, {
            rel: 'manifest',
            href: '/manifest.json',
        }, {
            rel: 'icon',
            type: 'image/x-icon',
            href: '/favicon/favicon.ico',
        }, {
            rel: 'shortcut icon',
            type: 'image/x-icon',
            href: '/favicon/favicon.ico',
        }, {
            rel: 'icon',
            type: 'image/png',
            sizes: '32x32',
            href: '/favicon/favicon-32x32.png',
        }, {
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
        }],
    },

    css: [
        '~/static/fontello/css/icon-font.css',
        // Layout inspired by http://demo.onedesigns.com/graceunderpressure/journal/
        '~/assets/scss/index.scss',
    ],

    modules: [
        '@nuxt/content',
        ...(process.env.NODE_ENV === 'production' ? [
            '@nuxtjs/pwa',
        ] : []),
        '@nuxtjs/feed',
        ['@nuxtjs/google-analytics', {
            id: 'UA-17810974-2',
            dev: false,
        }],
    ],

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
                scss: path.resolve(__dirname, './assets/scss'),
                static: path.resolve(__dirname, './static'),
            });

            const hash = ctx.isDev ? 'hash' : 'chunkhash';
            Object.assign(config.output, {
                filename: `[name].[${hash}].js`,
                chunkFilename: `async/[name].[${hash}].js`,
            });
        },
    },

    feed: [{
        path: '/rss.xml',
        type: 'rss2',
        async create(feed) {
            // eslint-disable-next-line no-param-reassign
            feed.options = {
                title: 'Matt Brophy\'s Blog',
                link: 'https://www.brophy.org/rss.xml',
                description: 'Matt Brophy\'s Blog',
            };

            // eslint-disable-next-line global-require
            const { $content } = require('@nuxt/content');
            const posts = await getPostsContentChain($content).fetch();
            posts.forEach(post => feed.addItem({
                title: post.title,
                date: new Date(post.postDate),
                id: `https://www.brophy.org${post.permalink}`,
                link: `https://www.brophy.org${post.permalink}`,
                description: post.excerpt,
                author: [{
                    name: 'Matt Brophy',
                    email: 'matt@brophy.org',
                    link: 'https://www.brophy.org/',
                }],
            }));

            feed.addContributor({
                name: 'Matt Brophy',
                email: 'matt@brophy.org',
                link: 'https://www.brophy.org/',
            });
        },
    }],

    hooks: {
        'content:file:beforeInsert': (doc) => {
            if (doc.extension === '.md') {
                const $ = cheerio.load(marked(doc.text));
                Object.assign(doc, {
                    permalink: `/post/${doc.slug}`,
                    excerpt: $.html($('p').first())
                        .trim()
                        .replace(/^<p>/, '')
                        .replace(/<\/p>$/, ''),
                    readingTime: readingTime(doc.text).text,
                });
            }
        },
    },
};
