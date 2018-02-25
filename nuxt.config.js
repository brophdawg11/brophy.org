const hljs = require('highlight.js');

const isProd = process.env.BUILD_ENV === 'production';

module.exports = {
    /*
    ** Headers of the page
    */
    head: {
        title: 'brophy.org',
        meta: [{
            charset: 'utf-8',
        }, {
            'http-equiv': 'x-ua-compatible',
            content: 'ie=edge',
        }, {
            name: 'viewport',
            content: 'width=device-width, initial-scale=1',
        }, {
            hid: 'description',
            name: 'description',
            content: 'Matt Brophy\'s personal website (brophy.org)',
        }],
        link: [{
            rel: 'icon',
            type: 'image/x-icon',
            href: '/favicon/favicon.ico',
            // @todo: Add remaining favicons
        }, {
            href: 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/atom-one-light.min.css',
            rel: 'stylesheet',
            type: 'text/css',
        }, {
            href: 'http://fonts.googleapis.com/css?family=Rokkitt:400,700|Lato:400,300',
            rel: 'stylesheet',
            type: 'text/css',
        }, {
            href: '/fontello/css/icon-font.css',
            rel: 'stylesheet',
            type: 'text/css',
        }],
    },
    /*
    ** Customize the progress bar color
    */
    loading: { color: '#3B8070' },
    modules: [
        'nuxtent',
    ],
    plugins: [
        '~/plugins/index.js',
    ],
    generate: {
        interval: 100,
        routes: [
            '/tag/angular',
            '/tag/angularjs',
            '/tag/blog',
            '/tag/frp',
            '/tag/functional',
            '/tag/javascript',
            '/tag/metalsmith',
            '/tag/reactive',
            '/tag/spa',
            '/tag/ssg',
            '/tag/vue',
        ],
        minify: {
            collapseBooleanAttributes: true,
            collapseWhitespace: false,
            decodeEntities: true,
            minifyCSS: isProd,
            minifyJS: isProd,
            processConditionalComments: true,
            removeAttributeQuotes: false,
            removeComments: isProd,
            removeEmptyAttributes: true,
            removeOptionalTags: true,
            removeRedundantAttributes: true,
            removeScriptTypeAttributes: false,
            removeStyleLinkTypeAttributes: false,
            removeTagWhitespace: false,
            sortAttributes: isProd,
            sortClassName: false,
            trimCustomFragments: true,
            useShortDoctype: true,
        },
    },
    /*
    ** Build configuration
    */
    build: {
        /*
        ** Run ESLint on save
        */
        extend(/* config, ctx */) {
            // if (ctx.dev && ctx.isClient) {
            //   config.module.rules.push({
            //     enforce: 'pre',
            //     test: /\.(js|vue)$/,
            //     loader: 'eslint-loader',
            //     exclude: /(node_modules)/
            //   })
            // }
        },
    },
    nuxtent: {
        content: {
            page: '/pages/post/_slug',
            permalink: '/post/:slug',
            isPost: false,
            generate: [
                'get',
                'getAll',
            ],
        },
        parsers: {
            md: {
                extend(config) {
                    config.highlight = (code) => {
                        try {
                            const highlighted = hljs.highlightAuto(code).value;
                            return `<pre><code class="hljs">${highlighted}</code></pre>`;
                        } catch (e) {
                            console.warn('Error encountered using highlight.js:', e);
                        }
                        return code;
                    };
                },
            },
        },
    },
};
