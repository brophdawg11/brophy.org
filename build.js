var metalsmith = require('metalsmith'),
    assets = require('metalsmith-assets'),
    metadata = require('metalsmith-metadata-directory'),
    branch = require('metalsmith-branch'),
    collections = require('metalsmith-collections'),
    excerpts = require('metalsmith-excerpts'),
    markdown = require('metalsmith-markdown'),
    typography = require('metalsmith-typography'),
    permalinks = require('metalsmith-permalinks'),
    serve = require('metalsmith-serve'),
    templates = require('metalsmith-layouts'),
    sass = require('metalsmith-sass'),
    watch = require('metalsmith-watch'),
    icons = require('metalsmith-icons'),
    debug = require('metalsmith-debug'),
    nunjucks = require('nunjucks'),
    nunjucksJsonFilter = require('./plugins/nunjucks-json-filter'),
    nunjucksMdFilter = require('./plugins/nunjucks-markdown-filter'),
    debugVerbose = require('./plugins/debug-verbose'),
    nunjucksLibraries = require('./plugins/nunjucks-libraries'),
    moment = require('moment'),
    cmdArgs = require('yargs').argv,
    _ = require('lodash'),
    builder;

builder =
    metalsmith(__dirname)
        // Read all input from contents/
        .source('./contents')
        // Write all output to output/
        .destination('./output')
        // Workaround for metalsmith.metadata issue on watching files
        // See: https://github.com/segmentio/metalsmith-collections/issues/27#issuecomment-266647074
        .use((files, metalsmith, done) => {
            setImmediate(done);
            metalsmith.metadata({
                site: {},
                package: require( './package.json')
            });
        })
        // Clean the output directory each time
        .clean(true)
        // Copy static assets from assets/ -> assets/
        .use(assets({
            source: './assets',
            destination: './assets'
        }))
        // Load external libraries into the nunjucks environment (moment, _)
        .use(nunjucksLibraries())
        // Copy all .json files into global metadata for easy access
        //   resume.json -> metadata.resume = {}
        .use(metadata({
            directory: 'contents/**/*.json'
        }))
        // Process markdown files
        .use(markdown())
        // Run files through typography plugin for formatting
        .use(typography({
            lang: "en"
        }))
        // Generate post excerpts
        .use(excerpts())
        // Define a posts collection of all posts, to be rendered to /post/title
        .use(collections({
            posts: {
                pattern: 'post/**.html',
                sortBy: 'date',
                reverse: true
            }
        }))
        // Compile scss files from contents/
        .use(sass({
            outputStyle: "expanded"
        }))
        // Generate permalinks
        //   contents/post/test-post -> /post/test-post/index.html
        .use(permalinks({
            relative: false
        }))
        // Register the rendering engine
        .use(templates({
            engine: 'nunjucks',
            // Function add nunjucks specific functionality
            exposeConsolidate: function (requires) {
                requires.nunjucks = nunjucks.configure();
                nunjucksMdFilter.install(requires.nunjucks);
                nunjucksJsonFilter.install(requires.nunjucks);
            }
        }))
        // Use the Fontello icons plugin to scrape for used fonts and generate
        // a font icon file
        .use(icons({
            sets: {
                fa:'fontawesome'
            },
            fontello: {
                name: 'icons'
            },
            fontDir: 'fonts'
        }));

if (cmdArgs.serve) {
    builder = builder.use(serve({
        port: 8080,
        verbose: true
    }))
}

if (cmdArgs.watch) {
    builder = builder.use(watch({
        pattern: '**/*',
        livereload: true
    }))
}

if (cmdArgs.debug) {
    builder = builder.use(debug())
                     .use(debugVerbose());
}

builder = builder.build(function (err) {
    if (err) {
      console.log(err);
    }
    else {
      console.log('Site build complete!');
    }
});
