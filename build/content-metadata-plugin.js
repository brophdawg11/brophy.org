/* eslint-disable no-console, no-underscore-dangle */
const fs = require('fs');
const path = require('path');
const marked = require('marked');

/* eslint-disable import/no-extraneous-dependencies */
const yaml = require('yaml-front-matter');
const cheerio = require('cheerio');
const readingTime = require('reading-time');
/* eslint-enable import/no-extraneous-dependencies */

function excerpt(body) {
    const $ = cheerio.load(body);
    return $.html($('p').first())
        .trim()
        .replace(/^<p>/, '')
        .replace(/<\/p>$/, '');
}

class ContentMetadataPlugin {
    constructor(options) {
        this.options = Object.assign({}, {
            contentDir: './content',
            outputDir: './dist/',
            outputFile: 'contents.json',
            pretty: true,
        }, options);
    }

    apply(compiler) {
        const {
            contentDir,
            outputDir,
            outputFile,
            pretty,
        } = this.options;
        compiler.plugin('run', (compilation, callback) => {
            const contents = fs.readdirSync(contentDir)
                .map(f => path.join(path.resolve(contentDir), f))
                .filter(f => fs.statSync(f).isFile() && /\.md$/.test(f))
                .map(f => {
                    const source = fs.readFileSync(f);
                    const obj = yaml.parse(source);
                    const enhanced = Object.assign(obj, {
                        excerpt: excerpt(marked(obj.__content)),
                        readingTime: readingTime(obj.__content),
                        slug: path.basename(f, '.md'),
                    });
                    delete enhanced.__content;
                    return enhanced;
                });
            const outputPath = outputDir ?
                path.resolve(outputDir) :
                compilation.options.output.path;
            const filePath = path.join(outputPath, outputFile);
            const fileContents = JSON.stringify({ contents }, null, pretty ? '  ' : null);
            fs.writeFileSync(filePath, fileContents);
            console.log(`[ContentMetadataPlugin] Generated ${outputFile}`);
            callback();
        });
    }
}

module.exports = ContentMetadataPlugin;
