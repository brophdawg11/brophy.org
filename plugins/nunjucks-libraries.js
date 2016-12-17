var debug = require('debug')('nunjucks-libraries'),
    moment = require('moment');
    _ = require('lodash');

module.exports = function(opts) {
    return function(files, metalsmith, done) {
        var metadata = metalsmith.metadata();

        debug('Adding lodash to metadata');
        metadata['_'] = _;

        debug('Adding moment to metadata');
        metadata['moment'] = moment;
        done();
    };
};
