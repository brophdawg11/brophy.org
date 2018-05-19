const config = {
    isLocal: process.env.NODE_ENV === 'local',
    isDev: null,
    isProd: process.env.NODE_ENV === 'production',
    isClient: process.env.VUE_ENV === 'client',
    isServer: process.env.VUE_ENV === 'server' || typeof window === 'undefined',
    logLevel: process.env.LOG_LEVEL || 'debug',
};

config.isDev = !config.isLocal && !config.isProd;

function fetchDataForComponents(components, store, route) {
    // Execute all component methods in parallel
    return Promise.all(components.map(c => {
        if (c.fetchData) {
            return c.fetchData({ store, route });
        }
        return null;
    }));
}

module.exports = {
    config,
    fetchDataForComponents,
};
