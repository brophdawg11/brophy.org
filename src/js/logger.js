const logatim = require('logatim');

const isomorphicUtils = require('./isomorphic-utils');

const level = isomorphicUtils.config.logLevel.toUpperCase();
const env = isomorphicUtils.config.isServer ? 'node' : 'browser';

logatim.setLevel(level);
logatim.setEnv(env);

logatim.info(`Set log level to '${level}'`);
logatim.info(`Set log environment to '${env}'`);

module.exports = logatim;
