import Vue from 'vue';
import Vuex from 'vuex';
import createLogger from 'vuex/dist/logger';
import actionLogger from '@store/plugins/action-logger';
import { config } from '@js/isomorphic-utils';
import actions from '@store/actions';
import getters from '@store/getters';
import mutations from '@store/mutations';

// must be present to use vuex
Vue.use(Vuex);

let strict = false;
const plugins = [];

if (config.isDev) {
    // Enable strict mode only in dev environments
    strict = true;

    // Only include expensive debug logging in dev environments
    plugins.push(actionLogger);
    plugins.push(createLogger({
        collapsed: true,
        transformer(state) {
            if (config.isServer) {
                // Transform the state before logging it on the server
                /* eslint-disable no-param-reassign */
                state = '{ ... }';
                /* eslint-enable no-param-reassign */
            }
            return state;
        },
        mutationTransformer(mutation) {
            if (config.isServer) {
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
            url: 'http://brophy.org',
            title: 'Matt Brophy',
            description: 'Matt Brophy\'s Website',
            rss: {
                title: 'Matt Brophy\'s Blog',
            },
            cssFile: 'css/app.css',
            owner: 'Matt Brophy',
            pageSize: 6,
            asides: [
                '/static/images/asides/bike.jpg',
                '/static/images/asides/bike2.jpg',
                '/static/images/asides/bike3.jpg',
                '/static/images/asides/bike4.jpg',
                '/static/images/asides/bikes.jpg',
            ],
            post: null,
            posts: null,
        },
        getters,
        mutations,
        actions,
    });
}
