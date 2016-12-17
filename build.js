var metalsmith = require('metalsmith'),
    assets = require('metalsmith-assets'),
    json = require('metalsmith-json'),
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
    nunjucksMdFilter = require('./plugins/nunjucks-markdown-filter'),
    brophyDebug = require('./plugins/debug'),
    nunjucksLibraries = require('./plugins/nunjucks-libraries'),
    moment = require('moment'),
    cmdArgs = require('yargs').argv,
    _ = require('lodash'),
    builder;

builder =
    metalsmith(__dirname)
        .metadata({
            site: {
              title: 'brophy.org',
              url: 'https://brophy.org',

            }
        })
        .source('./contents')
        .destination('./output')
        .clean(true)
        .use(assets({
            source: './assets', // relative to the working directory
            destination: './assets' // relative to the build directory
        }))
        .use(nunjucksLibraries())
        .use(json())
        .use(metadata({
            directory: 'contents/**/*.json'
        }))
        .use(markdown())
        .use(typography({
            lang: "en"
        }))
        .use(excerpts())
        .use(collections({
            posts: {
                pattern: 'posts/**.html',
                sortBy: 'publishDate',
                reverse: true
            }
        }))
        .use(sass({
            outputStyle: "expanded"
        }))
        .use(branch('posts/**.html')
                 .use(permalinks({
                        pattern: 'posts/:title',
                        relative: false
                      })))
        // .use(branch('!posts/**.html')
        //          .use(branch('!index.md')
        //               .use(permalinks({
        //                   relative: false
        //               }))))
        .use(templates({
            engine: 'nunjucks',
            exposeConsolidate: function (requires) {
                requires.nunjucks = nunjucks.configure();
                nunjucksMdFilter.install(requires.nunjucks);
            }
        }))
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
                     .use(brophyDebug());
}

builder = builder.build(function (err) {
    if (err) {
      console.log(err);
    }
    else {
      console.log('Site build complete!');
    }
});
