const debug = require('debug')('nunjucks/json-filter');

/**
 * @function jsonFilter
 *
 * @description
 * Convert a given object to json for debugging
 *
 * @param   {Object} value  Javascript object
 * @returns {String}        Resulting Stringified HTML string
 */
function jsonFilter(value) {
    let cache = [],
        result;

    function repeater(k, v) {
        if (typeof v === 'object' && v !== null) {
            if (cache.indexOf(v) !== -1) {
                // Circular reference found, discard key
                return null;
            }
            // Store value in our collection
            cache.push(v);
        }
        return v;
    }

    try {
        result = JSON.stringify(value, repeater, '  ');
        cache = null; // Enable garbage collection
        return `<pre>${result}</pre>`;
    } catch (e) {
        debug('Error stringifying:', e);
        return value;
    }
}


module.exports = jsonFilter;

/**
 * Add filter to nunjucks environment
 */
module.exports.install = env => env.addFilter('json', jsonFilter);
