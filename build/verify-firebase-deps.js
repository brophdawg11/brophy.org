/* eslint-disable import/no-extraneous-dependencies, no-console */
const _ = require('lodash');
const myDeps = require('../package.json');
const fbDeps = require('../functions/package.json');

console.log('Comparing local dependencies against firebase dependencies');

_.each(myDeps.dependencies, (version, name) => {
    if (fbDeps.dependencies[name] !== version) {
        throw new Error(`Dependency mismatch: ${name}@${version}`);
    }
});


const fbDepsTrimmed = _.omit(fbDeps.dependencies, 'firebase-admin', 'firebase-functions');
_.each(fbDepsTrimmed, (version, name) => {
    if (myDeps.dependencies[name] !== version) {
        throw new Error(`Reverse dependency mismatch? ${name}@${version}`);
    }
});

console.log('Dependencies match!');
