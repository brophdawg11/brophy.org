/**
 * @type {import('@remix-run/dev/config').AppConfig}
 */
module.exports = {
  ignoredRouteFiles: ['.*'],
  serverModuleFormat: 'cjs',
  serverDependenciesToBundle: ['marked'],
  future: {
    v2_dev: true,
    v2_errorBoundary: true,
    v2_headers: true,
    v2_meta: true,
    v2_normalizeFormMethod: true,
    v2_routeConvention: true,
  },
};
