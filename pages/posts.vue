<template>
    <PostList :posts="posts" />
</template>

<script>
import { SET_POSTS } from '~/store';

import PostList from '~/components/PostList.vue';

export default {
    components: {
        PostList,
    },
    asyncData({ store }) {
        return import(/* webpackChunkName: "contents" */ '~/dist/contents.json')
            .then(contents => store.commit(SET_POSTS, contents.contents));
    },
    computed: {
        posts() {
            return this.$store.state.posts;
        },
    },
};
</script>
