const debug = require('debug')('metadata-patch');

module.exports = (opts) => {
    debug('opts', opts);

    return (files, metalsmith, done) => {
        metalsmith.metadata(opts);
        setImmediate(done);
    };
};
