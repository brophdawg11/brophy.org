const debug = require('debug')('nunjucks/markdown-filter'),
    marked = require('marked');

/**
 * @function mdFilter
 *
 * @description
 * Convert a given markdown string to HTML, stripping enclosing <p> tags by
 * default
 *
 * @param   {String} value             Markdown string
 * @param   {Boolean} [stripPara=true] Strip enclosing <p> tags from resulting
 *                                     HTML.  Defaults to true.
 * @returns {String}                   Resulting HTML string
 */
function mdFilter(value, _stripPara) {
    const stripPara = _stripPara !== false;
    let result;

    try {
        result = marked(value).trim();
        if (stripPara) {
            result = result.replace(/^<p>|<\/p>$/g, '');
        }
        return result;
    } catch (e) {
        debug('Error processing markdown:', e);
        return value;
    }
}

module.exports = mdFilter;

/**
 * Add filter to nunjucks environment
 */
module.exports.install = env => env.addFilter('md', mdFilter);
