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
    plugins: [
        '~/plugins/index.js',
    ],
    /*
    ** Build configuration
    */
    build: {
        /*
        ** Run ESLint on save
        */
        extend(config, ctx) {
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
};
