const parseMarkdownContent = require('./parse-markdown-content');

module.exports = function markdownLoader(source) {
    /* eslint-disable no-underscore-dangle */
    if (this.cacheable) {
        this.cacheable();
    }
    const obj = parseMarkdownContent(this.resourcePath, source);
    const value = JSON.stringify(obj);
    return `module.exports = ${value}`;
};
