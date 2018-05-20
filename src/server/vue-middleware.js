const fs = require('fs');
const path = require('path');
const VSR = require('vue-server-renderer');

/* eslint-disable import/no-unresolved */
const serverBundle = require('../../dist/vue-ssr-server-bundle.json');
const clientManifest = require('../../dist/vue-ssr-client-manifest.json');
/* eslint-enable import/no-unresolved */

const USE_STREAM = true;

const renderer = VSR.createBundleRenderer(serverBundle, {
    runInNewContext: false,
    // Note: __dirname will be relative to dist/ due to webpack build
    template: fs.readFileSync(path.resolve(__dirname, '../index.tpl.html'), 'utf-8'),
    clientManifest,
    shouldPrefetch() {
        return false;
    },
});

function handleError(err, res) {
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
        return res.end(html);
    }, e => res.status(500).end(e));
}

function renderToStream(context, res) {
    const stream = renderer.renderToStream(context);
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
