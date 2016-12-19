const debug = require('debug')('debug-verbose'),
    _ = require('lodash');

module.exports = (opts) => {
    debug('opts', opts);

    return (files, metalsmith, done) => {
        _.each(files, (file, name) => debug('file', name, _.keys(file)));
        debug('metalsmith', metalsmith);
        setImmediate(done);
    };
};
