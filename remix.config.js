/**
 * @type {import('@remix-run/dev/config').AppConfig}
 */
module.exports = {
  ignoredRouteFiles: ['.*'],
  future: {
    v2_errorBoundary: true,
    v2_meta: true,
    v2_normalizeFormMethod: true,
    v2_routeConvention: true,
    unstable_dev: true,
  },
};
