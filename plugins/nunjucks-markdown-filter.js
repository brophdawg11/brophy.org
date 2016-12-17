var marked = require('marked');

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
function mdFilter(value, stripPara) {
  var result;
  stripPara = stripPara !== false;
  try {
    result = marked(value).trim();
    if (stripPara) {
      result = result.replace(/^<p>|<\/p>$/g, '');
    }
    return result;
  } catch (e) {
    console.error('Error processing markdown:', e);
    return value;
  }
}

module.exports = mdFilter;

/**
 * Add filter to nunjucks environment
 */
module.exports.install = function(env, customName) {
  env.addFilter(customName || 'md', mdFilter);
};
