var debug = require('debug')('global-json'),
    path = require('path'),
    globule = require('globule'),
    _ = require('lodash');

module.exports = function(opts) {

    opts = _.extend({
        key: 'global',
        glob: '**/global.json'
    }, (opts || {}));

    return function(files, metalsmith, done) {
        _.each(files, function (file, key) {
            var globalData;
            if (globule.isMatch(opts.glob, key)) {
                globalData = JSON.parse(file.contents);
                _.each(files, _.partial(_.set, _, opts.key, globalData));
                debug('Added globalData', globalData);
            }
        });
        done();
    };
};
