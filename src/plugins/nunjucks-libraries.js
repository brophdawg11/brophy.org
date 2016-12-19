const debug = require('debug')('nunjucks-libraries'),
    moment = require('moment'),
    _ = require('lodash');

module.exports = (opts) => {
    debug('opts', opts);

    return (files, metalsmith, done) => {
        const metadata = metalsmith.metadata();

        debug('Adding lodash to metadata');
        metadata._ = _;

        debug('Adding moment to metadata');
        metadata.moment = moment;
        done();
    };
};
