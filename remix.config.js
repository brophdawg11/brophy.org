/**
 * @type {import('@remix-run/dev/config').AppConfig}
 */
module.exports = {
  ignoredRouteFiles: ['.*'],
  serverModuleFormat: 'cjs',
  serverDependenciesToBundle: ['marked'],
  future: {},
};
