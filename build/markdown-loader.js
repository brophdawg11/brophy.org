/* eslint-disable no-underscore-dangle, import/no-extraneous-dependencies */

const cheerio = require('cheerio');
const { highlightAuto } = require('highlight.js');
const { marked } = require('marked');
const yaml = require('yaml-front-matter');

module.exports = function markdownLoader(source) {
    if (this.cacheable) {
        this.cacheable();
    }
    const parsed = yaml.loadFront(source);
    parsed.__content = marked(parsed.__content);

    const $ = cheerio.load(parsed.__content);

    $('pre').addClass('hljs');

    $('pre code').replaceWith((i, block) => {
        const $e = $(block);
        const text = $e.text();
        const className = $e.attr('class') || '';
        const languageType = className.split('language-').filter(t => t);
        const html = languageType.length ?
            highlightAuto(text, languageType).value :
            highlightAuto(text).value;
        return `<code>${html}</code>`;
    });

    parsed.__content = $.html();

    return `module.exports = ${JSON.stringify(parsed)}`;
};
