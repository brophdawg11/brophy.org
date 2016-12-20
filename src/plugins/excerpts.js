const debug = require('debug')('excerpts'),
    extname = require('path').extname,
    cheerio = require('cheerio');

module.exports = () => {
    return (files, metalsmith, done) => {
        Object.keys(files).forEach((file) => {
            const data = files[file];

            debug('checking file: %s', file);

            if (!/\.html?/.test(extname(file))) {
                return;
            }

            if (typeof data.excerpt === 'string' && data.excerpt.length) {
                return; // don't mutate data
            }

            debug('storing excerpt: %s', file);
            const $ = cheerio.load(data.contents.toString());
            data.excerpt = $('p').first().text().trim();
        });

        setImmediate(done);
    };
};
