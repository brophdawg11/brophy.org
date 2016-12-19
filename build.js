const metalsmith = require('metalsmith'),
    assets = require('metalsmith-assets'),
    metadata = require('metalsmith-metadata-directory'),
    collections = require('metalsmith-collections'),
    excerpts = require('metalsmith-excerpts'),
    markdown = require('metalsmith-markdown'),
    typography = require('metalsmith-typography'),
    permalinks = require('metalsmith-permalinks'),
    serve = require('metalsmith-serve'),
    templates = require('metalsmith-layouts'),
    feed = require('metalsmith-feed'),
    sass = require('metalsmith-sass'),
    watch = require('metalsmith-watch'),
    icons = require('metalsmith-icons'),
    metalsmithDebug = require('metalsmith-debug'),
    nunjucks = require('nunjucks'),
    cmdArgs = require('yargs').argv,
    _ = require('lodash'),

    // Metalsmith plugins
    debugVerbose = require('./src/plugins/debug-verbose'),
    metadataPatch = require('./src/plugins/metadata-patch'),
    nunjucksLibraries = require('./src/plugins/nunjucks-libraries'),

    // Nunjucks filters
    nunjucksJsonFilter = require('./src/nunjucks/json-filter'),
    nunjucksMdFilter = require('./src/nunjucks/markdown-filter'),

    // Global configuration data
    globalData = require('./contents/global.json');

/* eslint-disable no-unused-vars */
let builder;
/* eslint-enable no-unused-vars */

builder =
    metalsmith(__dirname)
        .metadata({
            site: {
                url: globalData.url,
            },
        })
        // Read all input from contents/
        .source('./contents')
        // Write all output to output/
        .destination('./output')
        // Workaround for metalsmith.metadata issue on watching files
        // See: https://github.com/segmentio/metalsmith-collections/issues/27#issuecomment-266647074
        .use(metadataPatch())
        // Clean the output directory each time
        .clean(true)
        // Copy static assets from assets/ -> assets/
        .use(assets({
            source: './assets',
            destination: './assets',
        }))
        // Load external libraries into the nunjucks environment (moment, _)
        .use(nunjucksLibraries())
        // Copy all .json files into global metadata for easy access
        //   resume.json -> metadata.resume = {}
        .use(metadata({
            directory: 'contents/**/*.json',
        }))
        // Process markdown files
        .use(markdown())
        // Run files through typography plugin for formatting
        .use(typography({
            lang: 'en',
        }))
        // Generate post excerpts
        .use(excerpts())
        // Define a posts collection of all posts, to be rendered to /post/title
        .use(collections({
            posts: {
                pattern: 'post/**.html',
                sortBy: 'date',
                reverse: true,
            },
        }))
        // Compile scss files from contents/
        .use(sass({
            outputStyle: 'expanded',
        }))
        // Generate permalinks
        //   contents/post/test-post -> /post/test-post/index.html
        .use(permalinks({
            relative: false,
        }))
        // Register the rendering engine
        .use(templates({
            engine: 'nunjucks',
            directory: 'templates',
            // Function add nunjucks specific functionality
            exposeConsolidate(requires) {
                _.set(requires, 'nunjucks', nunjucks.configure());
                nunjucksMdFilter.install(requires.nunjucks);
                nunjucksJsonFilter.install(requires.nunjucks);
            },
        }))
        // Generate an RSS feed
        .use(feed({
            collection: 'posts',
            title: globalData.rss.title,
        }))
        // Use the Fontello icons plugin to scrape for used fonts and generate
        // a font icon file
        .use(icons({
            sets: {
                fa: 'fontawesome',
            },
            fontello: {
                name: 'icons',
            },
            fontDir: 'fonts',
        }));

if (cmdArgs.serve) {
    builder = builder.use(serve({
        port: 8080,
        verbose: true,
    }));
}

if (cmdArgs.watch) {
    builder = builder.use(watch({
        pattern: '**/*',
        livereload: true,
    }));
}

if (cmdArgs.debug) {
    builder = builder.use(metalsmithDebug())
                     .use(debugVerbose());
}

builder = builder.build((err) => {
    /* eslint-disable no-console */
    if (err) {
        console.error(err);
    } else {
        console.log('Site build complete!');
    }
    /* eslint-enable no-console */
});
