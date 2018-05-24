import logger from '@js/logger';
import createApp from '@js/create-app';
import { fetchDataForComponents } from '@js/isomorphic-utils';

// Server side data loading approach based on:
// https://ssr.vuejs.org/en/data.html#client-data-fetching

function initServerRender(context) {
    return new Promise((resolve, reject) => {
        const { app, router, store } = createApp({ request: context.req });

        function onReady() {
            const components = router.getMatchedComponents();

            if (!components.length) {
                logger.warn(`No matched components for route: ${context.req.url}`);
                return reject({ code: 404, message: 'Not Found' });
            }

            // Register any dynamic Vuex modules.  Registering the store
            // modules as part of the component allows the module to be bundled
            // with the async-loaded component and not in the initial root store
            // bundle
            components
                .filter(c => 'vuex' in c)
                .forEach(c => {
                    logger.info('Registering dynamic Vuex module:', c.vuex.moduleName);
                    store.registerModule(c.vuex.moduleName, c.vuex.module, {
                        preserveState: store.state[c.vuex.moduleName] != null,
                    });
                });

            return fetchDataForComponents(components, store, router.currentRoute)
                // Set initialState for client hydration
                .then(() => Object.assign(context, {
                    initialState: JSON.stringify(store.state),
                }))
                .then(() => resolve(app))
                .catch(e => {
                    logger.error('Caught server-side error in fetchData', e);
                    return reject(e);
                });
        }

        router.push(context.url);
        router.onReady(onReady, reject);
    });
}

export default initServerRender;
