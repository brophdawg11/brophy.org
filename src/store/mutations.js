/* eslint-disable no-param-reassign */

export const INCREMENT = 'INCREMENT';
export const SET_PAGE_TITLE = 'SET_PAGE_TITLE';

export default {
    [INCREMENT]: (state, payload) => {
        state.count += payload;
    },
    [SET_PAGE_TITLE]: (state, payload) => {
        state.pageTitle = payload;
    },
};

