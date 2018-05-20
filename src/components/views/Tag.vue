<template>
    <DefaultLayout>

        <h1 class="c-tags__title">
            <span class="c-tags__title-tag">{{ tag }}</span> Posts
        </h1>

        <PostList :posts="posts" />

    </DefaultLayout>
</template>

<script>
import { get, includes } from 'lodash-es';

import { SET_POSTS } from '@store/mutations';

import DefaultLayout from '@components/layouts/DefaultLayout.vue';
import PostList from '@components/PostList.vue';

export default {
    components: {
        DefaultLayout,
        PostList,
    },
    fetchData({ store }) {
        return import(
            /* webpackChunkName: "contents" */
            '@dist/contents.json',
        ).then(contents => {
            store.commit(SET_POSTS, contents.contents);
        });
    },
    data() {
        return {
            tag: this.$route.params.tag,
        };
    },
    computed: {
        posts() {
            const postHasTag = p => includes(get(p, 'tags', '').split(','), this.tag);
            return this.$store.state.posts
                .filter(p => postHasTag(p));
        },
    },
};
</script>
