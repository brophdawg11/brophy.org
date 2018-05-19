import { INCREMENT, SET_PAGE_TITLE } from './mutations';

export const INCREMENT_ASYNC = 'INCREMENT_ASYNC';
export const LOAD_PAGE_TITLE = 'LOAD_PAGE_TITLE';

export default {
    [INCREMENT_ASYNC]: ({ commit }, payload) => {
        commit(INCREMENT, payload);
        return new Promise(resolve => setTimeout(() => {
            commit(INCREMENT, payload);
            resolve();
        }, 1000));
    },
    [LOAD_PAGE_TITLE]: ({ commit }, payload) => {
        const promise = new Promise(resolve => setTimeout(() => {
            commit(SET_PAGE_TITLE, payload);
            resolve();
        }, 250));
        return promise;
    },
};

