export const SET_PAGE_SCOPE = 'SET_PAGE_SCOPE';

const handlers = {
    [SET_PAGE_SCOPE](state, scope) {
        state.pageScope = scope;
    },
};

export default handlers;
