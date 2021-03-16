/* eslint-disable no-underscore-dangle, import/no-extraneous-dependencies */
const fs = require('fs');
const path = require('path');

const cheerio = require('cheerio');
const marked = require('marked');
const mkdirp = require('mkdirp');
const pify = require('pify');
const readingTime = require('reading-time');
const vagueTime = require('vague-time');
const yaml = require('yaml-front-matter');

function excerpt(body) {
    const $ = cheerio.load(body);
    return $.html($('p').first())
        .trim()
        .replace(/^<p>/, '')
        .replace(/<\/p>$/, '');
}

function haveFilesChanged(options) {
    const { contentDir, outputDir, outputFile } = options;
    const filePath = path.join(path.resolve(outputDir), outputFile);
    if (!fs.existsSync(filePath)) {
        return true;
    }
    const lastGenTime = fs.statSync(filePath).mtimeMs;
    return fs.readdirSync(contentDir)
        .map(f => fs.statSync(path.join(path.resolve(contentDir), f)))
        .some(stats => stats.mtimeMs > lastGenTime);
}

function mapContents(contentDir, files, includeDraft) {
    return files
        .map(f => path.join(path.resolve(contentDir), f))
        .filter(f => fs.statSync(f).isFile() && /\.md$/.test(f))
        .map(f => {
            const source = fs.readFileSync(f);
            const obj = yaml.loadFront(source);
            const slug = path.basename(f, '.md');
            const enhanced = Object.assign(obj, {
                permalink: `/post/${slug}`,
                excerpt: excerpt(marked(obj.__content)),
                readingTime: readingTime(obj.__content).text,
                relativeDate: vagueTime.get({ to: obj.postDate }),
                slug,
            });
            delete enhanced.__content;
            return enhanced;
        })
        .filter(p => !p.draft || includeDraft)
        // Reverse chronological order
        // eslint-disable-next-line no-nested-ternary
        .sort((a, b) => (a.postDate < b.postDate ? 1 : (a.postDate > b.postDate ? -1 : 0)));
}

class ManifestPlugin {
    constructor(options) {
        this.options = {
            contentDir: './content',
            outputDir: './build',
            outputFile: 'contents.json',
            pretty: true,
            ...options,
        };
    }

    readDir() {
        const { contentDir } = this.options;
        this.logger.debug(`Loading contents from ${contentDir}`);
        return new Promise((resolve, reject) => {
            fs.readdir(contentDir, (err, files) => {
                if (err) {
                    reject(new Error(`Unable to read directory: ${contentDir}`));
                    return;
                }
                resolve(files);
            });
        });
    }

    processContents(files) {
        const { contentDir, includeDraft, pretty } = this.options;
        const contents = mapContents(contentDir, files, includeDraft);
        return JSON.stringify({ contents }, null, pretty ? 4 : null);
    }

    writeFile(fileContents) {
        const { outputDir, outputFile } = this.options;
        const filePath = path.join(path.resolve(outputDir), outputFile);
        this.logger.debug(`Writing contents to ${filePath}`);
        const outputPath = path.dirname(filePath);
        return mkdirp(outputPath).then(() => pify(fs.writeFile)(filePath, fileContents));
    }

    apply(compiler) {
        const pluginName = this.constructor.name;
        this.logger = compiler.getInfrastructureLogger(pluginName);
        this.logger.debug('Loaded with options', this.options);
        compiler.hooks.beforeCompile.tapAsync('run', (compilation, callback) => {
            if (!this.options.forceRebuild && !haveFilesChanged(this.options)) {
                callback();
                return;
            }
            this.readDir()
                .then(files => this.processContents(files))
                .then(data => this.writeFile(data))
                .then(() => callback(), err => callback(err));
        });
    }
}

module.exports = ManifestPlugin;
