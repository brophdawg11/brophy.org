const marked = require('marked');

/* eslint-disable import/no-extraneous-dependencies */
const hljs = require('highlight.js');
const yaml = require('yaml-front-matter');
/* eslint-enable import/no-extraneous-dependencies */

module.exports = function markdownLoader(source) {
    /* eslint-disable no-underscore-dangle */
    if (this.cacheable) {
        this.cacheable();
    }
    const options = {
        langPrefix: 'hljs ',
        highlight(code, lang) {
            const { value } = lang ?
                hljs.highlight(lang, code) :
                hljs.highlightAuto(code);
            return value;
        },
    };
    const obj = yaml.loadFront(source);
    obj.__content = marked(obj.__content, options);
    const value = JSON.stringify(obj);
    return `module.exports = ${value}`;
};
