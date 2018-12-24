import Vue from 'vue';
import VueCookie from 'vue-cookie';
import App from '@components/App.vue';

import isomorphicUtils from '@js/isomorphic-utils';
import createRouter from '@js/router';
import createStore from '@js/store';

// Isomorphic function used by both the client and the server to ensure we
// create identical Vue app instances
export default function createApp({ request, initialState }) {
    const store = createStore(request);

    if (isomorphicUtils.config.isClient) {
        Vue.use(VueCookie);

        // Do this here before creating the router, so that any router navigation
        // guards have access to a hydrated store
        if (initialState) {
            store.replaceState(initialState);
        }
    }

    const router = createRouter(store);

    const app = new Vue({
        router,
        store,
        render: h => h(App),
    });

    return { app, router, store };
}
