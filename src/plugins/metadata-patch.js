const debug = require('debug')('metadata-patch'),
    globalData = require('../../contents/global.json'),
    pkg = require('../../package.json');

module.exports = (opts) => {
    debug('opts', opts);

    return (files, metalsmith, done) => {
        metalsmith.metadata({
            site: {
                url: globalData.url,
            },
            package: pkg,
        });
        setImmediate(done);
    };
};
