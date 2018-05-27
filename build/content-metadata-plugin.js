/* eslint-disable no-console, no-underscore-dangle */
const fs = require('fs');
const path = require('path');

/* eslint-disable import/no-extraneous-dependencies */
const mkdirp = require('mkdirp');
/* eslint-enable import/no-extraneous-dependencies */

const parseMarkdownContent = require('./parse-markdown-content');

function mapContents(contentDir, files) {
    return files
        .map(f => path.join(path.resolve(contentDir), f))
        .filter(f => fs.statSync(f).isFile() && /\.md$/.test(f))
        .map(f => {
            const source = fs.readFileSync(f);
            const obj = parseMarkdownContent(f, source);
            delete obj.__content;
            return obj;
        });
}

class ContentMetadataPlugin {
    constructor(options) {
        this.options = Object.assign({}, {
            contentDir: './content',
            outputDir: './dist/',
            outputFile: 'contents.json',
            pretty: true,
            debug: false,
        }, options);
        this.debug('Loaded plugin with options\n', this.options);
    }

    static log(...args) {
        console.log('[ContentMetadataPlugin]', ...args);
    }

    debug(...args) {
        if (this.options.debug) {
            ContentMetadataPlugin.log(...args);
        }
    }

    readDir() {
        const { contentDir } = this.options;
        this.debug(`Loading contents from ${contentDir}`);
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

    processContents(compilation, files) {
        const {
            contentDir,
            outputDir,
            outputFile,
            pretty,
        } = this.options;
        const contents = mapContents(contentDir, files);
        const outputPath = outputDir ?
            path.resolve(outputDir) :
            compilation.options.output.path;
        const filePath = path.join(outputPath, outputFile);
        const fileContents = JSON.stringify({ contents }, null, pretty ? '  ' : null);
        return { filePath, fileContents };
    }

    writeFile({ filePath, fileContents }) {
        return new Promise((resolve, reject) => {
            this.debug(`Writing contents to ${filePath}`);
            const outputPath = path.dirname(filePath);
            mkdirp(outputPath, (e1) => {
                if (e1) {
                    reject(new Error(`Unable to create directory ${outputPath}`, e1));
                    return;
                }
                fs.writeFile(filePath, fileContents, e2 => {
                    if (e2) {
                        reject(new Error(`Unable to write to: ${filePath}`, e2));
                        return;
                    }
                    ContentMetadataPlugin.log(`Generated ${filePath}`);
                    resolve();
                });
            });
        });
    }

    apply(compiler) {
        compiler.plugin('run', (compilation, callback) => {
            this.readDir()
                .then(files => this.processContents(compilation, files))
                .then(data => this.writeFile(data))
                .then(() => callback(), err => callback(err));
        });
    }
}

module.exports = ContentMetadataPlugin;
