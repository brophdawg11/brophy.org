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
    var cache = [],
        result;

    function repeater(key, value) {
        if (typeof value === 'object' && value !== null) {
            if (cache.indexOf(value) !== -1) {
                // Circular reference found, discard key
                return;
            }
            // Store value in our collection
            cache.push(value);
        }
        return value;
    }

    try {
        result = JSON.stringify(value, repeater, '  ');
        cache = null; // Enable garbage collection
        return '<pre>' + result + '</pre>';
    } catch (e) {
        console.error('Error stringifying:', e);
        return value;
    }
}


module.exports = jsonFilter;

/**
 * Add filter to nunjucks environment
 */
module.exports.install = function(env) {
    env.addFilter('json', jsonFilter);
};
