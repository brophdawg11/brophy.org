<template>
    <DefaultLayout class="about">
        <p>Welcome to the about page</p>
        <p>My route parameter was: {{ routeParam }}</p>
        <p>{{ info }}</p>
        <p>Count = {{ count }}, Count<sup>2</sup> = {{ countSquared }}</p>
    </DefaultLayout>
</template>

<script>
import { get } from 'lodash-es';
import { mapGetters, mapMutations, mapState } from 'vuex';

import { LOAD_PAGE_TITLE } from '@store/actions';
import aboutModule, { SET_INFO } from '@store/modules/about';

import BaseView from '@components/views/BaseView.vue';
import DefaultLayout from '@components/layouts/DefaultLayout.vue';

const vuexModuleName = 'about';

export default {
    name: 'About',
    components: {
        DefaultLayout,
    },
    extends: BaseView,
    // Indicate that this component uses a dynamic Vuex module
    vuex: {
        moduleName: vuexModuleName,
        module: aboutModule,
    },
    fetchData({ store, route }) {
        const title = `About (${route.params.param})`;
        return store.dispatch(LOAD_PAGE_TITLE, title);
    },
    computed: {
        // Map in state from the root module
        ...mapState([
            'count',
        ]),
        // Map in state from the about module
        ...mapState(vuexModuleName, [
            'info',
        ]),
        ...mapGetters([
            'countSquared',
        ]),
        routeParam() {
            return get(this.$route, 'params.param');
        },
    },
    methods: {
        // Map in mutations from the about module
        ...mapMutations(vuexModuleName, {
            setInfo: SET_INFO,
        }),
    },
};
</script>

<style lang="scss" scoped>
.about {
    text-align: center;
}
</style>
