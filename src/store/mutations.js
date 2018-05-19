/* eslint-disable no-param-reassign */

export const INCREMENT = 'INCREMENT';
export const SET_PAGE_TITLE = 'SET_PAGE_TITLE';
export const SET_POST = 'SET_POST';
export const SET_POSTS = 'SET_POSTS';

export default {
    [INCREMENT]: (state, payload) => {
        state.count += payload;
    },
    [SET_PAGE_TITLE]: (state, payload) => {
        state.pageTitle = payload;
    },
    [SET_POST]: (state, payload) => {
        state.post = payload;
    },
    [SET_POSTS]: (state, payload) => {
        state.posts = payload;
    },
};

