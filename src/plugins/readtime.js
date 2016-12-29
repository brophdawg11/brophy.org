const readingTime = require('reading-time'),
    debug = require('debug')('readtime'),
    defaults = require('lodash/defaults'),
    globule = require('globule');

module.exports = function readtime(_opts) {
    const opts = defaults(_opts || {}, {
        path: '*.md',
    });

    return (files, metalsmith, done) => {
        Object.keys(files).forEach((file) => {
            const data = files[file];

            debug('checking file: %s', file);

            if (!globule.isMatch(opts.path, file)) {
                return;
            }

            if (data.readtime) {
                return; // don't mutate data
            }

            debug('storing readtime: %s', file, data.contents);
            data.readtime = readingTime(data.contents.toString());
            debug(data.readtime);
        });

        setImmediate(done);
    };
};
