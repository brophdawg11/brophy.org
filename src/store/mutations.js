/* eslint-disable no-param-reassign */

export const INCREMENT = 'INCREMENT';
export const SET_PAGE_TITLE = 'SET_PAGE_TITLE';
export const SET_POST = 'SET_POST';
export const SET_POSTS = 'SET_POSTS';

export default {
    [SET_POST]: (state, payload) => {
        state.post = payload;
    },
    [SET_POSTS]: (state, payload) => {
        state.posts = payload;
    },
};

