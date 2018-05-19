export const SET_INFO = 'SET_INFO';

export default {
    namespaced: true,
    // state must be a function so the module can be instantiated
    // multiple times
    state: () => ({
        info: 'I\'m some initial info from the Vuex \'about\' module',
    }),
    /* eslint-disable no-param-reassign */
    mutations: {
        [SET_INFO](state, payload) {
            state.info = payload;
        },
    },
};
