/* eslint-disable no-console, no-underscore-dangle */
const path = require('path');
const marked = require('marked');

/* eslint-disable import/no-extraneous-dependencies */
const cheerio = require('cheerio');
const hljs = require('highlight.js');
const readingTime = require('reading-time');
const yaml = require('yaml-front-matter');
/* eslint-enable import/no-extraneous-dependencies */

function excerpt(body) {
    const $ = cheerio.load(body);
    return $.html($('p').first())
        .trim()
        .replace(/^<p>/, '')
        .replace(/<\/p>$/, '');
}

function parseMarkdown(markdown) {
    const renderer = new marked.Renderer();

    // Add hash links for headings
    renderer.heading = (text, level, raw, slugger) => {
        const escapedText = slugger.slug(raw);

        return `
            <h${level}>
                <a name="${escapedText}" href="#${escapedText}">#</a>
                ${text}
            </h${level}>
        `;
    };

    return marked(markdown, {
        renderer,
        langPrefix: 'hljs ',
        highlight(code, lang) {
            const { value } = lang ?
                hljs.highlight(lang, code) :
                hljs.highlightAuto(code);
            return value;
        },
    });
}

module.exports = function addBlogMetadata(filepath, source) {
    const obj = yaml.loadFront(source);
    const slug = path.basename(filepath, '.md');

    // Overwrite markdown with parsed markdown
    obj.__content = parseMarkdown(obj.__content);

    return Object.assign(obj, {
        excerpt: excerpt(obj.__content),
        permalink: `/post/${slug}`,
        readingTime: readingTime(obj.__content),
        slug,
    });
};
