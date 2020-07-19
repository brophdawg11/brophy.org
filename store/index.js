import Vuex from 'vuex';
import createLogger from 'vuex/dist/logger';

import actionLogger from './plugins/action-logger';

let strict = false;
const plugins = [];

if (process.env.NODE_ENV !== 'production') {
    // Enable strict mode only in dev environments
    strict = true;

    // Only include expensive debug logging in dev environments
    plugins.push(actionLogger);
    plugins.push(createLogger({
        collapsed: true,
        transformer(state) {
            if (process.env.VUE_ENV === 'server') {
                // Transform the state before logging it on the server
                return '{ ... }';
            }
            return state;
        },
        mutationTransformer(mutation) {
            if (process.env.VUE_ENV === 'server') {
                return mutation.type;
            }
            return mutation;
        },
    }));
}

// Expose a factory function to ensure a new store per request
export default function createStore(/* request */) {
    return new Vuex.Store({
        strict,
        plugins,
        state: {
            url: 'https://www.brophy.org',
            title: 'Matt Brophy',
            description: 'Matt Brophy\'s Website',
        },
    });
}
