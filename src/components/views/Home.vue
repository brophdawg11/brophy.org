<template>
    <DefaultLayout class="home">
        <p>Welcome to the home page</p>
        <p>Count = {{ count }}, Count<sup>2</sup> = {{ countSquared }}</p>
        <button @click="increment(1)">Increment</button>
        <button @click="incrementAsync(1)">Increment + Async</button>
    </DefaultLayout>
</template>

<script>
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex';

import { INCREMENT_ASYNC, LOAD_PAGE_TITLE } from '@store/actions';
import { INCREMENT } from '@store/mutations';

import BaseView from '@components/views/BaseView.vue';
import DefaultLayout from '@components/layouts/DefaultLayout.vue';

export default {
    name: 'Home',
    components: {
        DefaultLayout,
    },
    extends: BaseView,
    fetchData({ store }) {
        return store.dispatch(LOAD_PAGE_TITLE, 'Home');
    },
    computed: {
        ...mapState([
            'count',
        ]),
        ...mapGetters([
            'countSquared',
        ]),
    },
    methods: {
        ...mapActions({
            incrementAsync: INCREMENT_ASYNC,
        }),
        ...mapMutations({
            increment: INCREMENT,
        }),
    },
};
</script>

<style lang="scss" scoped>
.home {
    text-align: center;
}
</style>
