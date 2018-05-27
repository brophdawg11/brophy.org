const fs = require('fs');
const path = require('path');
const VSR = require('vue-server-renderer');

/* eslint-disable import/no-unresolved */
const serverBundle = require('../../dist/vue-ssr-server-bundle.json');
const clientManifest = require('../../dist/vue-ssr-client-manifest.json');
/* eslint-enable import/no-unresolved */

const { config } = require('@js/isomorphic-utils');

const USE_STREAM = true;

const renderer = VSR.createBundleRenderer(serverBundle, {
    runInNewContext: false,
    // Note: __dirname will be relative to dist/ due to webpack build
    template: fs.readFileSync(path.resolve(__dirname, '../index.tpl.html'), 'utf-8'),
    clientManifest,
});

let gaScripts = '';

if (config.isProd) {
    gaScripts = `
        <!-- Global site tag (gtag.js) - Google Analytics -->
        <script async src="https://www.googletagmanager.com/gtag/js?id=UA-17810974-2"></script>
        <script>
            window.dataLayer = window.dataLayer || [];
            function gtag() { dataLayer.push(arguments); }
            gtag('js', new Date());
            gtag('config', 'UA-17810974-2');
        </script>
    `;
}

function setCacheControl(res, enable) {
    // No caching for now - need to figure out how to coordinate cache updates.
    //  - cloud function v1 requests hosted v1 assets
    //  - Deploy v2
    //  - hosted v1 assets start to 404
    //  - CDN cached v1 cloud function still requests broken v1 assets until
    //    v2 function starts propagating
    // const policy = enable ? 'public, max-age=300, s-maxage=600' : 'private';
    const policy = enable ? 'private' : 'private';
    res.set('Cache-Control', policy);
}

function handleError(err, res) {
    // Remove any cache congtrol header that was previously set, so long as
    // we haven't sent any headers yet
    if (!res.headersSent) {
        setCacheControl(res, false);
    }
    if (err.code) {
        return res.status(err.code).send(err.message);
    }
    return res.status(500).end(`Internal Server Error: ${err}`);
}

function renderToString(context, res) {
    renderer.renderToString(context, (err, html) => {
        if (err) {
            return handleError(err, res);
        }
        setCacheControl(res, true);
        return res.end(html);
    }, e => res.status(500).end(e));
}

function renderToStream(context, res) {
    const stream = renderer.renderToStream(context);
    setCacheControl(res, true);
    stream.on('data', data => res.write(data.toString()));
    stream.on('end', () => res.end());
    stream.on('error', err => handleError(err, res));
}

// Render a given route using the Vue bundle renderer
function render(req, res) {
    // Global context for Server side template
    const context = {
        title: 'Matt Brophy\'s Website',
        req,
        res,
        url: req.url,
        initialState: null,
        gaScripts,
    };

    // Render the appropriate Vue components into the renderer template
    // using the server render logic in entry-server.js
    return USE_STREAM ?
        renderToStream(context, res) :
        renderToString(context, res);
}

export default function vueMiddleware() {
    return (req, res) => render(req, res);
}
