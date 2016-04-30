var marked = require('marked');

function getFilter(value) {
  var result;
  try {
    result = marked(value);
    result = result.replace(/^<p>|<\/p>$/g, '');
    return result;
  } catch (e) {
    console.error(e);
    return value;
  }
}

module.exports = getFilter;

/**
 * Add filter to nunjucks environment
 */
module.exports.install = function(env, customName) {
  env.addFilter(customName || 'md', getFilter);
};
