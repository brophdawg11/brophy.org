// we would like you to use debug
var debug = require('debug')('debug-verbose'),
    _ = require('lodash');

// Expose `plugin`.
module.exports = plugin;


function plugin(opts) {
    debug('opts', opts);

    return function (files, metalsmith, done){
        setImmediate(done);
        _.each(files, function (file, name) {
            debug('file', name, _.keys(file));
        });
        debug('metalsmith', metalsmith)
    };
}
